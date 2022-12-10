import type { PubsubMessage } from '@google-cloud/pubsub/build/src/publisher';

import { getChatNotification } from './firestore';

import express from "express";
import { sendGoogleChat } from './google-chat';
import Mustache from 'mustache';
import { CICCDBuild } from './interfaces';

const dotenv = require('dotenv');

dotenv.config();

export const app = express();

app.use(express.json());

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

  console.log({
    attributes,
  });

  if (!id) {
    throw new Error("'id' is missing in message attributes");
  }

  const sendNotification = () => {
    return getChatNotification(name, status)
      .then((notifications) => {
        return Promise.all(
          notifications.docs.map((notification) => {
            const {
              message,
              webhookUrl,
            } = notification.data() as unknown as {
              message: string;
              buildTrigger: string;
              webhookUrl: string;
            };

            const mustacheData = {
              id,
              trigger: name,
              sha: commitSha,
              branch: branchName,
              status,
              logUrl,
              repo: `${githubRepoOwner}/${repo}`,
            };

            return sendGoogleChat(
              Mustache.render(
                message,
                mustacheData,
              ),
              webhookUrl,
            );
          })
        )
      });
  }

  await Promise.all([
    sendNotification(),
  ]);
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
