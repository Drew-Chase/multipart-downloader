import SplitPartCountSlider from "./networking/SplitPartCountSlider.tsx";

interface NetworkSettingsProps
{
    settings: NetworkSettings;
    onSettingsChange: (value: NetworkSettings) => void;
}

export type NetworkSettings = {
    splitPartsCount: number;
    proxies: Proxy[];
};

type Proxy = {
    host: string;
    port: number;
    username?: string;
    password?: string;
    type: ProxyType;
}

enum ProxyType
{
    HTTP = "http",
    SOCKS4 = "socks4",
    SOCKS5 = "socks5"
}

export default function NetworkSettingsComponent(props: NetworkSettingsProps)
{
    const {settings, onSettingsChange} = props;

    return (
        <div className={"w-full p-3"}>
            <SplitPartCountSlider value={settings.splitPartsCount} onValueChange={value => onSettingsChange({...settings, splitPartsCount: value})}/>
        </div>
    );
}