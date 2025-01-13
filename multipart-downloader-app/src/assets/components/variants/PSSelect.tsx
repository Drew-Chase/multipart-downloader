import {cn, Select, SelectProps} from "@nextui-org/react";

export default function PSSelect(props: SelectProps)
{
    return (
        <Select
            {...props}
            classNames={{
                ...props.classNames,
                trigger: cn(
                    "bg-background-L100 data-[hover]:bg-background-L200 transition-colors",
                    "aria-[expanded=true]:border-primary/30 border-1 border-transparent",
                    props.classNames?.trigger ?? ""
                ),
                popoverContent: cn(
                    "w-full bg-background/75  backdrop-blur-md",
                    props.classNames?.popoverContent ?? ""
                )
            }}
        >
            {props.children}
        </Select>
    );
}