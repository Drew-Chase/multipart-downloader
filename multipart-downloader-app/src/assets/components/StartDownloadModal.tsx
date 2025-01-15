import Download from "../ts/download.ts";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import PSButton from "./variants/PSButton.tsx";
import PSInput from "./variants/PSInput.tsx";
import StorageSettingsComponent from "./settings/storage/StorageSettingsComponent.tsx";
import {settings} from "../ts/settings.ts";
import {SettingsTab} from "./settings/SettingsModal.tsx";
import NetworkSettingsComponent from "./settings/networking/NetworkSettingsComponent.tsx";
import {useEffect, useState} from "react";
import PSSwitch from "./variants/PSSwitch.tsx";

interface StartDownloadModalProps
{
    url: string;
    filename: string | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (download: Download) => void;
}

interface StartDownloadModalProps
{
    url: string;
    filename: string | null;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (download: Download) => void;
}

export default function StartDownloadModal(props: StartDownloadModalProps)
{
    const [useDefaultSettings, setUseDefaultSettings] = useState(true);
    const [customFilename, setCustomFilename] = useState(props.filename || ""); // Track custom filename input
    const [customUrl, setCustomUrl] = useState(props.url); // Track custom URL input
    const [customSettings, setCustomSettings] = useState(settings());

    useEffect(() =>
    {
        console.log("props", props);
        setCustomFilename(props.filename || "");
        setCustomUrl(props.url);
    }, [props]);

    // Function to handle the "Download" action
    const handleDownload = async () =>
    {
        try
        {
            // Create the `Download` object
            const download = new Download(
                customUrl || props.url, // Use custom URL if modified
                customFilename || props.filename || "default-filename", // Use custom filename or fallback
                customSettings
            );

            // Pass the created `Download` object to the `onConfirm` callback
            props.onConfirm(download);

            // Call the `onClose` handler to close the modal after the process is complete
            props.onClose();
        } catch (e)
        {
            console.error("Error creating the Download object: ", e);
        }
    };

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} backdrop={"blur"} scrollBehavior={"inside"} size={"5xl"} isDismissable={false}>
            <ModalContent>
                {onClose => (
                    <>
                        <ModalHeader>Download Settings</ModalHeader>
                        <ModalBody>
                            {/* URL Input Field */}
                            <PSInput
                                label={"Download URL"}
                                placeholder={"Enter or modify your URL"}
                                value={customUrl}
                                isDisabled
                                isReadOnly
                            />

                            {/* Filename Input Field */}
                            <PSInput
                                label={"Filename"}
                                placeholder={"Enter or modify your filename"}
                                value={customFilename}
                                onValueChange={setCustomFilename}
                            />

                            {/* Use Default Settings Toggle */}
                            <PSSwitch
                                label={"Use Default Settings"}
                                toggle={useDefaultSettings}
                                onToggle={setUseDefaultSettings}
                            />

                            {/* Conditional Custom Settings */}
                            {!useDefaultSettings && (
                                <>
                                    {/* Storage Settings */}
                                    <StorageSettingsComponent
                                        settings={customSettings[SettingsTab.Storage]}
                                        onSettingsChange={value => setCustomSettings({...customSettings, [SettingsTab.Storage]: value})}
                                    />

                                    {/* Network Settings */}
                                    <NetworkSettingsComponent
                                        settings={customSettings[SettingsTab.Networking]}
                                        onSettingsChange={value => setCustomSettings({...customSettings, [SettingsTab.Networking]: value})}
                                    />
                                </>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            {/* Confirm/Download Button */}
                            <PSButton color={"primary"} onPress={handleDownload}>
                                Download
                            </PSButton>

                            {/* Cancel Button */}
                            <PSButton onPress={onClose} variant={"light"} color={"danger"}>
                                Cancel
                            </PSButton>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}