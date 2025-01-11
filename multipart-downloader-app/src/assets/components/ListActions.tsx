import {cn, Divider} from "@nextui-org/react";
import {Icon} from "@iconify-icon/react";
import {useEffect, useState} from "react";
import $ from "jquery";
import PSButton from "./variants/PSButton.tsx";
import PSInput from "./variants/PSInput.tsx";
import {useSettingsModal} from "../providers/SettingsModalProvider.tsx";

export default function ListActions()
{
    const {open} = useSettingsModal();
    return (
        <div className={"flex flex-row pb-2 border-b-1 border-foreground/20 gap-4"}>
            <PSInput
                label={"Add Url"}
                placeholder={"Paste url or select file"}
                className={"max-w-md"}
                startContent={<Icon icon={"mage:link"} width={16}/>}
                endContent={
                    <div className={"h-full flex flex-row gap-2"}>
                        <Divider orientation={"vertical"}/>
                        <PSButton className={"h-full"} variant={"light"} color={"primary"}>
                            <Icon icon={"mage:file-2-fill"} width={16}/>
                        </PSButton>
                    </div>
                }
            />
            <div className={"w-full flex flex-row gap-4 justify-end"}>
                <div className={"flex flex-row gap-1"}>
                    <ActionButton icon={"mage:play"} label={"Resume"} onClick={() => console.log("Resume action triggered")}/>
                    <ActionButton icon={"mage:stop"} label={"Stop"} onClick={() => console.log("Stop action triggered")}/>
                    <ActionButton icon={"mage:clock"} label={"Stop All"} onClick={() => console.log("Stop All action triggered")}/>
                </div>
                <Divider orientation={"vertical"} className={"h-1/2 my-auto"}/>
                <div className={"flex flex-row gap-1"}>
                    <ActionButton icon={"mage:trash"} label={"Clear Queue"} onClick={() => console.log("Clear Queue action triggered")}/>
                    <ActionButton icon={"mage:settings"} label={"Settings"} onClick={open}/>
                    <ActionButton icon={"mage:file-download"} label={"Export List"} onClick={() => console.log("Export List action triggered")}/>
                </div>
            </div>
        </div>
    );
}

function ActionButton({icon, label, onClick}: { icon: string, label: string, onClick: () => void })
{
    const [hover, setHover] = useState(false);
    const [id] = useState(`action-button-${Math.random().toString(36).substring(2, 15)}`);
    useEffect(() =>
    {
        const button = $(`#${id}`);
        button.on("mouseenter", () => setHover(true));
        button.on("mouseleave", () => setHover(false));

        return () =>
        {
            button.off("mouseenter");
            button.off("mouseleave");
        };
    }, []);

    return (
        <PSButton id={id} key={id} variant={"light"} className={"flex flex-col gap-1 h-full"} onPress={onClick} data-hover={hover} aria-label={label}>

            <Icon
                icon={icon}
                width={20}
                className={"text-foreground/50"}
            />
            <p
                className={
                    cn(
                        "font-light text-tiny max-h-0 overflow-hidden opacity-0",
                        "transition-all duration-250 ease-in-out",
                        "data-[hover=true]:max-h-[2rem] data-[hover=true]:opacity-75"
                    )
                }
                data-hover={hover}
            >
                {label}
            </p>
        </PSButton>
    );
}