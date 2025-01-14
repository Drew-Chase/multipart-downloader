import PSTooltip from "../../../variants/PSTooltip.tsx";
import {Icon} from "@iconify-icon/react";
import PSButton from "../../../variants/PSButton.tsx";
import {Proxy} from "./ProxyList.tsx";
import {useState} from "react";
import {NewProxyInput} from "./NewProxyInput.tsx";

export function ProxyListItem({proxy, onRemove, onUpdate}: { proxy: Proxy, onRemove: (id: number) => void, onUpdate: (proxy: Proxy) => void })
{
    const [id] = useState(`${proxy.type}://${proxy.host}:${proxy.port}-${proxy.id}-${Math.random().toString(36).substring(7)}`);
    const [editMode, setEditMode] = useState(false);

    if (editMode) return (
        <NewProxyInput
            onSubmit={proxy =>
            {
                onUpdate(proxy);
                setEditMode(false);
            }}
            value={proxy}
            onCancel={() => setEditMode(false)}
        />
    );
    return (
        <div
            id={id}
            key={id}
            className={"flex flex-row gap-2 items-center hover:bg-foreground/10 p-2 rounded-md transition-all duration-100"}
        >
            <div className={"flex flex-row gap-2"}>
                {proxy.username &&
                    <PSTooltip content={"Proxy uses authentication"}>
                        <Icon icon={"mdi:shield-lock"} className={"text-large"}/>
                    </PSTooltip>
                }
                <p className={"opacity-75 italic"}>{proxy.type}://{proxy.host}:{proxy.port}</p>
            </div>
            <div className={"flex flex-row ml-auto"}>
                <PSTooltip content={"Edit proxy"} delay={800}>
                    <PSButton
                        className={"text-large"}
                        variant={"light"}
                        onPress={() =>
                        {
                            setEditMode(true);
                        }}
                    >
                        <Icon icon={"mage:pen-fill"}/>
                    </PSButton>
                </PSTooltip>

                <PSTooltip content={"Remove proxy"} delay={800}>
                    <PSButton
                        className={"text-large"}
                        color={"danger"}
                        variant={"light"}
                        onPress={() =>
                        {
                            onRemove(proxy.id);
                        }}
                    >
                        <Icon icon={"mage:trash-fill"}/>
                    </PSButton>
                </PSTooltip>
            </div>
        </div>
    );
}