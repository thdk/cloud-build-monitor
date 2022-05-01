import type { PubsubMessage } from '@google-cloud/pubsub/build/src/publisher';

import { PubSub } from '@google-cloud/pubsub';
import { getBuild } from './build-details';
import { config } from './config';
import express from "express";

const dotenv = require('dotenv');
const pubSubClient = new PubSub();

dotenv.config();

export const app = express();

app.use(express.json());

const handleCloudBuildPubSubMessage = async ({
  attributes,
}: PubsubMessage) => {
  const { buildId, status } = attributes || {};

  if (!buildId) {
    return;
  }

  if (!status) {
    return;
  }

  const {
    trigger,
    source,
    build,
  } = await getBuild(buildId);

  await pubSubClient.topic("ciccd-builds").publishMessage({
    attributes: {
      origin: "cloud-build",
      name: trigger?.name || "n/a",
      status: status.toLowerCase(),
      commitSha: source.commitSha,
      repo: trigger?.github ? source.repo : config.GITHUB_REPO || "",
      githubRepoOwner: trigger?.github?.owner || config.GITHUB_OWNER || "",
      branchName: source.branchName,
      id: buildId,
      logUrl: build.logUrl || "",
      startTime: build.startTime?.seconds?.toString() || "",
      finishTime: build.finishTime?.seconds?.toString() || "",
    },
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
  console.log({
    body: JSON.stringify(req.body),
    message: pubSubMessage,
  });

  await handleCloudBuildPubSubMessage(pubSubMessage);

  res.status(204).send();
});