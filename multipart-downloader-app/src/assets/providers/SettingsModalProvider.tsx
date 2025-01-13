import {createContext, ReactNode, useContext, useState} from "react";
import SettingsModal from "../components/settings/SettingsModal.tsx";

interface SettingsModalContextType
{
    open: () => void;
    close: () => void;
    isOpen: boolean;
}

const SettingsModalContext = createContext<SettingsModalContextType | undefined>(undefined);

export function SettingsModalProvider({children}: { children: ReactNode })
{
    const [isOpen, setIsOpen] = useState(false);

    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);

    return (
        <SettingsModalContext.Provider value={{isOpen, open, close}}>
            <SettingsModal isOpen={isOpen} onClose={close}/>
            {children}
        </SettingsModalContext.Provider>
    );
}

export function useSettingsModal(): SettingsModalContextType
{
    const context = useContext(SettingsModalContext);
    if (!context)
    {
        throw new Error("useSettingsModal must be used within a SettingsModalProvider");
    }
    return context;
}