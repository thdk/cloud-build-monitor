import { createOctokit } from "./octokit";

export async function getCommit({
    owner,
    repo,
    ref,
}: {
    owner: string;
    repo: string;
    ref: string;
}) {
    const octokit = createOctokit();
    return octokit.repos.getCommit({
        owner,
        repo,
        ref,
    });
};

export async function getCommits({
    ref,
    repo,
    owner,
    since,
}: {
    /* branch or sha */
    ref?: string;
    repo?: string;
    owner?: string;
    since?: string;
}) {
    if (!repo || !owner) {
        return [];
    }

    const octokit = createOctokit();
    const commits = await octokit.repos.listCommits({
        owner,
        repo,
        sha: ref,
        per_page: 100,
        since,
    });

    return Promise.all(
        commits.data.map(async (commit) => {
            const commitData = {
                sha: commit.sha,
                html_url: commit.html_url,
                author: {
                    avatar_url: commit.author?.avatar_url || null,
                },
                committer: {
                    avatar_url: commit.committer?.avatar_url || null,
                    login: commit.committer?.login || null,
                },
                commit: {
                    message: commit.commit.message,
                    committer: {
                        date: commit.commit.committer?.date || null,
                    },
                },
                parents: commit.parents.map((parent) => parent.sha),
            };

            return commitData;
        }),
    );
}
