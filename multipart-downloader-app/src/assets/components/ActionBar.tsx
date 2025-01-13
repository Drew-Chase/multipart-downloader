import {Button, ButtonGroup, Link} from "@nextui-org/react";
import {getCurrentWindow} from "@tauri-apps/api/window";
import {open} from "@tauri-apps/plugin-shell";
import PSTooltip from "./variants/PSTooltip.tsx";
import {getRealTheme, Themes, useTheme} from "../providers/ThemeProvider.tsx";
import {Icon} from "@iconify-icon/react";

export default function ActionBar()
{
    const appWindow = getCurrentWindow();
    const {theme, setTheme} = useTheme();
    return (
        <div className={"flex flex-row h-[2.5rem] backdrop-blur-sm sticky top-0 w-full z-[51] backdrop-saturate-150 select-none"} data-tauri-drag-region="">
            <div className={"flex flex-row"}>
                <p className={"mx-2 mt-1 text-large font-bold select-none text-primary"} data-tauri-drag-region="">Multipart Downloader</p>

                <ButtonGroup className={"mr-8 mt-1 h-[2rem]"}>
                    <PSTooltip content={"View on Github"}>
                        <Button variant={"light"} className={"min-w-0 h-[2rem]"} radius={"sm"} as={Link} onPress={() => open("https://github.com/drew-chase/multipart-downloader")}>
                            <Icon icon="mdi:github" height="1rem"/>
                        </Button>
                    </PSTooltip>
                    <PSTooltip content={"Report a bug or request a feature"}>
                        <Button variant={"light"} className={"min-w-0 h-[2rem]"} radius={"sm"} as={Link} onPress={() => open("https://github.com/drew-chase/multipart-downloader/issues")}>
                            <Icon icon="mdi:bug" height="1rem"/>
                        </Button>
                    </PSTooltip>
                    <PSTooltip content={"Donate to the developer"}>
                        <Button variant={"light"} className={"min-w-0 h-[2rem] text-red-500"} radius={"sm"} as={Link} onPress={() => open("https://github.com/sponsors/Drew-Chase")}>
                            <Icon icon="fa6-solid:heart" height="1rem"/>
                        </Button>
                    </PSTooltip>
                </ButtonGroup>
            </div>
            <div className={"flex flex-row ml-auto"}>
                <ButtonGroup className={"h-[2rem]"}>
                    <PSTooltip content={`Enable ${getRealTheme(theme) === "dark" ? "Light" : "Dark"} Mode`}>
                        <Button variant={"light"} className={"min-w-0 h-[2rem] text-tiny"} radius={"sm"} onPress={() => setTheme(prev => getRealTheme(prev) === "dark" ? Themes.LIGHT : Themes.DARK)}>
                            <Icon icon={`mage:${getRealTheme(theme) === "dark" ? "moon" : "sun"}-fill`} height="1rem"/>
                        </Button>
                    </PSTooltip>
                    <Button variant={"light"} className={"min-w-0 h-[2rem] text-tiny"} radius={"sm"} onPress={() => appWindow.minimize()}>
                        <Icon icon="fa6-regular:window-minimize" height=".85rem"/>
                    </Button>
                    <Button variant={"light"} className={"min-w-0 h-[2rem] text-tiny"} radius={"sm"} onPress={() => appWindow.toggleMaximize()}>
                        <Icon icon="fa6-regular:square" height=".85rem"/>
                    </Button>
                    <Button variant={"light"} color={"danger"} className={"min-w-0 h-[2rem] text-tiny"} radius={"sm"} onPress={() => appWindow.close()}>
                        <Icon icon="fa6-solid:x" height=".85rem"/>
                    </Button>
                </ButtonGroup>
            </div>
        </div>
    );
}