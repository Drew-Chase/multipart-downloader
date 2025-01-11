mod arguments;

use crate::arguments::MultipartDownloaderArguments;
use anyhow::Result;
use clap::Parser;
use colored::Colorize;
use std::path::PathBuf;
use std::sync::Arc;

#[tokio::main]
async fn main() -> Result<()> {
    let args = MultipartDownloaderArguments::parse();
    let mut client = multipart_downloader_lib::download_client::DownloadClient::new();
    client.with_parts(args.parts);
    client.set_preallocate_space(args.preallocate_space);
    let file_path = Arc::new(args.output_file.clone());
    client
        .download(args.url, args.output_file, move |progress| {
            let percentage =
                (progress.bytes_downloaded as f64 / progress.total_bytes as f64) * 100.0;
            let file_name = PathBuf::from(&*file_path)
                .file_name()
                .unwrap_or_default()
                .to_string_lossy()
                .into_owned();

            draw_progress_bar(
                file_name,
                percentage,
                progress.bytes_per_second,
                progress.total_bytes,
                progress.bytes_downloaded,
            )
            .unwrap();
        })
        .await?;

    Ok(())
}

fn draw_progress_bar(
    file_name: String,
    percentage: f64,
    speed: u64,
    total_size: u64,
    downloaded: u64,
) -> Result<()> {
    use std::io::{stdout, Write}; // Import necessary I/O traits

    let bar_width = 50;
    let filled_width = (bar_width as f64 * percentage / 100.0) as usize; // Scale percentage correctly
    let filled_bar = "━".repeat(filled_width);
    let empty_bar = "━".repeat(bar_width - filled_width);
    let speed_str = format!("{}/s", get_formated_bytes(speed));
    let percentage_str = format!("{:.2}%", percentage);
    let downloaded_size_str = get_formated_bytes(downloaded);
    let total_size_str = get_formated_bytes(total_size);
    let file_path = PathBuf::from(&*file_name);
    let file_extension = file_path
        .extension()
        .unwrap_or_default()
        .to_string_lossy()
        .to_string();
    let filename_without_extension = file_path
        .file_stem()
        .unwrap_or_default()
        .to_string_lossy()
        .to_string();

    let min_text_size = 13 + file_extension.len();
    let truncated_file_name: String = if file_name.len() > min_text_size {
        format!(
            "{}...{}.{}",
            filename_without_extension
                .chars()
                .take(5)
                .collect::<String>(),
            filename_without_extension
                .chars()
                .skip(filename_without_extension.len() - 2)
                .collect::<String>(),
            file_extension
        )
    } else {
        file_name.clone()
    };

    print!(
        "\r{}\r{}: {}{} {} {} / {} ({})",
        " ".repeat(115),
        truncated_file_name.green(),
        filled_bar.green().bold(),
        empty_bar.white(),
        percentage_str.bright_red(),
        downloaded_size_str.yellow(),
        total_size_str.blue(),
        speed_str.bright_blue(),
    );

    stdout().flush()?; // Flush stdout to ensure the line is rendered immediately

    Ok(())
}

fn get_formated_bytes(bytes: u64) -> String {
    let mut bytes = bytes as f64;
    let units = ["B", "KB", "MB", "GB", "TB"];
    let mut unit_index = 0;
    while bytes > 1024.0 && unit_index < units.len() - 1 {
        bytes /= 1024.0;
        unit_index += 1;
    }
    format!("{:.2} {}", bytes, units[unit_index])
}
