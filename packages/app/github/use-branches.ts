import { useQuery } from "react-query";
import { useRepo } from "./repo-context";

export function useBranches() {
    const {
        repo,
        owner,
    } = useRepo();

    const {
        data,
    } = useQuery(
        [
            'branches',
            owner,
            repo,
        ],
        () => fetch(
            `/api/github/repos/${owner}/${repo}/branches`,
        ).then((response) => response.json()),
        {
            enabled: !!(owner && repo),
        },
    );

    return data || [];
}
