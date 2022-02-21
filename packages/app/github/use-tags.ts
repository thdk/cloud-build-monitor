import { useQuery } from "react-query";
import { useRepo } from "./repo-context";
import { getAllTags } from "./tags";
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
        () => getAllTags({
            owner,
            repo,
        }),
    );

    return data;
}