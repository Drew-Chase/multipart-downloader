#[cfg(not(feature = "log"))]
pub use crate::log_stub::*;
use anyhow::{Context, Result};
use http::HeaderMap;
#[cfg(feature = "log")]
use log::*;
use reqwest::Client;
use std::ops::AddAssign;
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex};
use tokio::io::AsyncWriteExt;
use tokio::sync::Semaphore;
use tokio::time::Instant;

#[derive(Debug, Clone)]
pub struct DownloadClient {
    client: Client,
    parts: u16,
    concurrent_downloads: u16,
    preallocate_space: bool,
    parts_temp_dir: Option<PathBuf>,
    proxies: Option<Vec<String>>,
}

#[derive(Default, Debug, Clone, Copy)]
pub struct DownloadProgress {
    pub bytes_downloaded: u64,
    pub total_bytes: u64,
    pub parts_downloaded: u16,
    pub parts_total: u16,
    pub bytes_per_second: u64,
}

struct DownloadPart {
    part_number: u16,
    bytes_start: u64,
    bytes_end: u64,
}

impl Default for DownloadClient {
    fn default() -> Self {
        Self {
            client: Client::new(),
            parts: 10,
            concurrent_downloads: 10,
            proxies: None,
            preallocate_space: false,
            parts_temp_dir: None,
        }
    }
}

impl DownloadClient {
    pub fn new() -> Self {
        Self::default()
    }
    pub fn with_proxies(&mut self, proxies: Vec<String>) -> &mut Self {
        self.proxies = Some(proxies);
        self
    }
    pub fn with_parts(&mut self, parts: u16) -> &mut Self {
        self.parts = parts;
        self
    }
    pub fn with_concurrent_downloads(&mut self, concurrent_downloads: u16) -> &mut Self {
        self.concurrent_downloads = concurrent_downloads;
        self
    }

    pub fn set_preallocate_space(&mut self, preallocate_space: bool) -> &mut Self {
        self.preallocate_space = preallocate_space;
        self
    }

    pub fn set_parts_temp_dir(&mut self, parts_temp_dir: Option<PathBuf>) -> &mut Self {
        self.parts_temp_dir = parts_temp_dir;
        self
    }

    async fn get_headers(&self, url: &str) -> Result<HeaderMap> {
        let response = self
            .client
            .head(url)
            .send()
            .await
            .with_context(|| format!("Failed to send HEAD request to URL: {}", url))?;
        Ok(response.headers().clone())
    }

    pub async fn get_content_length(&self, headers: &HeaderMap) -> Result<u64> {
        let content_length = headers
            .get("content-length")
            .context("Failed to get content length")?
            .to_str()?
            .parse()?;
        Ok(content_length)
    }

