# ciccd-builds-sub-function

Handles CICCD pub sub messages to add build statuses to the dashboard database and sends notifications.

## Requirements

- create a `ciccd-builds` topic and add a subscription
    ```sh
    gcloud pubsub topics create ciccd-builds
    gcloud pubsub subscriptions create ciccd-builds-sub --topic ciccd-builds
    ```
- create a `config.yaml` file containing the following keys:
    - TODO: add example templates to the repo
    - make the `config.yaml` file available as 'ciccd-config' secret in Cloud Secret Manager
- provide the following environment variables using Google Cloud Secret Manager:
    - GITHUB_TOKEN
    - SENDGRID_API_KEY