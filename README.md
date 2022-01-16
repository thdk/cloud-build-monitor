# CI Cloud CD (CICCD)

A tool to get an overiew of your different CI/CD workflows. Whether they run on some cloud platform or on premises.

## Features

- Send email notifications for failed / successful builds
- WIP: update status in issue tracker for failed / successful builds
- WIP: Configurable build overview

## Flow

![ciccd-flow](chart.png)

## CICCD Dashboard

The dashboard runs on nextjs and is deployed on Google App Engine.

See the [sample CICCD console](https://ciccd-console.ew.r.appspot.com/)

## Cloud functions

- [cloud-builds-sub-function](packages/cloud-builds-sub-function/README.md)
  
  optional: converts pub sub messages send by Google Cloud Build to CICCD messages

- [ciccd-builds-sub-function](packages/ciccd-builds-sub-function/README.md)

  required: handles CICCD pub sub messages to add build statuses to the dashboard database and sends notifications

## Available scripts

- `yarn build` Compiles typescript cloud functions to javascript so they can be deployed.

- `yarn deploy` Deploys cloud functions and nextjs app on GCP. 

    Make sure you have your default region for cloud functions set with: 

    `gcloud config set functions/region europe-west1`

