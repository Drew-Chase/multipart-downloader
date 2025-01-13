import {cn, Input, InputProps} from "@nextui-org/react";

export default function PSInput(props: InputProps)
{
    return (
        <Input
            {...props}
            classNames={{
                ...props.classNames,
                inputWrapper: cn(
                    "!bg-background-L100 data-[focus]:border-primary/30 data-[hover]:!bg-background-L200 border-1 border-background-L100 transition-all duration-200",
                    props.classNames?.inputWrapper
                )
            }}
        />
    );
}