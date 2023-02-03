import type { PubsubMessage } from '@google-cloud/pubsub/build/src/publisher';

import { getChatNotifications, getWebhooksByIds } from './firestore';

import express from "express";
import { sendGoogleChat } from './google-chat';
import Mustache from 'mustache';
import { ChatWebhook, CICCDBuild, ThreadKey } from './interfaces';
import { getCommitInfo } from './git';

const dotenv = require('dotenv');

dotenv.config();

export const app = express();

app.use(express.json());

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
const handleCiccdBuildPubSubMessage = async ({
  attributes,
}: PubsubMessage) => {
  const {
    id,
    name: trigger,
    status,
    commitSha,
    branchName,
    repo,
    githubRepoOwner,
    logUrl = null,
  } = attributes as Record<keyof CICCDBuild, string> || {};

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
      .then((notifications) => {
        console.log(`Sending out ${notifications.length} notifications`);
        return Promise.all(
          notifications.map(async (notification) => {
            const {
              message,
              webhooks: webhookIds,
              threadKey,
              description,
            } = notification.data();

            const mustacheData = {
              id,
              trigger,
              sha: commitSha,
              branch: branchName,
              status,
              logUrl,
              repo: `${githubRepoOwner}/${repo}`,
              commitAuthor,
            };

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
                Mustache.render(
                  message,
                  mustacheData,
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

// express routes
app.post('/', async (req, res) => {
  if (!req.body) {
    const msg = 'no Pub/Sub message received';
    console.error(`error: ${msg}`);
    res.status(400).send(`Bad Request: ${msg}`);
    return;
  }
  if (!req.body.message) {
    const msg = 'invalid Pub/Sub message format';
    console.error(`error: ${msg}`);
    res.status(400).send(`Bad Request: ${msg}`);
    return;
  }

  const pubSubMessage = req.body.message;

  await handleCiccdBuildPubSubMessage(pubSubMessage);

  res.status(204).send();
});