    pub async fn try_get_filename(&self, headers: &HeaderMap) -> Result<String> {
        let content_disposition = headers
            .get("Content-Disposition")
            .context("Missing Content-Disposition header in response")?;

        let filename = content_disposition
            .to_str()
            .context("Invalid Content-Disposition header value")?
            .split(';')
            .map(str::trim)
            .find(|part| part.starts_with("filename="))
            .and_then(|filename_part| filename_part.strip_prefix("filename="))
            .map(|s| s.trim_matches('"'))
            .ok_or_else(|| anyhow::anyhow!("Filename not found in Content-Disposition header"))?;

        Ok(filename.to_string())
    }
    pub async fn download(
        &self,
        url: impl AsRef<str>,
        directory: impl AsRef<Path>,
        filename: Option<String>,
        callback: impl Fn(DownloadProgress) + Send + Sync + 'static + Copy,
    ) -> Result<()> {
        let url = url.as_ref();
        let directory = directory.as_ref();

        let headers = self.get_headers(url).await?;

        // Determine filename from the URL or the given optional filename
        let filename = if let Some(filename) = filename {
            filename
        } else {
            self.try_get_filename(&headers).await?
        };
        let filename = directory.join(filename);

        // Get the total file size for progress tracking
        let file_size = self.get_content_length(&headers).await?;
        let current_progress = DownloadProgress {
            total_bytes: file_size,
            parts_total: self.parts,
            ..DownloadProgress::default()
        };

        // Optionally preallocate space for the file
        if self.preallocate_space {
            self.allocate_space(filename.clone(), file_size)?;
        }

        // Split the file into parts
        let parts = self.identify_parts(file_size)?;

        // Shared progress tracking object
        let progress = Arc::new(Mutex::new(current_progress));

        // A semaphore to control the number of concurrent downloads
        let semaphore = Arc::new(Semaphore::new(self.concurrent_downloads as usize));

        // Start measuring time
        let start_time = Instant::now();

        // Create an internal channel for updates
        let (progress_tx, mut progress_rx) =
            tokio::sync::mpsc::unbounded_channel::<DownloadProgress>();

        // Spawn a task to listen to progress updates and invoke the callback
        tokio::spawn({
            //            let callback = callback.clone();
            async move {
                while let Some(progress) = progress_rx.recv().await {
                    callback(progress); // Call the user-provided callback with the progress
                }
            }
        });

        // Spawn async tasks for each part
        let mut tasks = Vec::new();

        for part in parts {
            // Clone shared resources for each task
            let semaphore = semaphore.clone();
            let progress = progress.clone();
            let progress_tx = progress_tx.clone(); // Pass the sender to each task
            let url = url.to_string(); // Clone the URL
            let filename = filename.clone();
            let client = Arc::new(self.clone()); // Ensure `self` is owned and `'static`

            // Spawn the async task for each part
            tasks.push(tokio::spawn({
                let client = client.clone();
                async move {
                    // Acquire the semaphore permit before starting download
                    let _permit = semaphore.acquire().await;

                    // Download this part
                    client
                        .download_part_with_channel(
                            &part,
                            &url,
                            &filename,
                            progress,
                            progress_tx,
                            start_time,
                        )
                        .await
                }
            }));
        }

        // Wait for all tasks to complete
        for task in tasks {
            task.await.context("Join task failed")??;
        }

        Ok(())
    }

    async fn download_part_with_channel(
        &self,
        part: &DownloadPart,
        url: &str,
        filename: &Path,
        progress: Arc<Mutex<DownloadProgress>>,
        progress_tx: tokio::sync::mpsc::UnboundedSender<DownloadProgress>,
        start_time: Instant,
    ) -> Result<()> {
        let part_size = part.bytes_end - part.bytes_start + 1;
        let temp_file_path = filename.with_extension(format!("part{}", part.part_number));

        // Send an async HTTP GET request with a Range header
        let response = self
            .client
            .get(url)
            .header(
                "Range",
                format!("bytes={}-{}", part.bytes_start, part.bytes_end),
            )
            .send()
            .await
            .context("Failed to send request")?
            .error_for_status()
            .context("Received error response from server")?;

        // Open a file asynchronously for writing the part
        let mut file = tokio::fs::File::create(&temp_file_path)
            .await
            .context("Failed to open temp file for writing")?;
        let mut bytes_written: u64 = 0;

        // Stream the response body in chunks asynchronously
        let mut stream = response.bytes_stream();
        while let Some(chunk) = futures_util::StreamExt::next(&mut stream).await {
            let chunk = chunk.context("Failed to retrieve chunk data")?;

            // Write the chunk to the file asynchronously
            file.write_all(&chunk)
                .await
                .context("Failed to write chunk to temp file")?;

            bytes_written += chunk.len() as u64;

            // Update progress every 4 KB or at the end of the part
            if let Ok(mut progress_lock) = progress.lock() {
                progress_lock.bytes_downloaded += chunk.len() as u64;

                let parts_completed = (progress_lock.bytes_downloaded * self.parts as u64
                    / progress_lock.total_bytes) as u16;
                progress_lock.parts_downloaded = parts_completed;

                progress_lock.bytes_per_second = (progress_lock.bytes_downloaded as f64
                    / start_time.elapsed().as_secs_f64())
                .round() as u64;

                // Send the progress via the channel
                if let Err(e) = progress_tx.send(*progress_lock) {
                    eprintln!("Failed to send progress update: {:?}", e);
                }
            } else {
                eprintln!("Failed to lock progress");
            }
        }

        Ok(())
    }

