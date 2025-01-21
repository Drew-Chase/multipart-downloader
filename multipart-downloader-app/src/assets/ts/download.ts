import {Channel, invoke} from "@tauri-apps/api/core";
import {Settings} from "./settings.ts";
import {SettingsTab} from "../components/settings/SettingsModal.tsx";

export type DownloadProgress = {
    bytes_downloaded: number;
    total_bytes: number;
    parts_downloaded: number;
    parts_total: number;
    bytes_per_second: number;
}

export enum DownloadStatus
{
    Idle = "Idle",
    Downloading = "Downloading",
    Paused = "Paused",
    Completed = "Completed",
    Error = "Error",
}

export default class Download
{
    public readonly url: string;
    public readonly filename: string;
    public readonly settings: Settings;

    constructor(url: string, filename: string, settings: Settings)
    {
        this.url = url;
        this.filename = filename;
        this.settings = settings;
    }

    async download(url: string, filename: string, onUpdate: (download: DownloadProgress) => void)
    {
        const downloadEvent = new Channel<DownloadProgress>();
        downloadEvent.onmessage = (event) =>
        {
            onUpdate(event);
        };
        await invoke("download", {
            url: url,
            parts: this.settings[SettingsTab.Networking].splitPartsCount,
            allocate: this.settings[SettingsTab.Storage].preallocateSpace,
            directory: this.settings[SettingsTab.Storage].downloadsDirectory,
            filename,
            onEvent: downloadEvent
        });
    }

    static async try_get_filename(url: string): Promise<string | null>
    {
        try
        {
            return await invoke("try_get_filename", {url: url});

        } catch (e)
        {
            console.error(`Error while trying to get filename from url ${url}: ${e}`);
        }
        return null;
    }


}

