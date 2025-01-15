import {createContext, ReactNode, useContext, useState} from "react";
import StartDownloadModal from "../components/StartDownloadModal.tsx";
import Download from "../ts/download.ts";

interface StartDownloadContextType
{
    open: (url: string, filename: string | null, onConfirm?: (download: Download) => void) => void;
    close: () => void;
    isOpen: boolean;
}

const StartDownloadContext = createContext<StartDownloadContextType | undefined>(undefined);

export function StartDownloadProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [url, setUrl] = useState<string | null>(null);
    const [filename, setFilename] = useState<string | null>(null);
    const [onConfirmHandler, setOnConfirmHandler] = useState<(download: Download) => void | undefined>();

    const open = (url: string, filename: string | null, onConfirm?: (download: Download) => void) => {
        console.log("Opening download modal", url, filename);
        setUrl(url);
        setFilename(filename);
        setIsOpen(true);
        if (onConfirm) {
            setOnConfirmHandler(() => onConfirm); // Pass the custom onConfirm callback
        }
    };

    const close = () => {
        setUrl(null);
        setFilename(null);
        setIsOpen(false);
        setOnConfirmHandler(undefined); // Clean up the handler
    };

    return (
        <StartDownloadContext.Provider value={{ open, close, isOpen }}>
            <StartDownloadModal
                url={url || ""}
                filename={filename || ""}
                isOpen={isOpen}
                onClose={close}
                onConfirm={(download: Download) => {
                    if (onConfirmHandler) {
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