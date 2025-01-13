import SplitPartCountSlider from "./networking/SplitPartCountSlider.tsx";
import ProxyList, {Proxy} from "./networking/proxy-list/ProxyList.tsx";

interface NetworkSettingsProps
{
    settings: NetworkSettings;
    onSettingsChange: (value: NetworkSettings) => void;
}

export type NetworkSettings = {
    splitPartsCount: number;
    proxies: Proxy[];
};


export const DefaultNetworkSettings:NetworkSettings = {
    splitPartsCount: 16,
    proxies: []
}

export default function NetworkSettingsComponent(props: NetworkSettingsProps)
{
    const {settings, onSettingsChange} = props;

    return (
        <div className={"w-full p-3 flex flex-col gap-4"}>
            <SplitPartCountSlider value={settings.splitPartsCount} onValueChange={value => onSettingsChange({...settings, splitPartsCount: value})}/>
            <ProxyList value={settings.proxies} onValueChange={proxies => onSettingsChange({...settings, proxies})} />
        </div>
    );
}