#!/bin/bash

gcloud secrets versions access 1 --secret=ciccd-config | tee "./packages/ciccd-builds-sub-function/config.yaml"
gcloud secrets versions access 1 --secret=ciccd-config | tee "./packages/cloud-builds-sub-function/config.yaml"