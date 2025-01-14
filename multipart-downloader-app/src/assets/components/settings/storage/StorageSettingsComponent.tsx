import {DownloadDirectoryInput} from "./DownloadDirectoryInput.tsx";
import PSSwitch from "../../variants/PSSwitch.tsx";

interface StorageSettingsProps
{
    settings: StorageSettings;
    onSettingsChange: (value: StorageSettings) => void;
}

export type StorageSettings = {
    downloadsDirectory: string | null;
    preallocateSpace: boolean;
};


export const DefaultStorageSettings: StorageSettings = {
    downloadsDirectory: null,
    preallocateSpace: false
};

export default function StorageSettingsComponent(props: StorageSettingsProps)
{
    return (
        <div className={"flex flex-col gap-4"}>
            <DownloadDirectoryInput value={props.settings.downloadsDirectory} onValueChange={value => props.onSettingsChange({...props.settings, downloadsDirectory: value})}/>
            <PSSwitch
                label={"Preallocate Space"}
                description={"Preallocate space for all files before downloading, this is to avoid fragmentation and check if space is available"}
                isSelected={props.settings.preallocateSpace}
                onValueChange={value => props.onSettingsChange({...props.settings, preallocateSpace: value})}
            />
        </div>
    );
}

