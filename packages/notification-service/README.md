# ciccd-service

Handles sending notifications to several services for incoming ciccd-builds pub sub messages.

These messages are usually sent by the [forward-service](../forward-service/README.md). However, you can also manually publish these. See the [readme for ciccd-service](../ciccd-service/README.md) for the required attributes in case you want to manually send messages and trigger notifications.

## notification services

- google chat: done
- jira: planned
- github checks: planned
- github comments: planned
- email (using sendgrid api): planned