import type { PubsubMessage } from '@google-cloud/pubsub/build/src/publisher';
import type { EventFunction } from '@google-cloud/functions-framework';
import { sendBuildReportEmail } from './send-email';
import { getCommitInfo } from './git';
import { config } from './config';
import { addOrUpdateCICCDBuild } from './firestore';


export const ciccdBuildEvents: EventFunction = async ({
    attributes,
}: PubsubMessage) => {
    const {
        id,
        name,
        status,
        commitSha,
        branchName,
        origin,
        repo,
        githubRepoOwner,
        logUrl,
    } = attributes || {};

    if (!id) {
        throw new Error("'id' is missing in message attributes");
    }

    const commit = await getCommitInfo({
        sha: commitSha,
        repo,
        owner: githubRepoOwner,
    });

    const issue = commit.message.match(new RegExp(config.ISSUE_REGEX));

    console.log({
        commit,
    })
    await Promise.all([
        addOrUpdateCICCDBuild({
            branchName,
            commitSha,
            name,
            origin,
            repo,
            status,
            id,
            githubRepoOwner,
            logUrl,
        }),
        status !== "success" && status != "failure"
            ? undefined
            : sendBuildReportEmail({
                branch: branchName,
                author: commit.author.email,
                issueNr: issue ? issue[0] : null,
                sha: commitSha,
                status,
                trigger: name,
            }),
    ]);
};
