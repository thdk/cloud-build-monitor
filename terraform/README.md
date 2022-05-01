# Terraform instructions

## Initial setup

1. Create a new gcp project
2. Create a service account: terraform@PROJECT_ID.iam.gserviceaccount.com
3. You must have the Service Account Access Token Creator role (even if you are owner)
4. Add `terraform.tfvars` file with following content to this folder:

Example:
```
project = "YOUR PROJECT ID"
region = "europe-west1"
zone = "europe-west1-c"
```

## Plan & Apply

```
terraform plan
terraform apply
```