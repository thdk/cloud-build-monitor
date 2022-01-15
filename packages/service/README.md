# Google Cloud Build Monitor Service

When a cloud build is finished, this service can be triggered to collect additional data for the specific build.
Once the required data is collected, it notifies the people who might be interested in getting updates for this build.

## Requirements

- enable pub sub api and create a topic `cloud-builds`
- have a [sendgrid](https://sendgrid.com/) api key and save it in `.env.yaml` file
- create dynamic email templates in sendgrid (TODO: add email templates samples to this repo)


## Deploy

Make sure to build the source code before deploying to guarantee you are deploying the latest version.

```sh
npm run build
```

The service is run as a cloud function. To deploy it run:

```sh
gcloud functions deploy \
    --runtime nodejs14 \
    --trigger-topic cloud-builds \
    --entry-point cloudBuildEvents \
    gcb-monitor-service \
    --ignore-file=.gcloudignore-deploy
```

Note that the above deploy script requires a cloud region to be specified.
You can set the default region with the following command:

```sh
gcloud config set functions/region europe-west1
```

or add `--region=europe-west1` to the deploy script.