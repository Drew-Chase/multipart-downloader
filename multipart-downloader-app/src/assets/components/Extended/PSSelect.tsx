import {cn, Select, SelectProps} from "@nextui-org/react";

export default function PSSelect(props: SelectProps)
{
    return (
        <Select
            classNames={{
                ...props.classNames,
                trigger: cn(
                    "bg-component-background data-[hover]:bg-component-background-hover transition-colors",
                    props.classNames?.trigger ?? ""
                ),
                popoverContent: cn(
                    "w-full bg-component-background/75  backdrop-blur-md",
                    props.classNames?.popoverContent ?? ""
                )
            }}
            {...props}
        >
            {props.children}
        </Select>
    );
}