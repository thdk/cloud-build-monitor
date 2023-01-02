import type { PubsubMessage } from '@google-cloud/pubsub/build/src/publisher';

import { getChatNotifications } from './firestore';

import express from "express";
import { sendGoogleChat } from './google-chat';
import Mustache from 'mustache';
import { CICCDBuild, ThreadKey } from './interfaces';
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
}: {
  commitSha: string;
  branchName: string;
  commitAuthor?: string;
  status: string;
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
    default:
      return undefined;   
  }
}
const handleCiccdBuildPubSubMessage = async ({
  attributes,
}: PubsubMessage) => {
  const {
    id,
    name,
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
  } = commit || { author: {}};

  const sendNotification = () => {
    return getChatNotifications(name, status, branchName)
      .then((notifications) => {
        return Promise.all(
          notifications.map((notification) => {
            const {
              message,
              webhookUrl,
              threadKey,
            } = notification.data();

            const mustacheData = {
              id,
              trigger: name,
              sha: commitSha,
              branch: branchName,
              status,
              logUrl,
              repo: `${githubRepoOwner}/${repo}`,
              commitAuthor,
            };
            
            const threadId = getThreadId(
              threadKey,
              {
                commitSha,
                commitAuthor,
                branchName,
                status,
              },
            );

            return sendGoogleChat(
              Mustache.render(
                message,
                mustacheData,
              ),
              webhookUrl,
              {
                threadId,
              },
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
