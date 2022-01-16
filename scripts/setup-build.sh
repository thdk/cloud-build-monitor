#!/usr/bin/env bash

serviceAccount="ciccd-builder@${PROJECT_ID}.iam.gserviceaccount.com"

echo -e "${ICON} create a service account to be used by cloud builds"
gcloud iam service-accounts create ciccd-builder \
    --display-name="ciccd-builder"

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:$serviceAccount" \
    --role="roles/secretmanager.secretAccessor"

echo -e "${ICON} create build logs bucket"
gcloud logging buckets create ciccd-build-logs --location=${REGION}

echo -e "${ICON} allow service account to write to logs bucket"
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:$serviceAccount" \
    --role="roles/logging.bucketWriter"

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:$serviceAccount" \
    --role="roles/storage.objectAdmin"   

# NOTE: this step requires you have forked the original repo
# Your github repo must be connected with Google Source Repositories: https://console.cloud.google.com/cloud-build/repos
echo -e "create cloud build triggers"
gcloud beta builds triggers create github \
    --repo-name="cloud-build-monitor" \
    --repo-owner="${REPO_OWNER}" \
    --build-config="cloudbuild.yaml" \
    --branch-pattern=".*" \
    --service-account="projects/${PROJECT_ID}/serviceAccounts/${serviceAccount}" \
    --name="ci-build"

gcloud beta builds triggers create github \
    --repo-name="cloud-build-monitor" \
    --repo-owner="${REPO_OWNER}" \
    --build-config="cloudbuild-deploy.yaml" \
    --branch-pattern="master" \
    --service-account="projects/${PROJECT_ID}/serviceAccounts/${serviceAccount}" \
    --name="deploy"