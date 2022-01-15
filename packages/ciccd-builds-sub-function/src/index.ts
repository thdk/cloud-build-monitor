import type { PubsubMessage } from '@google-cloud/pubsub/build/src/publisher';
import type { EventFunction } from '@google-cloud/functions-framework';
import { sendBuildReportEmail } from './send-email';
import { getCommitInfo } from './git';
import {config} from './config';


export const ciccdBuildEvents: EventFunction = async ({
    attributes,
}: PubsubMessage) => {
    const {
        origin,
        name,
        status,
        commitSha,
        branchName,
        repo,
    } = attributes || {};

    console.log({
        origin,
        name,
        status,
        commitSha,
        branchName,
        repo,
    });

    const commit = await getCommitInfo(commitSha);

    const issue = commit.message.match(new RegExp(config.ISSUE_REGEX));
    await sendBuildReportEmail({
        branch: branchName,
        author: commit.author.email,
        issueNr: issue ? issue[0] : null,
        sha: commitSha,
        status,
        trigger: name,
    })
};
