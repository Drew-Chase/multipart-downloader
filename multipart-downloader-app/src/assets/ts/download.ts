export default class Download
{
    public readonly url: string;
    public readonly filename: string;
    public readonly bytes_downloaded: string;
    public readonly total_bytes: string;
    public readonly parts_downloaded: number;
    public readonly parts_total: number;
    public readonly bytes_per_second: string;
    public readonly progress: number;

    constructor(url: string, filename: string, bytes_downloaded: string, total_bytes: string, parts_downloaded: number, parts_total: number, bytes_per_second: string, progress: number)
    {
        this.url = url;
        this.filename = filename;
        this.bytes_downloaded = bytes_downloaded;
        this.total_bytes = total_bytes;
        this.parts_downloaded = parts_downloaded;
        this.parts_total = parts_total;
        this.bytes_per_second = bytes_per_second;
        this.progress = progress;
    }

    async download()
    {
    }


}