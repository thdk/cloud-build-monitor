# ciccd-builds-sub-function

Handles CICCD pub sub messages to add build statuses to the dashboard database and sends notifications.

## Requirements

- create a `ciccd-builds` topic and add a subscription
    ```sh
    gcloud pubsub topics create ciccd-builds
    gcloud pubsub subscriptions create ciccd-builds-sub --topic ciccd-builds
    ```
- create a `config.yaml` file containing the following keys:
  - SENDGRID_API_KEY: [sendgrid](https://sendgrid.com/)
  - SENDGRID_TEMPLATE_PREVIEW_BUILD_STATUS: the id of the sendgrid dynamic template you wish to send with build updates
    - TODO: add example templates to the repo
- make the `config.yaml` file available in a mounted volume using Cloud Secret Manager