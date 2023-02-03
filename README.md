# CI Cloud CD (CICCD)

A tool to get an overview of your different CI/CD workflows. Whether they run on some cloud platform or on premises.

Demo application with my own gcp-projects and github repos: [https://app-crtmi2bbra-ew.a.run.app/](https://app-crtmi2bbra-ew.a.run.app/)

## Features

- Send email notifications for failed / successful builds
- Update status in issue tracker for failed / successful builds
- Configurable build dashboard listing builds of any provider
- Git repo page showing commits related to your builds

## Flow

![ciccd-flow](chart.png)

## CICCD Dashboard

The dashboard runs on nextjs and is deployed on Google Cloud Run.

See the [sample CICCD console](https://ciccd-console.ew.r.appspot.com/)

## Services (cloud run)

- [ciccd-service](packages/ciccd-service/README.md)

  required: handles CICCD pub sub messages to add build statuses to the dashboard database

- [forward-service](packages/forward-service/README.md)
  
  optional: converts 'cloud-builds' pub sub messages sent by Google Cloud Build to CICCD messages

- [report-service](packages/ciccd-service/README.md)

  optional: sends build report emails when configured and adds commit status checks to github


## Setup

See [the documentation](./docs/iac-terraform.md) on how to setup a new google cloud project with all required infrastructure for running ciccd console.

## Run locally

You can run everything locally by creating a `.env` file in your root containing the following:

```env
GITHUB_TOKEN=xxxxxxx
GCP_PROJECT=xxxxxxx
```

You must be authenticated with gcloud using `gcloud auth application-default login` so
that your credentials can be mounted as a volume in the docker containers.

Then run `docker compose up --build`

| service | url           |
| ----------| -----          |
| app | http://localhost:3000 |
| notification service | http://localhost:8081 |
| ciccd service | http://localhost:8080 |