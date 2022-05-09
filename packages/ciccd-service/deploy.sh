#!/usr/bin/env bash

gcloud config set functions/region europe-west1

gcloud beta functions deploy ciccd-service \
    --runtime nodejs16 \
    --trigger-topic ciccd-builds \
    --entry-point ciccdBuildEvents \
    --set-secrets 'GITHUB_TOKEN=GITHUB_TOKEN:latest,FIREBASE_ADMIN=ciccd-firebase-admin:latest'