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
        ).then(async (response) => {
            const data = await response.json()
            if (response.ok) {
                return data;
            }

            return Promise.reject(
                (data && data.message) || response.status,
            );
        }),
        {
            enabled: !!(owner && repo),
        },
    );

    return data || [];
}
