# ciccd-builds-sub-function

Handles CICCD pub sub messages to add build statuses to the dashboard database and sends notifications.

## Pub sub message specifications

Pub sub messages sent to the `ciccd-builds` topic must/may have the following attributes:

 name            | required   | description 
-----------------|:----------:|-------------
branchName       |     x      |    
commitSha        |     x      |    
id               |     x      | A unique identifier of the build, used to set status updates for the same build
finishTime       |            | Time in seconds since 1/1/1970
githubRepoOwner  |     x      | Owner of repo
logUrl           |            |
name             |     x      | The name of the trigger/pipeline
origin           |     x      | The original CI/CD platform which triggerd the build event. Ex. 'google-cloud' or 'gocd'
repo             |     x      | The name of the github repo
startTime        |            | Time in seconds since 1/1/1970   
status           |     x      | [success, failure, cancelled, queued]

## Setup the service

- create a `ciccd-builds` topic and add a subscription
    ```sh
    gcloud pubsub topics create ciccd-builds
    gcloud pubsub subscriptions create ciccd-builds-sub --topic ciccd-builds
    ```
- create a `config.yaml` file containing the following keys:
  
    GCP_PROJECT: ""

    SENDGRID_TEMPLATE_PREVIEW_BUILD_STATUS: ""

    SENDGRID_SENDER: ""

    ISSUE_REGEX: ""

    GITHUB_REPO: ""

    GITHUB_OWNER: ""

    - make the `config.yaml` file available as 'ciccd-config' secret in Cloud Secret Manager
  
- provide the following environment variables using Google Cloud Secret Manager:
    - GITHUB_TOKEN
    - SENDGRID_API_KEY