import express from "express";
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

  console.log({pubSubMessage})
  await googleChat(pubSubMessage);
  await jira(pubSubMessage);

  res.status(204).send();
});
