import {NewProxyInput} from "./NewProxyInput.tsx";

export type Proxy = {
    host: string;
    port: number;
    username?: string;
    password?: string;
    type: ProxyType;
}

export enum ProxyType
{
    HTTP = "http",
    SOCKS4 = "socks4",
    SOCKS5 = "socks5"
}

export default function ProxyList({value, onValueChange}: { value: Proxy[], onValueChange: (value: Proxy[]) => void })
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

            <div className={"flex flex-col gap-2"}>
                {value.length === 0 && <p className={"italic opacity-50 mx-auto my-4"}>No proxies</p>}
                {value.map((v, i) => (
                    <div key={i} className={"flex flex-row gap-2 items-center"}>
                        <p className={"text-large"}>{v.host}:{v.port}</p>
                        <button className={"text-large"} onClick={() =>
                        {
                            onValueChange(value.filter((_, j) => j !== i));
                        }}></button>
                    </div>
                ))}
            </div>

        </div>
    );
}

