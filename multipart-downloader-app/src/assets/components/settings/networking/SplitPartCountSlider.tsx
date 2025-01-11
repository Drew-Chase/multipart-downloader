import {Slider} from "@nextui-org/react";

export default function SplitPartCountSlider({value, onValueChange}: { value: number, onValueChange: (value: number) => void})
{
    return (
        <Slider
            label={"Split parts count"}
            value={value}
            maxValue={255}
            minValue={1}
            step={1}
            color={"primary"}
            showTooltip
            size={"sm"}
            className={"w-full"}
            onChange={value => onValueChange(value as number)}
        />
    );
}