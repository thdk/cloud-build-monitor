import type { PubsubMessage } from '@google-cloud/pubsub/build/src/publisher';

import { getCommitInfo } from './git';
import { addOrUpdateCICCDBuild } from './firestore';

import express from "express";
import { CICCDBuild } from './interfaces';

const dotenv = require('dotenv');

dotenv.config();

export const app = express();

app.use(express.json());

const handleCloudBuildPubSubMessage = async ({
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
  } = attributes as Record<keyof CICCDBuild, string> || {};

  console.log({
    attributes,
  });

  if (!id) {
    throw new Error("'id' is missing in message attributes");
  }

  if (!origin) {
    throw new Error("'origin' is missing in message attributes");
  }

  if (!repo || !githubRepoOwner || !commitSha) {
    console.log('Build was not triggered from a github repo.');
    return;
  }

  if (status === "queued") {
    console.log(`Skipping checking for notifications for status: ${status}`);
    return;
  }

  const commit = await getCommitInfo({
    sha: commitSha,
    repo,
    owner: githubRepoOwner,
  }).catch((e) => {
    console.error(e);
    return undefined
  });

  await Promise.all([
    addOrUpdateCICCDBuild({
      branchName,
      commitSha,
      commitAuthor: commit?.author.name || "unknown",
      commitSubject: commit?.message.split('\n')[0] || "n/a",
      name,
      origin,
      repo,
      status,
      id,
      githubRepoOwner,
      logUrl,
      issueNr: null, // todo: remove?
      startTime: startTime
        ? new Date(startTime)
        : null,
      finishTime: finishTime
        ? new Date(finishTime)
        : null,
    })
    .then(() => {
      console.log("Succesfully saved new ciccd build record into firestore builds collection.")
    })
    .catch((e) => {
      console.error("Failed to insert build status in firestore databse");
      console.error(e);
      throw e;
    }),
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

  await handleCloudBuildPubSubMessage(pubSubMessage);

  res.status(204).send();
});
