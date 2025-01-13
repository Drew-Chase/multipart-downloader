import {Progress, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react";
import Download from "../ts/download.ts";
import PSButton from "./variants/PSButton.tsx";
import {Icon} from "@iconify-icon/react";

export default function DownloadsTable({downloads}: { downloads: Download[] })
{
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
                {downloads.map((download, index) => (
                    <TableRow key={`${download.url}-${index}`}>
                        <TableCell aria-label={`Filename: ${download.filename}`}>
                            <p className={"font-light"}>{(download.filename.split("\\").pop())}</p>
                            <p className={"text-foreground/25 max-w-sm truncate font-light text-tiny"}>{download.url}</p>
                        </TableCell>
                        <TableCell aria-label={`Size: ${download.total_bytes}`} className={"text-foreground/25"}>{download.total_bytes}</TableCell>
                        <TableCell aria-label={`Progress: ${download.progress * 100}%`}>
                            <Progress
                                minValue={0}
                                maxValue={1}
                                size={"sm"}
                                value={download.progress}
                                aria-label={`Progress: ${download.progress * 100}%`}
                            />
                        </TableCell>
                        <TableCell aria-label="Time Left: 5 minutes" className={"text-foreground/25"}>5min</TableCell>
                        <TableCell>
                            <div className={"flex flex-row justify-end"}>
                                <PSButton variant={"light"} color={"danger"} aria-label="Delete download">
                                    <Icon icon={"mage:trash-fill"} width={12}/>
                                </PSButton>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}