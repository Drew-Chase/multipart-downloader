import {Progress, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react";
import {useDownloadManager} from "../providers/DownloadManagerContext.tsx";
import {DownloadStatus} from "../ts/download.ts";
import {getFormattedBytes, round} from "../ts/Math.ts";
import PSButton from "./variants/PSButton.tsx";
import {Icon} from "@iconify-icon/react";

export default function DownloadsTable()
{
    const {downloads, removeDownload} = useDownloadManager();

    return (
        <Table
            removeWrapper
            selectionMode={"multiple"}
            isHeaderSticky
            aria-label="Downloads Table"
            classNames={{
                th: "bg-background/80 backdrop-blur-sm",
                thead: "[&>tr]:first:shadow-none",
                base: "max-h-[calc(100dvh_-_10rem)] overflow-y-auto"
            }}
        >
            <TableHeader>
                <TableColumn key={"name"} allowsSorting>Name</TableColumn>
                <TableColumn key={"size"} allowsSorting>Size</TableColumn>
                <TableColumn key={"status"} allowsSorting>Status</TableColumn>
                <TableColumn key={"time-left"} allowsSorting>Time Left</TableColumn>
                <TableColumn key={"actions"} hideHeader>Actions</TableColumn>
            </TableHeader>
            <TableBody>
                {downloads.map((download, index) =>
                {
                    const progress = round((download.bytes_downloaded / download.total_bytes * 100), 2);
                    const totalBytes = getFormattedBytes(download.total_bytes);
                    const downloadedBytes = getFormattedBytes(download.bytes_downloaded);
                    let color: "primary" | "default" | "secondary" | "success" | "warning" | "danger" | undefined;
                    switch (download.status)
                    {
                        case DownloadStatus.Error:
                            color = "danger";
                            break;
                        case DownloadStatus.Idle:
                        case DownloadStatus.Completed:
                            color = "default";
                            break;
                        case DownloadStatus.Paused:
                            color = "warning";
                            break;
                        case DownloadStatus.Downloading:
                            color = "primary";
                            break;
                        default:
                            color = undefined;
                            break;
                    }
                    return (
                        <TableRow key={`${download.url}-${index}`}>
                            <TableCell aria-label={`Filename: ${download.filename}`}>
                                <p className={"font-light"}>{(download.filename.split("\\").pop())}</p>
                                <p className={"text-foreground/25 max-w-sm truncate font-light text-tiny"}>{download.url}</p>
                            </TableCell>
                            <TableCell aria-label={`Size: ${download.total_bytes}`}>
                                <span className={"text-foreground/75"}>{downloadedBytes}</span> <span className={"text-foreground/25"}>/</span> <span className={"font-light text-foreground/50"}>{totalBytes}</span>
                            </TableCell>
                            <TableCell aria-label={`Progress: ${progress}%`}>
                                <Progress
                                    minValue={0}
                                    maxValue={1}
                                    size={"sm"}
                                    value={download.bytes_downloaded / download.total_bytes}
                                    aria-label={`Progress: ${progress}%`}
                                    color={color}
                                />
                            </TableCell>
                            <TableCell aria-label="Time Left: 5 minutes" className={"text-foreground/25"}>{progress}%</TableCell>
                            <TableCell>
                                <div className={"flex flex-row justify-end"}>
                                    <PSButton variant={"light"} color={"danger"} aria-label="Delete download" onPress={() => removeDownload(download.id)}>
                                        <Icon icon={"mage:trash-fill"} width={12}/>
                                    </PSButton>
                                </div>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}