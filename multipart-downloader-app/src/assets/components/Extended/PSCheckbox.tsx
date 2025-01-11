import {Checkbox, CheckboxProps, cn} from "@nextui-org/react";

export default function PSCheckbox(props: CheckboxProps)
{
    return (
        <Checkbox
            classNames={{
                base: cn(
                    "flex flex-row-reverse items-center w-full max-w-[calc(100%_-_1rem)] ml-1",
                    "py-1 px-2 my-[unset] gap-4",
                    "bg-component-background-hover/50 data-[hover]:bg-component-background-hover rounded-lg",
                    "data-[selected]:!bg-primary/50",
                    props.classNames?.base ?? ""
                ),
                label: cn("w-full text-left mr-auto", props.classNames?.label ?? ""),
                icon: cn("w-4 h-4 ml-auto", props.classNames?.icon ?? "")
            }}
            {...props}
        >
            {props.children}
        </Checkbox>
    );
}