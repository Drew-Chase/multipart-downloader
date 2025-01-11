import {Button, ButtonProps, cn} from "@nextui-org/react";

export default function PSButton(props: ButtonProps)
{
    return (
        <Button
            {...props}
            className={cn(
                "min-w-2 min-h-6",
                props.className ?? ""
            )}
        >
            {props.children}
        </Button>
    );
}