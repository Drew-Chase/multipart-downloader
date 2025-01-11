import {cn, Switch, SwitchProps} from "@nextui-org/react";

// @ts-ignore
interface IExpandedSwitchProps extends SwitchProps
{
    label?: string;
    description?: string;
    toggle?: boolean;
    onToggle?: (selected: boolean) => void;
}

export default function PSSwitch(props: IExpandedSwitchProps)
{
    const updatedProps = {...props};
    delete updatedProps.label;
    delete updatedProps.description;
    delete updatedProps.toggle;
    delete updatedProps.onToggle;

    return (
        <>
            {/* @ts-ignore */}
            <Switch
                {...updatedProps}
                defaultSelected={props.toggle ?? false}
                onValueChange={props.onToggle as ((selected: boolean) => void) | undefined}
                classNames={{
                    ...props.classNames,
                    base: cn(
                        "inline-flex flex-row-reverse w-full max-w-full bg-component-background hover:bg-component-background-hover items-center",
                        "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                        "data-[selected=true]:border-primary",
                        props.classNames?.base
                    ),
                    wrapper: cn("p-0 h-4 overflow-visible bg-foreground/20", props.classNames?.wrapper),
                    thumb: cn(
                        "w-6 h-6 border-2 shadow-lg",
                        "group-data-[hover=true]:border-primary",
                        //selected
                        "group-data-[selected=true]:ml-6",
                        // pressed
                        "group-data-[pressed=true]:w-7",
                        "group-data-[selected]:group-data-[pressed]:ml-4",
                        props.classNames?.thumb
                    )
                }}
            >
                <div className="flex flex-col gap-1">
                    <p className="text-medium text-start">{props.label}</p>
                    <p className="text-tiny text-foreground/50 text-start">
                        {props.description}
                    </p>
                </div>
            </Switch>
        </>
    );
}
