import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tab, Tabs} from "@nextui-org/react";
import PSButton from "../variants/PSButton.tsx";
import NetworkSettingsComponent, {NetworkSettings, NetworkSettingsProps} from "./NetworkSettingsComponent.tsx";
import StorageSettings from "./StorageSettings.tsx";
import AboutSettings from "./AboutSettings.tsx";
import {useState} from "react";

interface SettingsModalProps
{
    isOpen: boolean;
    onClose: () => void;
}

export default function SettingsModal(props: SettingsModalProps)
{
    const [selectedTab, setSelectedTab] = useState("networking");
    const [networkSettings, setNetworkSettings] = useState<NetworkSettings>(localStorage.getItem("networkSettings") ? JSON.parse(localStorage.getItem("networkSettings")!) : {} as NetworkSettings);

    const saveSettings = () =>
    {
        localStorage.setItem("networkSettings", JSON.stringify(networkSettings));
    };

    return (
        <Modal
            isOpen={props.isOpen}
            onClose={props.onClose}
            size={"5xl"}
            className={"h-[calc(100dvh_-_8rem)]"}
            isDismissable={false}
        >
            <ModalContent>
                {onClose => (
                    <>
                        <ModalHeader className={"flex flex-row items-center"}>
                            <p>Settings</p>
                            <Tabs
                                variant={"underlined"}
                                color={"primary"}
                                selectedKey={selectedTab}
                                onSelectionChange={key => setSelectedTab(key as string)}
                            >
                                <Tab key={"networking"} title={"Networking"}/>
                                <Tab key={"storage"} title={"Storage"}/>
                                <Tab key={"about"} title={"About"}/>
                            </Tabs>
                        </ModalHeader>
                        <ModalBody>
                            {(() =>
                            {
                                switch (selectedTab)
                                {
                                    case "networking":
                                        return <NetworkSettingsComponent settings={networkSettings} onSettingsChange={setNetworkSettings}/>;
                                    case "storage":
                                        return <StorageSettings/>;
                                    case "about":
                                        return <AboutSettings/>;
                                }
                                return <></>;
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