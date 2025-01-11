import {Autocomplete, AutocompleteProps, cn} from "@nextui-org/react";

export default function PSAutocomplete(props: AutocompleteProps)
{
    return (
        <Autocomplete
            inputProps={{
                classNames:
                    {
                        inputWrapper: cn(
                            "bg-component-background data-[focus]:!bg-component-background-hover data-[hover]:!bg-component-background-hover",
                            props.inputProps?.classNames?.inputWrapper ?? ""
                        )
                    },
                ...props.inputProps
            }}
            popoverProps={{
                classNames:
                    {
                        content: cn(
                            "bg-component-background/75 backdrop-blur-md",
                            props.popoverProps?.classNames?.content ?? ""
                        )
                    },
                ...props.popoverProps
            }}
            {...props}
        >
            {props.children}
        </Autocomplete>
    );
}