import {cn, Tooltip, TooltipProps} from "@nextui-org/react";
import {forwardRef} from "react";

const PSTooltip = forwardRef<HTMLDivElement, TooltipProps>((props, ref) =>
{
    return (
        <Tooltip
            ref={ref} // Pass the forwarded ref to the child component
            classNames={{base: cn("pointer-events-none", props.classNames?.base)}}
            closeDelay={props.closeDelay ?? 0}
            shouldCloseOnBlur
            shouldCloseOnInteractOutside={() => true}
            {...props}
        >
            {props.children}
        </Tooltip>
    );
});

export default PSTooltip;