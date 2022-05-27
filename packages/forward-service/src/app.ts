import type { PubsubMessage } from '@google-cloud/pubsub/build/src/publisher';

import { PubSub } from '@google-cloud/pubsub';
import { getBuild } from './build-details';

import express from "express";

const dotenv = require('dotenv');
const pubSubClient = new PubSub();

dotenv.config();

export const app = express();

app.use(express.json());

const handleCloudBuildPubSubMessage = async ({
  data,
  attributes,
}: PubsubMessage) => {
  const { buildId, status } = attributes || {};

  if (!buildId) {
    return;
  }

  if (!status) {
    return;
  }

  if (typeof data !== "string") {
      return;
  }

  // https://cloud.google.com/build/docs/api/reference/rest/v1/projects.builds
  const build = JSON.parse(Buffer.from(data, 'base64').toString());

  await getBuild(build)
    .then(({
      trigger,
      source,
      build,
    }) => {

      console.log({
        build,
      })
      return pubSubClient.topic("ciccd-builds").publishMessage({
        attributes: {
          origin: "cloud-build",
          name: trigger?.name || "n/a",
          status: status.toLowerCase(),
          commitSha: source.commitSha,
          repo: trigger?.github?.name || source.repo || "",
          githubRepoOwner: trigger?.github?.owner || "",
          branchName: source.branchName,
          id: buildId,
          logUrl: build.logUrl || "",
          startTime: build.startTime?.seconds?.toString() || "",
          finishTime: build.finishTime?.seconds?.toString() || "",
        },
      });
    }).catch((error) => {
      console.error(error);
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

  await handleCloudBuildPubSubMessage(pubSubMessage);

  res.status(204).send();
});