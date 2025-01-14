import {useEffect, useState} from "react";
import {ProxyTypeSelector} from "./ProxyTypeSelector.tsx";
import PSInput from "../../../variants/PSInput.tsx";
import PSTooltip from "../../../variants/PSTooltip.tsx";
import {Icon} from "@iconify-icon/react";
import PSButton from "../../../variants/PSButton.tsx";
import {Proxy, ProxyType} from "./ProxyList.tsx";
import {ButtonGroup, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from "@nextui-org/react";

export function NewProxyInput({onSubmit, value, onCancel}: { onSubmit: (proxy: Proxy) => void, value?: Proxy, onCancel?: () => void })
{
    const [lastIndex, setLastIndex] = useState<number>(+(localStorage.getItem("proxy-list-index") ?? "0"));
    const [proxyType, setProxyType] = useState(ProxyType.HTTP);
    const [host, setHost] = useState("");
    const [port, setPort] = useState(80);
    const [useAuth, setUseAuth] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const resetFields = () =>
    {
        setProxyType(ProxyType.HTTP);
        setHost("");
        setPort(80);
        setUsername("");
        setPassword("");
        setUseAuth(false);
    };

    const submit = () =>
    {
        onSubmit(
            {
                id: lastIndex + 1,
                host: host,
                port: port,
                username: username,
                password: password,
                type: proxyType
            }
        );
        setLastIndex(lastIndex + 1);
        localStorage.setItem("proxy-list-index", lastIndex.toString());
        resetFields();
    };

    useEffect(() =>
    {
        if (value)
        {
            setProxyType(value.type);
            setHost(value.host);
            setPort(value.port);
            setUsername(value.username ?? "");
            setPassword(value.password ?? "");
            setUseAuth(value.username !== "" && value.password !== "");
        } else resetFields();
    }, [value]);

    return (
        <div className={"flex flex-col gap-2 w-full"}>
            <div className={"flex flex-row gap-2 w-full h-full"}>
                <ProxyTypeSelector value={proxyType} onValueChange={setProxyType}/>
                <PSInput
                    label={"Proxy"}
                    placeholder={"example.com"}
                    value={host}
                    onValueChange={setHost}
                    endContent={
                        <PSTooltip
                            content={
                                <div>
                                    <p>The primary domain of the proxy,</p>
                                    <p>this should not include the port or protocol,</p>
                                    <p>ex: <b className={"text-success"}><i>google.com</i></b> instead of <b className={"text-danger"}><i>https://google.com:443</i></b></p>
                                </div>
                            }
                        >
                            <div className={"w-8 h-full cursor-help flex items-center justify-center"}>
                                <Icon icon={"mage:information-square-fill"} width="18"/>
                            </div>
                        </PSTooltip>
                    }
                    onKeyUp={e =>
                    {
                        if (e.key === "Enter") submit();
                    }}
                />
                <PSInput
                    className={"max-w-[6rem] w-fit max-h-[unset]"}
                    classNames={{
                        inputWrapper: "h-full",
                        input: "text-center"
                    }}
                    endContent={
                        <PSTooltip
                            content={
                                <div>
                                    <p>The port number of the proxy,</p>
                                    <p>this should be a valid numeric value.</p>
                                    <Table removeWrapper className={"mt-4"} aria-label={"proxy-port-info-table"}>
                                        <TableHeader>
                                            <TableColumn key="protocol" aria-label="Protocol">Protocol</TableColumn>
                                            <TableColumn key="default-port" aria-label="Default Port">Default Port</TableColumn>
                                        </TableHeader>
                                        <TableBody>
                                            <TableRow key="http">
                                                <TableCell key="protocol" aria-label="HTTP Protocol">HTTP</TableCell>
                                                <TableCell key="default-port" aria-label="Default Port 80">80</TableCell>
                                            </TableRow>
                                            <TableRow key="socks4">
                                                <TableCell key="protocol" aria-label="SOCKS4 Protocol">SOCKS4</TableCell>
                                                <TableCell key="default-port" aria-label="Default Port 1080">1080</TableCell>
                                            </TableRow>
                                            <TableRow key="socks5">
                                                <TableCell key="protocol" aria-label="SOCKS5 Protocol">SOCKS5</TableCell>
                                                <TableCell key="default-port" aria-label="Default Port Range 1080 to 1085">1080-1085</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            }
                        >
                            <div className={"w-8 h-full cursor-help flex items-center justify-center"}>
                                <Icon icon={"mage:information-square-fill"} width="18"/>
                            </div>
                        </PSTooltip>
                    }
                    value={port.toString()}
                    onValueChange={value => setPort(+(value.replace(/[^0-9]/g, "")))}
                />
                <ButtonGroup>
                    <PSTooltip content={`${useAuth ? "Disable" : "Use"} Authentication`}>
                        <PSButton
                            color={"default"}
                            onPress={() => setUseAuth(prev => !prev)}
                            className={"h-full bg-background-L100 data-[hover]:bg-background-L200 flex flex-row gap-3"}
                            data-active={useAuth}
                        >
                            <Icon icon="mage:lock" width="18"/>
                            <Icon icon="mage:chevron-up" width="16" data-active={useAuth ? "true" : "false"} className={"rotate-180 transition-all duration-250 data-[active=true]:rotate-0"}/>
                        </PSButton>
                    </PSTooltip>
                    {value ? (
                        <>
                            <PSTooltip content={"Save proxy"} delay={800}>
                                <PSButton
                                    // onPress={submit}
                                    className={"h-full bg-background-L100 data-[hover]:bg-background-L200"}
                                >
                                    <Icon icon="mage:check" width="18"/>
                                </PSButton>
                            </PSTooltip>
                            <PSTooltip content={"Ignore changes"} delay={800}>
                                <PSButton
                                    onPress={onCancel}
                                    className={"h-full bg-background-L100 data-[hover]:bg-background-L200"}
                                >
                                    <Icon icon="iconoir:cancel" width="18"/>
                                </PSButton>
                            </PSTooltip>
                        </>
                    ) : (
                        <PSTooltip content={"Add new proxy"} delay={800}>
                            <PSButton
                                onPress={submit}
                                className={"h-full bg-background-L100 data-[hover]:bg-background-L200"}
                            >
                                <Icon icon="mage:plus" width="18"/>
                            </PSButton>
                        </PSTooltip>
                    )}
                </ButtonGroup>
            </div>
            <div className={"flex flex-row gap-2 overflow-y-hidden opacity-0 max-h-0 transition-all duration-[500ms] data-[active=true]:opacity-100 data-[active=true]:max-h-[10rem] ease-in-out"} data-active={useAuth}>
                <PSInput
                    label={"Username"}
                    placeholder={"Username"}
                    value={username}
                    onValueChange={setUsername}
                    endContent={<Icon icon="mage:scan-user" width="24"/>}
                />
                <PSInput
                    label={"Password"}
                    placeholder={"Password"}
                    value={password}
                    onValueChange={setPassword}
                    type={"password"}
                    endContent={<Icon icon="mage:lock" width="24"/>}
                />
            </div>
        </div>
    );
}
