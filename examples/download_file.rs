use anyhow::Result;
use multipart_downloader_lib::download_client::DownloadClient;

#[tokio::main]
async fn main() -> Result<()> {
    let mut client = DownloadClient::new();
    client.with_parts(50).set_preallocate_space(false);
    match client
        .download(
            "https://bungi.mm.fcix.net/ubuntu-releases/24.04.1/ubuntu-24.04.1-desktop-amd64.iso",
            "./ubuntu.iso",
            |progress| {
                let percentage =
                    (progress.bytes_downloaded as f64 / progress.total_bytes as f64) * 100.0;
                let mb_per_sec = progress.bytes_per_second as f64 / 1024.0 / 1024.0;
                println!("Downloading {:.2}% {:.2}MB/s", percentage, mb_per_sec);
            },
        )
        .await
    {
        Ok(_) => {
            println!("Download complete");
        }
        Err(e) => {
            eprintln!("Failed to download test file: {:?}", e);
        }
    }
    Ok(())
}
