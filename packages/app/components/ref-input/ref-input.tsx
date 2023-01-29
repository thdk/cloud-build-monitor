import { useTags } from "../../github/use-tags";

import { useBranches } from "../../github/use-branches";
import { ComponentProps } from "react";
import { FilterInput } from "../filter-input";

export function RefInput({
    value,
    noBranches,
    placeholder,
    ...filterProps
}: {
    value?: string | undefined;
    noBranches?: boolean,
} & Omit<ComponentProps<typeof FilterInput>, "options">) {
    const tags = useTags();
    const branches = useBranches();

    return tags
        ? (
            <FilterInput
                placeholder={placeholder}
                value={value}
                options={[...(noBranches ? [] : branches), ...tags].filter((ref) => !!ref).map((tag) => tag.name)}
                {...filterProps}
            />
        )
        : null;
}
