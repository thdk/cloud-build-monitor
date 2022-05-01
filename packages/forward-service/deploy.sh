#!/usr/bin/env bash

gcloud config set functions/region europe-west1

gcloud functions deploy ciccd-proxy \
    --runtime nodejs16  \
    --trigger-topic cloud-builds \
    --entry-point cloudBuildEvents
