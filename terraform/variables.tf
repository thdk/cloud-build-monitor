variable "project" {}

variable "location" {
  default = "us-central"
}
variable "region" {
  default = "us-central1"
}

variable "zone" {
  default = "us-central1-c"
}
variable "gcp_service_list" {
  description = "The list of apis necessary for the project"
  type        = list(string)
  default = [
    "storage.googleapis.com",
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
    "secretmanager.googleapis.com",
    "firestore.googleapis.com",
    "cloudbuild.googleapis.com",
    "iam.googleapis.com",
    "iap.googleapis.com",
    "firebase.googleapis.com",
  ]
}

# Cloud run forward service
variable "repo_owner" {}

variable "repo_name" {}

variable "repo_branch_pattern" {}

# list all gcp projects from which cloud-build pub sub messages should and can be handled
variable "cloud_build_projects" {
  type = list(string)
  default = [
    "cloud-builds",
  ]
}

# App

variable "app_engine_service" {
  type        = string
  description = "Your first app engine service must be named 'default'. Choose another name if you have already an app engine service deployed with that name."
  default     = "default"
}

variable "repo_regex" {
  default = ".*"
}

variable "issue_regex" {
  description = "[A-Z][A-Z0-9]+-[0-9]+1"
  type = string
  default = ""
}

variable "jira_host" {
  type = string
  default = ""
}

variable "use_app_engine" {
  type = bool
  default = true
}