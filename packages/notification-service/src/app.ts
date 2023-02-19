import express from "express";
import { getCommitInfo } from "./common/git";
import { googleChat } from "./google-chat";
import { jira } from "./jira";

const dotenv = require('dotenv');

dotenv.config();

export const app = express();

app.use(express.json());

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

  const pubSubMessage = req.body.message.attributes;

  console.log({ pubSubMessage })

  const {
    commitSha,
    repo,
    githubRepoOwner,
    status,
  } = pubSubMessage;

  if (status === "working" || status === "queued") {
    console.log(`Skipping checking for notifications for status: ${status}`);
    res.status(204).send();
    return;
  }

  const commit = (githubRepoOwner && repo && commitSha)
    ? await getCommitInfo(
      {
        owner: githubRepoOwner,
        repo,
        sha: commitSha,
      }
    ).catch(
      (error) => {
        console.error(error);
        return undefined;
      }
    )
    : undefined;

  await Promise.all([
    googleChat(pubSubMessage, commit),
    jira(pubSubMessage, commit),
  ]);

  res.status(204).send();
});
