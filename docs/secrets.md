# CICD: secrets

## Create secrets in Google Secret Manager

```sh
gcloud secrets create GITHUB_TOKEN
gcloud secrets create SENDGRID_API_KEY
gcloud secrets create ciccd-firebase-admin
```

## Add values to your secrets in Google Secret Manager
Now add your secret values to separate files. You'll need the following files:

`GITHUB_TOKEN.txt`

`SENDGRID_API_KEY.txt`

`firebase-admin.json` contains your firebase service account


```sh
gcloud secrets versions add GITHUB_TOKEN --data-file="GITHUB_TOKEN.txt"
gcloud secrets versions add SENDGRID_API_KEY --data-file="SENDGRID_API_KEY.txt"
gcloud secrets versions add ciccd-firebase-admin --data-file="firebase-admin.json"
```

Now **delete** these files. They are stored safely in Google Secret Manager.


## Official Google documentation 

[Using secrets in cloud functions](https://cloud.google.com/functions/docs/configuring/secrets)
[Creating secrets with secret manager](https://cloud.google.com/secret-manager/docs/creating-and-accessing-secrets)