    async fn download_part_with_updates(
        &self,
        part: &DownloadPart,
        url: &str,
        filename: &Path,
        progress: Arc<Mutex<DownloadProgress>>,
        callback: impl Fn(DownloadProgress) + Send + Sync,
        start_time: Instant,
    ) -> Result<()> {
        let part_size = part.bytes_end - part.bytes_start + 1;
        let temp_file_path = filename.with_extension(format!("part{}", part.part_number));

        // Send an async HTTP GET request with a Range header
        let response = self
            .client
            .get(url)
            .header(
                "Range",
                format!("bytes={}-{}", part.bytes_start, part.bytes_end),
            )
            .send()
            .await
            .context("Failed to send request")?
            .error_for_status()
            .context("Received error response from server")?;

        // Open a file asynchronously for writing the part
        let mut file = tokio::fs::File::create(&temp_file_path)
            .await
            .context("Failed to open temp file for writing")?;
        let mut bytes_written: u64 = 0;

        // Stream the response body in chunks asynchronously
        let mut stream = response.bytes_stream();
        while let Some(chunk) = futures_util::StreamExt::next(&mut stream).await {
            let chunk = chunk.context("Failed to retrieve chunk data")?;

            // Write the chunk to the file asynchronously
            file.write_all(&chunk)
                .await
                .context("Failed to write chunk to temp file")?;

            bytes_written += chunk.len() as u64;

            // Update progress every 4 KB or at the end of the part
            if bytes_written % 4096 == 0 || bytes_written == part_size {
                if let Ok(mut progress_lock) = progress.lock() {
                    progress_lock.bytes_downloaded += chunk.len() as u64;

                    let parts_completed = (progress_lock.bytes_downloaded * self.parts as u64
                        / progress_lock.total_bytes)
                        as u16;
                    progress_lock.parts_downloaded = parts_completed;

                    progress_lock.bytes_per_second = (progress_lock.bytes_downloaded as f64
                        / start_time.elapsed().as_secs_f64())
                    .round() as u64;

                    // Trigger the callback with the updated progress
                    callback(*progress_lock);
                }
            }
        }

        Ok(())
    }

    fn allocate_space(&self, filename: PathBuf, size: u64) -> Result<()> {
        warn!(
            "Pre-allocating space for file {} with size {}",
            filename.display(),
            size
        );
        let file = std::fs::File::create(&filename).with_context(|| {
            format!(
                "Failed to create file {}. Ensure there is enough disk space.",
                filename.display()
            )
        })?;
        file.set_len(size).with_context(|| {
            format!(
                "Failed to allocate {} bytes for file {}. Ensure there is enough disk space.",
                size,
                filename.display()
            )
        })?;
        debug!("Space pre-allocated");
        Ok(())
    }

    fn identify_parts(&self, file_size: u64) -> Result<Vec<DownloadPart>> {
        // Validate the number of parts
        if self.parts == 0 {
            return Err(anyhow::anyhow!(
                "Number of parts must be greater than 0. Current value: {}",
                self.parts
            ));
        }

        // Validate file size against the number of parts
        if file_size < self.parts as u64 {
            return Err(anyhow::anyhow!(
                "File size {} is too small to be divided into {} parts.",
                file_size,
                self.parts
            ));
        }

        let parts = self.parts as u64;
        let base_size = file_size / parts;
        let remainder = file_size % parts;

        let mut result = Vec::with_capacity(self.parts as usize);
        let mut bytes_start: u64 = 0;

        // Distribute file parts
        for index in 0..self.parts {
            let part_size = base_size + if (index as u64) < remainder { 1 } else { 0 };
            let bytes_end = bytes_start
                .checked_add(part_size)
                .and_then(|val| val.checked_sub(1))
                .ok_or_else(|| anyhow::anyhow!("Overflow when calculating bytes_end"))?;

            result.push(DownloadPart {
                part_number: index,
                bytes_start,
                bytes_end,
            });

            // Prepare for the next part
            bytes_start = bytes_end.checked_add(1).ok_or_else(|| {
                anyhow::anyhow!("Overflow when calculating the next part's start position")
            })?;
        }

        // Ensure that the number of parts matches expectations
        anyhow::ensure!(
            result.len() == self.parts as usize,
            "Unexpected number of parts generated. Expected: {}, Got: {}",
            self.parts,
            result.len()
        );

        Ok(result)
    }
}

impl AddAssign for DownloadProgress {
    fn add_assign(&mut self, other: Self) {
        self.bytes_downloaded += other.bytes_downloaded;
        self.total_bytes += other.total_bytes;
        self.parts_downloaded += other.parts_downloaded;
        self.parts_total += other.parts_total;
        self.bytes_per_second = other.bytes_per_second;
    }
}