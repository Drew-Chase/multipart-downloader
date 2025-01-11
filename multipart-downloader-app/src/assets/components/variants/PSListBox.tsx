import {cn, Listbox, ListboxProps} from "@nextui-org/react";

export default function PSListBox(props: ListboxProps)
{
    return (
        <Listbox
            {...props}
            className={cn("w-full bg-component-background rounded-lg overflow-y-auto", props.className)}
        >
            {props.children}
        </Listbox>
    );
}