import {Dropdown, DropdownProps} from "@nextui-org/react";

export default function PSDropdown(props: DropdownProps)
{
    return (
        <Dropdown
            classNames={
                {
                    ...props.classNames,
                    content: "w-full bg-component-background/75  backdrop-blur-md"
                }}
            {...props}
        >
            {props.children}
        </Dropdown>
    );
}