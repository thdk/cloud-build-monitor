# Terraform instructions

## Initial setup

1. Create a new gcp project
2. Create a service account: terraform@PROJECT_ID.iam.gserviceaccount.com
3. You must have the Service Account Access Token Creator role (even if you are owner)
4. Add `terraform.tfvars` file with following content to this folder:

Example:
```
project = "ciccd-console"
region = "europe-west1"
zone = "europe-west1-c"
location = "europe-west"

cloud_build_projects = [
    "ciccd-console",
    "scrum-poker-31315",
    "team-timesheets",
]

repo_branch_pattern = ".*"
repo_name = "cloud-build-monitor"
repo_owner = "thdk"
```

Note: each project listed in `cloud_build_projects` must have a `cloud-builds` topic.

If this topic does not exists already, you must manually create it for your project.

## Init, Plan & Apply

```
terraform init
terraform plan
terraform apply
```