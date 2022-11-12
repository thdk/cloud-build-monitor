import AutoComplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { ComponentProps } from "react";

export function FilterInput({
    value,
    label,
    noBranches,
    options,
    onChange,
    ...autoCompleteProps
}: {
    value: string | undefined;
    noBranches?: boolean,
    label: string;
    options: string[];
    onChange: (value: string | undefined) => void;
} & Pick<ComponentProps<typeof AutoComplete>, "disableClearable" | "className">) {
    return (
        <AutoComplete
            {...autoCompleteProps}
            options={options}
            renderInput={(params) => (
                <TextField {...params} label={label} size="small" />
            )}
            freeSolo
            onChange={(_, value) => {
                onChange(value || undefined);
            }}
            value={value || ""}
            sx={{
                width: 300,
            }}
        />
    );
}
