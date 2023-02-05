# ciccd-service

Handles sending notifications to several services for incoming ciccd-builds pub sub messages.

These messages are usually sent by the [forward-service](../forward-service/README.md). However, you can also manually publish these. See the [readme for ciccd-service](../ciccd-service/README.md) for the required attributes in case you want to manually send messages and trigger notifications.

## notification services

- google chat: done
- jira comments: done
- jira status updates: planned
- github checks: planned
- github comments: planned
- email (using sendgrid api): planned

## Run locally

Add a `.env` file containing your github token.

```
GITHUB_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxx

## jira server
JIRA_USER=
JIRA_PASSWORD=
JIRA_HOST=jira-server.your-domain.com
```

Next build and start the server:

```sh
yarn install
yarn build
yarn dev
```

Edit the file in `./tests/pub-sub-message.json` with the data you would like to test.

Now run `trigger.sh` from the `./tests` folder.