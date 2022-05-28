variable "project" {}

variable "region" {
  default = "us-central1"
}

variable "repo_owner" {}

variable "repo_name" {}

variable "repo_branch_pattern" {}

output "runtime_service_account" {
  value = google_service_account.run-service-account.email
}
