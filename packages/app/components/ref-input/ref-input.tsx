import { useTags } from "../../github/use-tags";

import AutoComplete from "@mui/material/Autocomplete";
import { useBranches } from "../../github/use-branches";
import { ComponentProps } from "react";
import { FilterInput } from "../filter-input";

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
            <FilterInput
                {...autoCompleteProps}
                onChange={onChange}
                value={value}
                label={label}
                options={[...(noBranches ? [] : branches), ...tags].filter((ref) => !!ref).map((tag) => tag.name)}
            />
        )
        : null;
}
