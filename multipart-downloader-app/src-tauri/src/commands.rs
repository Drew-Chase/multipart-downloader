use multipart_downloader_lib::download_client::{DownloadClient, DownloadProgress};
use tauri::ipc::Channel;

#[tauri::command]
pub async fn download(
    url: String,
    parts: u16,
    allocate: bool,
    filepath: String,
    on_event: Channel<DownloadProgress>,
) -> Result<(), String> {
    let mut client = DownloadClient::new();
    client.with_parts(parts);
    client.set_preallocate_space(allocate);

    client
        .download(url, filepath, move |progress| {
            on_event.send(progress).unwrap_or_else(|err| {
                eprintln!("Error sending progress: {:?}", err);
            });
        })
        .await
        .map_err(|err| format!("Download failed: {:?}", err))?;

    Ok(())
}

#[tauri::command]
pub async fn try_get_filename(url: String) -> Result<String, String> {
    match DownloadClient::try_get_filename_from_url(url.as_str()).await {
        Ok(filename) => Ok(filename),
        Err(err) => Err(err.to_string()),
    }
}

#[tauri::command]
pub async fn get_default_downloads_directory() -> Result<String, String> {
    dirs::download_dir()
        .map(|path| path.to_string_lossy().to_string())
        .ok_or_else(|| "Failed to determine the default downloads directory".to_string())
}
