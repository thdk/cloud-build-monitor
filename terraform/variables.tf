variable "project" { }

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

