#!/usr/bin/env bash

export REGION="europe-west1"

export ICON="\U1F4E2"
export OK="  \U2705"
export NOK="  \U274C"

echo -e "${ICON} enable required gcp api's"
gcloud services enable --project "${PROJECT_ID}" \
  iap.googleapis.com
