import {invoke} from "@tauri-apps/api/core";
import {useEffect} from "react";
import PSInput from "../../variants/PSInput.tsx";
import PSTooltip from "../../variants/PSTooltip.tsx";
import PSButton from "../../variants/PSButton.tsx";
import {open} from "@tauri-apps/plugin-dialog";
import {Icon} from "@iconify-icon/react";

export function DownloadDirectoryInput({value, onValueChange}: { value: string | null, onValueChange: (value: string | null) => void })
{
    useEffect(() =>
    {
        if (!value) getDownloadDirectory().then(onValueChange);
    }, [value]);
    return (
        <div className={"flex flex-row gap-2 items-center"}>
            <PSInput
                label={"Download Directory"}
                isReadOnly
                value={value ?? ""}
                placeholder={value ?? "No directory selected"}
                classNames={{
                    inputWrapper: "bg-background-L200"
                }}
            />
            <PSTooltip content={"Select download directory"} delay={800}>
                <PSButton
                    onPress={async () =>
                    {
                        onValueChange(
                            await open({
                                title: "Select download directory",
                                canCreateDirectories: true,
                                directory: true,
                                defaultPath: value ?? ""
                            })
                        );
                    }}
                    className={"bg-background-L200 h-full aspect-square"}
                >
                    <Icon icon={"mage:folder"}/>
                </PSButton>
            </PSTooltip>
        </div>
    );
}

async function getDownloadDirectory(): Promise<string>
{
    return invoke("get_default_downloads_directory");
}