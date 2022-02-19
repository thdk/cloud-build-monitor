import { useQuery } from "react-query";
import { getAllBranches } from "./branches";
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
        () => getAllBranches({
            owner,
            repo,
        }),
    );

    return data || [];
}
