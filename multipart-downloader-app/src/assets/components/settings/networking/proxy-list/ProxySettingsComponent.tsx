import {NewProxyInput} from "./NewProxyInput.tsx";
import ProxyList, {Proxy} from "./ProxyList.tsx";

export function ProxySettingsComponent({value, onValueChange}: { value: Proxy[], onValueChange: (value: Proxy[]) => void })
{
    return (
        <div className={"flex flex-col bg-background p-3 rounded-md"}>
            <div className={"flex flex-row gap-4 items-center"}>
                <p className={"text-large"}>Proxies</p>
                <NewProxyInput onSubmit={v =>
                {
                    onValueChange([...value, v]);
                }}/>
            </div>

            <ProxyList value={value} onValueChange={onValueChange}/>
        </div>
    );

}