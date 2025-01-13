import PSSelect from "../../../variants/PSSelect.tsx";
import {SelectItem} from "@nextui-org/react";
import {ProxyType} from "./ProxyList.tsx";

export function ProxyTypeSelector({value, onValueChange}: { value: ProxyType, onValueChange: (value: ProxyType) => void })
{
    return (
        <PSSelect
            label={"Type"}
            selectedKeys={[value]}
            onSelectionChange={value =>
            {
                console.log([...value][0] as ProxyType);
                onValueChange([...value][0] as ProxyType);
            }}
            selectionMode={"single"}
            disallowEmptySelection
            className={"w-[200px]"}
            classNames={{
                value: "uppercase"
            }}
        >

            {Object.values(ProxyType).map(type => (<SelectItem key={type} value={type} textValue={type as string} className={"uppercase"}>{type}</SelectItem>))}

        </PSSelect>
    );
}