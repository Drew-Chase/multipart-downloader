use clap::Parser;

#[derive(Debug, Parser)]
#[clap(
    author,
    version,
    about,
    help_template = "Multipart Downloader\nVersion: {version}\n{about}\n{usage}\n{all-args}"
)]
pub struct MultipartDownloaderArguments {
    #[arg(short, long, required = true, help = "The URL to download")]
    pub url: String,
    #[arg(
        short,
        long,
        default_value = "10",
        help = "The number of parts to split the file into"
    )]
    pub parts: u16,
    #[arg(
        long,
        default_value = "false",
        help = "Preallocate space for the output file"
    )]
    pub preallocate_space: bool,
    #[arg(
        short,
        long,
        required = true,
        help = "The filename to use for the output file"
    )]
    pub output_file: String,
}
