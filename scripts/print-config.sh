#!/usr/bin/env bash

gcloud secrets versions access latest --secret=ciccd-config | tee "./packages/ciccd-builds-sub-function/config.yaml"
gcloud secrets versions access latest --secret=ciccd-config | tee "./packages/cloud-builds-sub-function/config.yaml"

gcloud secrets versions access latest --secret=ciccd-firebase | tee "./packages/app/.env"