import type { PubsubMessage } from '@google-cloud/pubsub/build/src/publisher';
import type { EventFunction } from '@google-cloud/functions-framework';
import { sendBuildReportEmail } from './send-email';
import { getCommitInfo } from './git';
import {config} from './config';


export const ciccdBuildEvents: EventFunction = async ({
    attributes,
}: PubsubMessage) => {
    const {
        name,
        status,
        commitSha,
        branchName,
    } = attributes || {};

    if (status !== "success" && status != "failure") {
        return;
    }

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
