import { useQuery } from "react-query";
import { useRepo } from "./repo-context";

export function useTags() {
    const {
        repo,
        owner,
    } = useRepo();

    const {
        data,
    } = useQuery(
        [
            'tags',
            owner,
            repo,
        ],
        () => fetch(
            `/api/github/repos/${owner}/${repo}/tags`,
        ).then((response) => response.json()),
        {
            enabled: !!(owner && repo),
        },
    );

    return data || [];
}
