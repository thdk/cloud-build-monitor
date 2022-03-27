import type { PubsubMessage } from '@google-cloud/pubsub/build/src/publisher';
import type { EventFunction } from '@google-cloud/functions-framework';
import { getCommitInfo } from './git';
import { config } from './config';
import { addOrUpdateCICCDBuild } from './firestore';

function toDateTime(secs: number) {
    var t = new Date(1970, 0, 1);
    t.setSeconds(secs);
    return t;
}

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
        logUrl = null,
        startTime,
        finishTime,
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
    const issueNr = issue ? issue[0] : null;

     await Promise.all([
        addOrUpdateCICCDBuild({
            branchName,
            commitSha,
            commitAuthor: commit.author.name,
            commitSubject: commit.message.split('\n')[0],
            name,
            origin,
            repo,
            status,
            id,
            githubRepoOwner,
            logUrl,
            issueNr,
            startTime: startTime
                ? toDateTime(+startTime)
                : null,
            finishTime: finishTime
                ? toDateTime(+finishTime)
                : null,
        }),
    ]);
};
