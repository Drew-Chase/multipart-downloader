mod arguments;

use crate::arguments::MultipartDownloaderArguments;
use anyhow::Result;
use clap::Parser;
use colored::Colorize;

#[tokio::main]
async fn main() -> Result<()> {
    let args = MultipartDownloaderArguments::parse();
    let mut client = multipart_downloader_lib::download_client::DownloadClient::new();
    client.with_parts(args.parts);
    client.set_preallocate_space(args.preallocate_space);
    client
        .download(args.url, args.output_file, move |progress| {
            let percentage =
                (progress.bytes_downloaded as f64 / progress.total_bytes as f64) * 100.0;
            draw_progress_bar(
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

fn draw_progress_bar(percentage: f64, speed: u64, total_size: u64, downloaded: u64) -> Result<()> {
    use std::io::{stdout, Write}; // Import necessary I/O traits

    let bar_width = 50;
    let filled_width = (bar_width as f64 * percentage / 100.0) as usize; // Scale percentage correctly
    let filled_bar = "━".repeat(filled_width);
    let empty_bar = "━".repeat(bar_width - filled_width);
    let speed_str = format!("{}/s", get_formated_bytes(speed));
    let percentage_str = format!("{:.2}%", percentage);
    let downloaded_size_str = get_formated_bytes(downloaded);
    let total_size_str = get_formated_bytes(total_size);

    print!(
        "\r{}\rDownloading: [{}{}] {} {} / {} ({})",
        " ".repeat(110),
        filled_bar.green().bold(),
        empty_bar.white(),
        percentage_str,
        downloaded_size_str,
        total_size_str,
        speed_str,
    );

    stdout().flush()?; // Flush stdout to ensure the line is rendered immediately

    Ok(())
}

fn get_formated_bytes(bytes: u64) -> String {
    let mut bytes = bytes as f64;
    let units = ["BB", "KB", "MB", "GB", "TB"];
    let mut unit_index = 0;
    while bytes > 1024.0 && unit_index < units.len() - 1 {
        bytes /= 1024.0;
        unit_index += 1;
    }
    format!("{:.2} {}", bytes, units[unit_index])
}
