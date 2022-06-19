variable "project" {
  type = string
}

variable "region" {
  default = "us-central1"
}

variable "app_engine_service" {
  type        = string
  description = "Your first app engine service must be named 'default'. Choose another name if you have already an app engine service deployed with that name."
  default     = "default"
}

# list all gcp projects from which cloud-build pub sub messages should and can be handled
variable "cloud-build-projects" {
  type = list(string)
  default = [
    "cloud-builds",
  ]
}

variable "repo_owner" {}

variable "repo_name" {}

variable "repo_branch_pattern" {}

output "runtime_service_account" {
  value = google_service_account.run-service-account.email
}

variable "repo_regex" {
  default = ".*"
}

variable "issue_regex" {
  type    = string
  default = ""
}

variable "jira_host" {
  type    = string
  default = ""
}

variable "use_app_engine" {
  type        = bool
  default     = true
  description = "By default we deploy the app on app engine. If set to false the app will be deployed as a cloud run service."
}
