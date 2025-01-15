use anyhow::Result;
use commands::{download, get_default_downloads_directory, try_get_filename};
use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
};
use tauri::{App, Manager};

mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, args, cwd| {
            let window = app.get_webview_window("main").expect("no main window");
            window.set_focus().expect("Failed to focus on window");
        }))
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            build_system_tray(app)?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            download,
            get_default_downloads_directory,
            try_get_filename
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn build_system_tray(app: &mut App) -> Result<()> {
    let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&quit_i])?;
    let _ = TrayIconBuilder::new().menu(&menu).build(app)?;
    Ok(())
}
