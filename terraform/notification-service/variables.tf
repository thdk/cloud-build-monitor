variable "project" {}

variable "region" {
  default = "us-central1"
}

variable "repo_owner" {}

variable "repo_name" {}

variable "repo_branch_pattern" {}

variable "service_account_builder" {
  type = object({
    name  = string
    email = string
  })
  description = "Service account that will be used by google cloud build to build and deploy ciccd service"
}

variable "service_account_invoker" {
  type = object({
    name  = string
    email = string
  })
  description = "Service account that will be used by pub sub to invoke the service"
}

output "runtime_service_account" {
  value = google_service_account.run-service-account.email
}
