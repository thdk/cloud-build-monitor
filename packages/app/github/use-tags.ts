import { useQuery } from "react-query";
import { getAllTags } from "./tags";

export function useTags({
    repo,
    owner,
}: {
    owner?: string;
    repo?: string;
}) {
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
