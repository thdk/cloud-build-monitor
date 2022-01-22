#!/usr/bin/env bash

gcloud beta builds triggers create github \
    --repo-owner="$1" \
    --repo-name="$2" \
    --build-config="cloudbuild-deploy.yaml" \
    --branch-pattern="main" \
    --name="ciccd-deploy"