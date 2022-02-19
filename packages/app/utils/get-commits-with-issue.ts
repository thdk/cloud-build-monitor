import { octokit } from "../github/octocit";

export async function getCommitsWithIssue({
    ref,
    repo,
    owner,
}: {
    /* branch or sh */
    ref?: string;
    repo?: string;
    owner?: string;
}) {
    if (!repo || !owner) {
        return [];
    }

    const [commits] = await Promise.all([
        octokit.repos.listCommits({
            owner,
            repo,
            sha: ref,
        }),
    ]);

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
            };

            // Jira?
            const jiraIssueRegex = new RegExp(/[A-Z]{3}-[0-9]*/);
            const jiraIssueNr = commit.commit.message.match(jiraIssueRegex);

            return jiraIssueNr
                ? fetch(`${process.env.NEXT_PUBLIC_HOST}/api/jira/issue/${jiraIssueNr[0]}`)
                    .then((response) => response.json())
                    .then((jiraIssue) => ({
                        ...commitData,
                        jiraIssue: {
                            summary: jiraIssue.fields.summary || null,
                            key: jiraIssue.key,
                        }
                    }))
                    .catch((e) => {
                        console.error(e);
                        return commitData;
                    })
                    .finally(() => commitData)
                : commitData;
        }),
    );
}
