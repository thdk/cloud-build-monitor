variable "project" {
  type = string
}

variable "region" {
  default = "us-central1"
}

# list all gcp projects from which cloud-build pub sub messages should and can be handled
variable "cloud-build-projects" {
  type = list(string)
  default = [
    "cloud-builds",
  ]
}

variable "allowed_http_viewers" {
  type = list(string)
  default = []
  description = "List users (user:name@example.com), groups (group:viewers@example.com) or add 'allUsers' if you either want to allow public access or if you are using an external load balancer with IAP."
}

variable "repo_owner" {}

variable "repo_name" {}

variable "repo_branch_pattern" {}

variable "service_account_builder" {
  type = object({
    name      = string
    email  = string
  })
  description = "Service account that will be used by google cloud build to build and deploy app" 
}

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
