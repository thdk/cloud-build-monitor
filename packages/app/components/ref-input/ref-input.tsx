import { useTags } from "../../github/use-tags";

import AutoComplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useBranches } from "../../github/use-branches";
import { ComponentProps } from "react";

export function RefInput({
    value,
    label,
    noBranches,
    onChange,
    ...autoCompleteProps
}: {
    value: string | undefined;
    noBranches?: boolean,
    label: string;
    onChange: (value: string | undefined) => void;
} & Pick<ComponentProps<typeof AutoComplete>, "disableClearable" | "className">) {
    const tags = useTags();
    const branches = useBranches();

    return tags
        ? (
            <AutoComplete
                {...autoCompleteProps}
                options={[...(noBranches ? [] : branches), ...tags].filter((ref) => !!ref).map((tag) => tag.name)}
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
        )
        : null;
}
