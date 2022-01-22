#! /usr/bin/env bash

gcloud secrets create GITHUB_TOKEN
gcloud secrets versions add GITHUB_TOKEN --data-file="${1}/GITHUB_TOKEN.txt"

gcloud secrets create SENDGRID_API_KEY
gcloud secrets versions add SENDGRID_API_KEY --data-file="${1}/SENDGRID_API_KEY.txt"

gcloud secrets create ciccd-firebase-admin
gcloud secrets versions add ciccd-firebase-admin --data-file="${1}/firebase-admin.json"

gcloud secrets create ciccd-config
gcloud secrets versions add ciccd-config --data-file="${1}/config.yaml"

gcloud secrets create ciccd-firebase
gcloud secrets versions add ciccd-firebase --data-file="${1}/firebase.env"
