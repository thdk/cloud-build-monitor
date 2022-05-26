variable "project" { }

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
  description ="The list of apis necessary for the project"
  type = list(string)
  default = [
    "storage.googleapis.com",
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
  ]
}

# Cloud run forward service
variable "repo_owner" {}

variable "repo_name" {}

variable "repo_branch_pattern" {}

# list all gcp projects from which cloud-build pub sub messages should and can be handled
variable "cloud-build-projects" {
    type    = list(string)
    default =  [
      "cloud-builds",
    ]
}

# App

variable "repo_regex" {
  default = ".*"
}