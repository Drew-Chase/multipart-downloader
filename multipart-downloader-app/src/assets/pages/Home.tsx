import DownloadsTable from "../components/DownloadsTable.tsx";
import ListActions from "../components/ListActions.tsx";

export default function Home()
{
    // const downloadItems = Array.from({length: 100}, (_, i) => i).map(id =>
    // {
    //     const url: string = `https://example.com/file-${id}.iso`;
    //     const filename: string = `C:\\Users\\drew_\\Downloads\\file-${id}.iso`;
    //     const bytes_per_second: number = Math.random() * (200 * 1024 * 1024 - 100 * 1024 * 1024) + 100 * 1024 * 1024;
    //     const bytes_downloaded: number = Math.random() * (5.75 * 1024 * 1024 * 1024);
    //     const total_bytes: number = 5.75 * 1024 * 1024 * 1024;
    //     const parts_downloaded: number = Math.floor(Math.random() * 20) + 1;
    //     const parts_total: number = 20;
    //     const status: DownloadStatus = [DownloadStatus.Idle, DownloadStatus.Downloading, DownloadStatus.Paused, DownloadStatus.Completed, DownloadStatus.Error][Math.floor(Math.random() * 5)];
    //     return {
    //         id,
    //         url,
    //         filename,
    //         bytes_downloaded,
    //         total_bytes,
    //         parts_downloaded,
    //         parts_total,
    //         bytes_per_second,
    //         status
    //     } as DownloadItem;
    // });

    return (
        <div className={"flex flex-col p-4 w-full h-full"}>
            <ListActions/>
            <DownloadsTable/>
        </div>
    );
}