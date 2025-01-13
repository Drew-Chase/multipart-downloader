use multipart_downloader_lib::download_client::DownloadProgress;
use tauri::ipc::Channel;
#[tauri::command]
async fn download(
    url: String,
    parts: u16,
    allocate: bool,
    filepath: String,
    on_event: Channel<DownloadProgress>,
) -> Result<(), String> {
    let mut client = multipart_downloader_lib::download_client::DownloadClient::new();
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

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![download])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
