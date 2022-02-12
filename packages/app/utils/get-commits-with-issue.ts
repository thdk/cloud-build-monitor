import { octokit } from "../github/octocit";
import { jiraApi } from "../jira/jira-api";

export async function getCommitsWithIssue({
    ref,
    repo,
    owner,
}: {
    /* branch or sh */
    ref: string;
    repo: string;
    owner: string;
}) {
    const [commits] = await Promise.all([
        octokit.repos.listCommits({
            owner,
            repo,
            sha: ref,
        }),
    ]);

    return Promise.all(
        commits.data.map(async (commit) => {
            // Jira?
            const jiraIssueRegex = new RegExp(/[A-Z]{3}-[0-9]*/);
            const jiraIssueNr = commit.commit.message.match(jiraIssueRegex);
            const jiraIssue = jiraIssueNr && await jiraApi?.getIssue(jiraIssueNr[0]);

            return ({
                ...commit,
                jiraIssue: jiraIssue
                    ? {
                        summary: jiraIssue.fields.summary || null,
                        key: jiraIssue.key,
                    }
                    : null,
            });
        })
    )
}