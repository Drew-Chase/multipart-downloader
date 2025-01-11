import Download from "../ts/download.ts";
import DownloadsTable from "../components/DownloadsTable.tsx";
import ListActions from "../components/ListActions.tsx";

export default function Home()
{
   const download_items = Array.from({length: 100}, (_, i) => i).map(_ =>
       {
           const url: string = "https://bungi.mm.fcix.net/ubuntu-releases/24.04.1/ubuntu-24.04.1-desktop-amd64.iso";
           const filename: string = "C:\\Users\\drew_\\Downloads\\ubuntu.iso";
           const bytes_per_second: string = "180.12 MB/s";
           const bytes_downloaded: string = "2.00 GB";
           const total_bytes: string = "5.75 GB";
           const parts_downloaded: number = 16;
           const parts_total: number = 20;
           const progress: number = 0.5;
           return new Download(
               url,
               filename,
               bytes_downloaded,
               total_bytes,
               parts_downloaded,
               parts_total,
               bytes_per_second,
               progress
           );
       });

    return (
        <div className={"flex flex-col p-4 w-full h-full"}>
            <ListActions />
            <DownloadsTable downloads={download_items}/>
        </div>
    );
}