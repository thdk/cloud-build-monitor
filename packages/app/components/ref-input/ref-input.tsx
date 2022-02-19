import { useTags } from "../../github/use-tags";

import AutoComplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useRepo } from "../../github/repo-context";
import { useBranches } from "../../github/use-branches";

export function RefInput() {
    const tags = useTags();
    const branches = useBranches();

    const {
        setRepoRef,
        repoRef,
    } = useRepo();

    return tags && repoRef
        ? (
            <AutoComplete
                options={[...branches, ...tags].filter((ref) => !!ref).map((tag) => tag.name)}
                renderInput={(params) => <TextField {...params} label="Tag" />}
                value={repoRef}
                onChange={(_, value) => {
                    value && setRepoRef(value);
                }}
                sx={{
                    width: 300,
                }}
                disableClearable
                size="small"
            />
        )
        : null;
}
