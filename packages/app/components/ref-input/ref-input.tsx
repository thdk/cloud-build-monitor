import { useTags } from "../../github/use-tags";

import { useBranches } from "../../github/use-branches";
import { ComponentProps } from "react";
import { FilterInput } from "../filter-input";

export function RefInput({
    value,
    noBranches,
    onChange,
    placeholder,
}: {
    value: string | undefined;
    noBranches?: boolean,
    onChange: (value: string | undefined) => void;
} & Pick<ComponentProps<typeof FilterInput>, "placeholder">) {
    const tags = useTags();
    const branches = useBranches();

    return tags
        ? (
            <FilterInput
                placeholder={placeholder}
                onChange={onChange}
                value={undefined}
                options={[...(noBranches ? [] : branches), ...tags].filter((ref) => !!ref).map((tag) => tag.name)}
            />
        )
        : null;
}
