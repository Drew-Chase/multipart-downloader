import {useState} from "react";
import {Pagination} from "@nextui-org/react";
import {ProxyListItem} from "./ProxyListItem.tsx";

export type Proxy = {
    id: number;
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
    const [page, setPage] = useState(1);
    const itemsPerPage = 20;
    return (
        <div className={"flex flex-col gap-2 h-[400px]"}>
            <div className={"overflow-y-auto"}>
                {value.length === 0 && <p className={"italic opacity-50 mx-auto my-4"}>No proxies</p>}
                {value.slice((page - 1) * itemsPerPage, page * itemsPerPage).map(v => (
                    <ProxyListItem
                        key={`${v.type}://${v.host}:${v.port}-${v.id}-${Math.random().toString(36).substring(7)}`}
                        proxy={v}
                        onRemove={id => onValueChange(value.filter(p => p.id !== id))}
                        onUpdate={proxy =>
                        {
                            if (proxy) onValueChange(value.map(p => p.id === proxy.id ? proxy : p));
                            else onValueChange(value.filter(p => v.id !== p.id));
                        }}
                    />
                ))}
            </div>
            {value.length > itemsPerPage &&
                <div className={"w-full"}>
                    <Pagination
                        total={Math.ceil(value.length / itemsPerPage)}
                        page={page}
                        onChange={setPage}
                        size={"sm"}
                        showControls
                        showShadow
                        className={"w-fit mx-auto"}
                    />
                </div>
            }
        </div>

    );
}

