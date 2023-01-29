import { AutoComplete,  SelectProps } from "antd";

type FilterInputOption = {
    readonly label: string;
    readonly value: string;
}

export function FilterInput({
    value,
    options,
    allowClear = true,
    ...selectProps
}: {
    value?: string | undefined;
    options: string[];
} & Pick<SelectProps<string, FilterInputOption>, "placeholder" | "className" |"onSelect" | "onClear"| "onChange" | "allowClear">) {
    return (
        <AutoComplete
            options={options.map((key) => ({
                label: key,
                value: key,
            }))}
            allowClear={allowClear}
            filterOption={(search, data) => !!(data && data?.label.indexOf(search) > -1)}
            showSearch
            backfill
            value={value}
            style={{
                width: "300px"
            }}
            {...selectProps}
        />
    );
}
