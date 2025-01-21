import {createContext, ReactNode, useContext, useState} from "react";
import StartDownloadModal from "../components/StartDownloadModal.tsx";
import Download, {DownloadStatus} from "../ts/download.ts";

export type DownloadItem = {
    id: number;
    url: string;
    filename: string;
    bytes_downloaded: number;
    total_bytes: number;
    parts_downloaded: number;
    parts_total: number;
    bytes_per_second: number;
    status: DownloadStatus;
};

interface StartDownloadContextType
{
    downloads: DownloadItem[];
    addDownload: (download: DownloadItem) => void;
    removeDownload: (id: number) => void;
    clearDownloads: (status?: DownloadStatus) => void;
    updateDownload: (id: number, download: DownloadItem) => void;
    open: (url: string, filename: string | null, onConfirm?: (download: Download) => void) => void;
    close: () => void;
    isOpen: boolean;
}

const StartDownloadContext = createContext<StartDownloadContextType | undefined>(undefined);

export function StartDownloadProvider({children}: { children: ReactNode })
{
    const [isOpen, setIsOpen] = useState(false);
    const [url, setUrl] = useState<string | null>(null);
    const [filename, setFilename] = useState<string | null>(null);
    const [onConfirmHandler, setOnConfirmHandler] = useState<(download: Download) => void | undefined>();
    const [downloads, setDownloads] = useState<DownloadItem[]>([]);

    const open = (url: string, filename: string | null, onConfirm?: (download: Download) => void) =>
    {
        console.log("Opening download modal", url, filename);
        setUrl(url);
        setFilename(filename);
        setIsOpen(true);
        if (onConfirm)
        {
            setOnConfirmHandler(() => onConfirm); // Pass the custom onConfirm callback
        }
    };

    const close = () =>
    {
        setUrl(null);
        setFilename(null);
        setIsOpen(false);
        setOnConfirmHandler(undefined); // Clean up the handler
    };

    const addDownload = (download: DownloadItem) =>
    {
        setDownloads(prev => [...prev, download]);
    };

    const removeDownload = (id: number) =>
    {
        setDownloads(prev => prev.filter(download => download.id !== id));
    };

    const clearDownloads = (status?: DownloadStatus) =>
    {
        if (status !== undefined)
        {
            setDownloads(prev => prev.filter(download => download.status !== status));
        } else
        {
            setDownloads([]);
        }
    };

    const updateDownload = (id: number, download: DownloadItem) =>
    {
        setDownloads(prev =>
            prev.map(d => (d.id === id ? {...d, ...download} : d))
        );
    };

    return (
        <StartDownloadContext.Provider value={{downloads, addDownload, removeDownload, clearDownloads, updateDownload, open, close, isOpen}}>
            <StartDownloadModal
                url={url || ""}
                filename={filename || ""}
                isOpen={isOpen}
                onClose={close}
                onConfirm={(download: Download) =>
                {
                    if (onConfirmHandler)
                    {
                        onConfirmHandler(download); // Call the event handler if provided
                    }
                    close();
                }}
            />
            {children}
        </StartDownloadContext.Provider>
    );
}

export function useStartDownload(): StartDownloadContextType
{
    const context = useContext(StartDownloadContext);
    if (!context)
    {
        throw new Error("useStartDownload must be used within a StartDownloadProvider");
    }
    return context;
}