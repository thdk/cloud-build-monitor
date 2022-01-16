#!/usr/bin/env bash

export REGION="europe-west1"

export ICON="\U1F4E2"
export OK="  \U2705"
export NOK="  \U274C"

echo -e "${ICON} grant storage object viewer role to default cloudbuild service account"
export PROJECT_NUMBER=$(gcloud projects list --filter="$(gcloud config get-value project)" --format="value(PROJECT_NUMBER)" | tail -1)

gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member "serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role "roles/storage.objectViewer" \
  > /dev/null

echo -e "${ICON} set region globally to be used by cloud functions"
gcloud config set functions/region ${REGION} >/dev/null 2>/dev/null

echo -e "${ICON} enable required gcp api's"
gcloud services enable --project "${PROJECT_ID}" \
  secretmanager.googleapis.com \
  appengine.googleapis.com \
  cloudbuild.googleapis.com \
  iam.googleapis.com

