import {createContext, ReactNode, useCallback, useContext, useState} from "react";
import Download, {DownloadStatus} from "../ts/download.ts";
import StartDownloadModal from "../components/StartDownloadModal.tsx";



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

// Context Type
interface DownloadManagerContextType
{
    downloads: DownloadItem[];
    addDownload: (download: DownloadItem) => void;
    updateDownload: (id: number, updates: Partial<DownloadItem>) => void;
    removeDownload: (id: number) => void;
    clearDownloads: (status?: DownloadStatus) => void;

    // Modal-specific functionality
    openModal: (url: string, filename?: string | null, onConfirm?: (download: Download) => void) => void;
    closeModal: () => void;
    isModalOpen: boolean;
}

// Create Context
const DownloadManagerContext = createContext<DownloadManagerContextType | undefined>(undefined);

export function DownloadManagerProvider({children}: { children: ReactNode })
{
    const [downloads, setDownloads] = useState<DownloadItem[]>([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState<{
        url?: string;
        filename?: string | null;
        onConfirm?: (download: Download) => void;
    } | null>(null);

    // Downloads Management
    const addDownload = useCallback(
        (download: DownloadItem) =>
        {
            setDownloads((prev) => [...prev, download]);
        },
        [setDownloads]
    );

    const updateDownload = useCallback(
        (id: number, updates: Partial<DownloadItem>) =>
        {
            setDownloads((prev) => prev.map((download) => (download.id === id ? {...download, ...updates} : download)));
        },
        [setDownloads]
    );

    const removeDownload = useCallback(
        (id: number) =>
        {
            setDownloads((prev) => prev.filter((download) => download.id !== id));
        },
        [setDownloads]
    );

    const clearDownloads = useCallback(
        (status?: DownloadStatus) =>
        {
            setDownloads((prev) => (status ? prev.filter((d) => d.status !== status) : []));
        },
        [setDownloads]
    );

    // Modal Management
    const openModal = (url: string, filename?: string | null, onConfirm?: (download: Download) => void) =>
    {
        setModalData({url, filename, onConfirm});
        setModalOpen(true);
    };

    const closeModal = () =>
    {
        setModalData(null);
        setModalOpen(false);
    };

    return (
        <DownloadManagerContext.Provider
            value={{
                downloads,
                addDownload,
                updateDownload,
                removeDownload,
                clearDownloads,
                openModal,
                closeModal,
                isModalOpen
            }}
        >
            {modalData && (
                <StartDownloadModal
                    url={modalData.url || ""}
                    filename={modalData.filename || ""}
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onConfirm={(download: Download) =>
                    {
                        modalData.onConfirm?.(download); // Trigger optional callback after confirm
                        closeModal();
                    }}
                />
            )}
            {children}
        </DownloadManagerContext.Provider>
    );
}

export function useDownloadManager()
{
    const context = useContext(DownloadManagerContext);
    if (!context)
    {
        throw new Error("useDownloadManager must be used within a DownloadManagerProvider");
    }
    return context;
}
