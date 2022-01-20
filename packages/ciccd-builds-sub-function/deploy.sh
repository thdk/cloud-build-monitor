#!/usr/bin/env bash

gcloud beta functions deploy ciccd-service \
    --runtime nodejs16 \
    --trigger-topic ciccd-builds \
    --entry-point ciccdBuildEvents \


# --service-account=    
# --set-secrets='GITHUB_TOKEN=GITHUB_TOKEN:latest,SENDGRID_API_KEY=SENDGRID_API_KEY:latest,FIREBASE_ADMIN=ciccd-firebase-admin:latest'