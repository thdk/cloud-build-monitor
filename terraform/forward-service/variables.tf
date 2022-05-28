variable "project" {}

variable "region" {
  default = "us-central1"
}

# list all gcp projects from which cloud-build pub sub messages should and can be handled
variable "cloud_build_projects" {
  type = list(string)
}

variable "repo_owner" {}

variable "repo_name" {}

variable "repo_branch_pattern" {}

output "runtime_service_account" {
  value = google_service_account.run-service-account.email
}
