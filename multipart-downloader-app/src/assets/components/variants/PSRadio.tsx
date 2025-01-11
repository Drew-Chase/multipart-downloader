import {cn, Radio, RadioProps} from "@nextui-org/react";

export default function PSRadio(props: RadioProps)
{
    const {children, ...otherProps} = props;
    return (
        <Radio
            {...otherProps}
            classNames={{
                base: cn(
                    // "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
                    // "flex-row-reverse max-w-[300px] cursor-pointer rounded-lg gap-4 p-4 border-2 border-transparent",
                    // "data-[selected=true]:border-primary",


                    "flex flex-row-reverse items-center w-full max-w-[calc(100%_-_1rem)] ml-1 justify-between",
                    "py-1 px-2 my-[unset] gap-4",
                    "bg-component-background-hover/50 data-[hover]:bg-component-background-hover rounded-lg",
                    "data-[selected]:!bg-primary/50",
                    props.classNames?.base
                )
            }}
        >
            {children}
        </Radio>
    );
}