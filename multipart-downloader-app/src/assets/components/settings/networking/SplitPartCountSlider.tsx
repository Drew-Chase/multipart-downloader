import {Slider} from "@nextui-org/react";
import PSInput from "../../variants/PSInput.tsx";

export default function SplitPartCountSlider({value, onValueChange}: { value: number, onValueChange: (value: number) => void })
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
            marks={[
                {
                    value: 1,
                    label: "1"
                },
                {
                    value: 16,
                    label: "16"
                },
                {
                    value: 128,
                    label: "128"
                },
                {
                    value: 255,
                    label: "255"
                }
            ]}
            renderValue={() =>
                <PSInput
                    value={value.toString()}
                    className={"w-12"}
                    classNames={{
                        input: "text-center",
                        inputWrapper: "!bg-background-L200"
                    }}
                    onValueChange={v => onValueChange(+v.replace(/[^0-9]/g, ""))}
                />}
        />
    );
}