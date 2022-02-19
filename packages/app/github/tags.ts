import { octokit } from "./octocit";

type Tag = {
    name: string;
    commit: {
        sha: string;
    };
};

export async function getAllTags({
    owner,
    repo,
}: {
    owner?: string;
    repo?: string;
}) {

    if (!owner || !repo) {
        return [];
    }

    let count = 0
    return octokit.paginate(
        octokit.repos.listTags,
        {
            owner,
            repo,
            per_page: 100,
        },
        (response, done) => {
            count += response.data.length
            if (count >= 1000) {
                done();
            }
            return response.data;
        }
    );
}

export type TagsDictionary = Record<string, string[]>

export function getTagsGroupedByCommitSha(
    tags: Tag[],
) {
    return tags.reduce<TagsDictionary>(
        (p, { commit: { sha }, name }) => {

            p[sha] = [...(p[sha] || []), name,]
                .filter((tagName) => !!tagName);

            return p;
        },
        {},
    );
}
