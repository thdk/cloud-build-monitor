# CI Cloud CD (CICCD)

A tool to get an overiew of your different CI/CD workflows. Whether they run on some cloud platform or on premises.

## Features

- Send email notifications for failed / successful builds
- Update status in issue tracker for failed / successful builds
- Configurable build dashboard listing builds of any provider
- Git repo page showing commits related to your builds

## Flow

![ciccd-flow](chart.png)

## CICCD Dashboard

The dashboard runs on nextjs and is deployed on Google App Engine.

See the [sample CICCD console](https://ciccd-console.ew.r.appspot.com/)

## Services (cloud run)

- [ciccd-service](packages/ciccd-service/README.md)

  required: handles CICCD pub sub messages to add build statuses to the dashboard database

- [forward-service](packages/forward-service/README.md)
  
  optional: converts 'cloud-builds' pub sub messages send by Google Cloud Build to CICCD messages

- [report-service](packages/ciccd-service/README.md)

  optional: sends build report emails when configured and adds commit status checks to github


## Available scripts

- `yarn build` Compiles typescript cloud functions to javascript so they can be deployed.

- `yarn deploy` Deploys cloud functions and nextjs app on GCP. 

    Make sure you have your default region for cloud functions set with: 

    `gcloud config set functions/region europe-west1`

## Setup

This section will describe the require actions to setup everything in a new GCP project.

## Requirements

- GCP Project with billing enabled
- A firebase project (Cannot be the same as your GCP project if you already use datastore in that GCP project)
- An active app engine application in your GCP project `gcloud app create`
- Already have a 'default' app service running on app engine
- A fork (recommended) or clone of this repo

### Enable apis and setup service account roles

Please review `scripts/setup.sh` before running this script so you are aware of which service accounts are used
and what extra roles they will be assigned.

```
PROJECT_ID=[gcp-project-id] ./scripts/setup.sh
```

### Add your projects secrets in Google Secret Manager

Create a directory outside of this repository and add the following files contains your project secrets:

`GITHUB_TOKEN.txt`

`SENDGRID_API_KEY.txt`

`firebase-admin.json` contains your firebase project service account

`next.env` contains client information of the firebase projects

```sh
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_GITHUB_TOKEN=
NEXT_PUBLIC_REPO_REGEX=
```

`config.yaml` contains the following:

```yaml
base:
  GCP_PROJECT: ""
  SENDGRID_TEMPLATE_PREVIEW_BUILD_STATUS: ""
  SENDGRID_SENDER: ""
  ISSUE_REGEX: ""
  GITHUB_REPO: ""
  GITHUB_OWNER: ""

development:
  ~compose: [base]

production:
  ~compose: [base]
```


Now run the following script to upload these secrets in Google Secret Manager
```sh
./scripts/create-secrets /path/to/your/secret/folder

```

Now **delete** these files. They are stored safely in Google Secret Manager.

### Deploy

A `cloudbuild-deploy.yaml` file is provided in this repo which can be used to deploy the required cloud functions
and deploy the CICCD console on app engine using `ciccd-console` as name.

#### Continuous deployment

You can setup a CI/CD pipeline on Google Cloud Build to automatically deploy new versions pushed to the github repo.

Before you can run the script you must [have connected your gitub repo](https://console.cloud.google.com/cloud-build/repos).

```sh
  ./scripts/setup-deploy [github-repo-owner] [github-repo-name]
```

#### Manual deploy with cloud build

```sh
gcloud builds submit --config=cloudbuild-deploy.yaml
```