import { getCommitInfo } from "../common/git";
import { addBuildStatusInfo } from "../common/message-templates";
import { getJiraUpdates } from "./firestore";
import { CICCDBuild } from "./interfaces";
import { jiraApi } from "./jira-api";
import { transitionIssueTo } from "./jira-helper";

export const jira = async (
    {
        id,
        logUrl,
        commitSha,
        repo,
        githubRepoOwner,
        commitSubject,
        commitAuthor,
        name: trigger,
        status,
        branchName,
    }: CICCDBuild,
    commit: Awaited<ReturnType<typeof getCommitInfo>> | undefined,
) => {
    const commitMessage = commit?.message || commitSubject;

    const updates = await getJiraUpdates(
        trigger,
        status,
        branchName,
    );

    if (!updates.length) {
        console.log(`Didn't find any config to update a jira issue for ${trigger}`);
    }

    await Promise.all(
        updates.flatMap(({
            message,
            issueRegex,
            name,
            transition
        }) => {
            const issueIdRegex = new RegExp(issueRegex);
            const issueIds = issueIdRegex.exec(commitMessage);

            if (!issueIds) {
                console.error(`Couldn't find a jira issue id matching '${issueRegex}' in ${commitMessage}.`);
                return undefined;
            }

            console.log(`Sending jira updates for ${name} to jira issues ${issueIds.join(", ")}`);
            console.log(`Found issue ids: ${issueIds?.join(', ')}`);


            return issueIds.map(async (issueId) => {
                // add comment to jira issue
                await jiraApi?.addComment(
                    issueId,
                    addBuildStatusInfo(
                        message,
                        {
                            id,
                            trigger,
                            sha: commitSha,
                            branch: branchName,
                            status,
                            logUrl,
                            repo: `${githubRepoOwner}/${repo}`,
                            commitAuthor: commitAuthor || null,
                            commitMessage: commitMessage,
                        },
                        {
                            issueRegex,
                        },
                    )
                );

                transition && await transitionIssueTo(issueId, transition);
            });
        })
    )
};
