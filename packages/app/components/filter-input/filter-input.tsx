import { Select } from "antd";
import { ComponentProps } from "react";

export function FilterInput({
    value,
    options,
    onChange,
    placeholder,
}: {
    value: string | undefined;
    options: string[];
    onChange: (value: string | undefined) => void;
} & Pick<ComponentProps<typeof Select>, "placeholder" | "className">) {
    return (
        <Select
            placeholder={placeholder}
            options={options.map((key) => ({
                label: key,
                value: key,
            }))}
            
            showSearch={false}
            onChange={(value) => {
                onChange(value || undefined);
            }}
            value={value}
            style={{
                width: "300px"
            }}
            size="large"
        
        />
    );
}
