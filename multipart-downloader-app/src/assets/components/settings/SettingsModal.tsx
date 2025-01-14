import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs} from "@nextui-org/react";
import PSButton from "../variants/PSButton.tsx";
import NetworkSettingsComponent, {DefaultNetworkSettings, NetworkSettings} from "./networking/NetworkSettingsComponent.tsx";
import StorageSettingsComponent, {DefaultStorageSettings, StorageSettings} from "./storage/StorageSettingsComponent.tsx";
import AboutSettings from "./AboutSettings.tsx";
import {useState} from "react";

interface SettingsModalProps
{
    isOpen: boolean;
    onClose: () => void;
}

enum SettingsTab
{
    Networking = "networking",
    Storage = "storage",
    About = "about"
}

export default function SettingsModal(props: SettingsModalProps)
{
    const [selectedTab, setSelectedTab] = useState(SettingsTab.Networking);
    const [networkSettings, setNetworkSettings] = useState<NetworkSettings>(
        localStorage.getItem("networkSettings") ?
            JSON.parse(localStorage.getItem("networkSettings")!) :
            DefaultNetworkSettings
    );

    const [storageSettings, setStorageSettings] = useState<StorageSettings>(localStorage.getItem("storageSettings") ?
        JSON.parse(localStorage.getItem("storageSettings")!) :
        DefaultStorageSettings
    );

    const reload = () =>
    {
        setSelectedTab(SettingsTab.Networking);
        setNetworkSettings(
            localStorage.getItem("networkSettings") ?
                JSON.parse(localStorage.getItem("networkSettings")!) :
                DefaultNetworkSettings
        );
        setStorageSettings(localStorage.getItem("storageSettings") ?
            JSON.parse(localStorage.getItem("storageSettings")!) :
            DefaultStorageSettings
        );
    };


    const saveSettings = () =>
    {
        localStorage.setItem("networkSettings", JSON.stringify(networkSettings));
        localStorage.setItem("storageSettings", JSON.stringify(storageSettings));
    };

    return (
        <Modal
            isOpen={props.isOpen}
            onClose={props.onClose}
            size={"5xl"}
            className={"h-[calc(100dvh_-_8rem)]"}
            scrollBehavior={"inside"}
            isDismissable={false}
            onOpenChange={reload}
        >
            <ModalContent>
                {onClose => (
                    <>
                        <ModalHeader className={"flex flex-row items-center"}>
                            <p>Settings</p>
                            <Tabs
                                key={"settings-tabs"}
                                variant={"underlined"}
                                color={"primary"}
                                selectedKey={selectedTab}
                                onSelectionChange={key => setSelectedTab(key as SettingsTab)}
                            >
                                {Object.values(SettingsTab).map(tab => (
                                    <Tab key={tab} title={tab} className={"capitalize"}/>
                                ))}
                            </Tabs>
                        </ModalHeader>
                        <ModalBody>
                            {(() =>
                            {
                                switch (selectedTab)
                                {
                                    case SettingsTab.Networking:
                                        return <NetworkSettingsComponent settings={networkSettings} onSettingsChange={setNetworkSettings}/>;
                                    case SettingsTab.Storage:
                                        return <StorageSettingsComponent settings={storageSettings} onSettingsChange={setStorageSettings}/>;
                                    case SettingsTab.About:
                                        return <AboutSettings/>;
                                }
                            })()}
                        </ModalBody>
                        <ModalFooter>
                            <PSButton
                                color={"primary"}
                                onPress={() =>
                                {
                                    saveSettings();
                                    onClose();
                                }}
                            >
                                Apply and Save
                            </PSButton>
                            <PSButton onPress={onClose} color={"danger"} variant={"light"}>Cancel</PSButton>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}