import {DefaultNetworkSettings, NetworkSettings} from "../components/settings/networking/NetworkSettingsComponent.tsx";
import {DefaultStorageSettings, StorageSettings} from "../components/settings/storage/StorageSettingsComponent.tsx";
import {SettingsTab} from "../components/settings/SettingsModal.tsx";

export type Settings = {
    [SettingsTab.Networking]: NetworkSettings,
    [SettingsTab.Storage]: StorageSettings,
    [SettingsTab.About]: never
}

export function settings(): Settings
{
    const storage: StorageSettings = localStorage.getItem("storageSettings") ?
        JSON.parse(localStorage.getItem("storageSettings")!) :
        DefaultStorageSettings;

    const network: NetworkSettings = localStorage.getItem("networkSettings") ?
        JSON.parse(localStorage.getItem("networkSettings")!) :
        DefaultNetworkSettings;

    return {
        [SettingsTab.Networking]: network,
        [SettingsTab.Storage]: storage,
        [SettingsTab.About]: undefined as never
    };

}

export function saveSettings(settings: Settings)
{
    localStorage.setItem("storageSettings", JSON.stringify(settings[SettingsTab.Storage]));
    localStorage.setItem("networkSettings", JSON.stringify(settings[SettingsTab.Networking]));
}