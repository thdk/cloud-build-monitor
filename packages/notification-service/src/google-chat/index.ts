import { getChatNotifications, getWebhooksByIds } from './firestore';

import { ChatWebhook, CICCDBuild, ThreadKey } from './interfaces';
import { getCommitInfo } from '../common/git';
import { addBuildStatusInfo } from '../common/message-templates';

const getThreadId = (
  threadKey: undefined | ThreadKey,
  {
    commitSha,
    commitAuthor,
    branchName,
    status,
    trigger,
  }: {
    commitSha: string;
    branchName: string;
    commitAuthor?: string;
    status: string;
    trigger: string;
  }) => {
  switch (threadKey) {
    case "author":
      return commitAuthor || undefined;
    case "branch":
      return branchName;
    case "sha":
      return commitSha;
    case "status":
      return status;
    case "trigger":
      return trigger;
    default:
      return undefined;
  }
}

const sendGoogleChat = async (
  message: string,
  webhookURL: string,
  {
    threadId,
  }: {
    threadId?: string;
  } = {},
) => {

  const data = JSON.stringify({
    'text': message,
  });
  let resp;
  await fetch(`${webhookURL}${threadId ? `&threadKey=${threadId}` : ""}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: data,
  }).then((response) => {
    resp = response;
  });
  return resp;
}

export const googleChat = async ({
  id,
  name: trigger,
  status,
  commitSha,
  branchName,
  repo,
  githubRepoOwner,
  logUrl = null,
}: CICCDBuild) => {

  if (!id) {
    throw new Error("'id' is missing in message attributes");
  }

  console.log({
    trigger,
    status,
    commitSha,
    branchName,
    repo,
    githubRepoOwner,
  });

  const sendNotification = () => {
    return getChatNotifications(
      trigger,
      status,
      branchName,
      commitSha,
      githubRepoOwner,
      repo,
      id,
    )
      .then(async (notifications) => {
        console.log(`Sending out ${notifications.length} notifications`);

        const commit = await getCommitInfo({
          sha: commitSha,
          owner: githubRepoOwner,
          repo,
        }).catch(() => {
          console.error(`Failed to fetch git commit: ${githubRepoOwner}/${repo}@${commitSha}`);
          return undefined;
        });

        const {
          author: {
            name: commitAuthor,
          }
        } = commit || { author: {} };

        return Promise.all(
          notifications.map(async (notification) => {
            const {
              message,
              webhooks: webhookIds,
              threadKey,
              description,
            } = notification.data();

            const webhooks = webhookIds
              ? (await getWebhooksByIds(webhookIds))
                .filter((value): value is ChatWebhook => !!value)
              : [];

            const threadId = getThreadId(
              threadKey,
              {
                commitSha,
                commitAuthor,
                branchName,
                status,
                trigger,
              },
            );

            console.log(`Sending chat with description: "${description || "n/a"}" to thread ${threadId ? threadId : "no-thread"}`);

            return Promise.all(
              webhooks.map(({ url, name }) => sendGoogleChat(
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
                  },
                ),
                url,
                {
                  threadId,
                },
              ).then(
                () => {
                  console.log(`Chat message delivered to ${name}`);
                },
              ).catch(
                (e) => {
                  console.log(`Failed to send chat message to ${name}.`);
                  console.error(e);
                }
              ))
            );
          })
        )
      });
  }

  await sendNotification().catch((error) => {
    console.error(`Failed to send notification for build ${id} (status: ${status})`);
    throw error;
  });
};
