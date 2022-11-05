# Modules
module "forward-service" {
  source = "./forward-service"
  depends_on = [
    module.ciccd-service,
    google_project_service.services,
    google_artifact_registry_repository.docker-repo,
  ]

  cloud_build_projects = var.cloud_build_projects
  project              = var.project
  region               = var.region
  repo_branch_pattern  = var.repo_branch_pattern
  repo_owner           = var.repo_owner
  repo_name            = var.repo_name
  service_account_builder = {
    email = google_service_account.builder.email
    name  = google_service_account.builder.name
  }
  service_account_invoker = {
    email = google_service_account.invoker.email
    name  = google_service_account.invoker.name
  }
}

module "ciccd-service" {
  source              = "./ciccd-service"
  project             = var.project
  region              = var.region
  repo_branch_pattern = var.repo_branch_pattern
  repo_owner          = var.repo_owner
  repo_name           = var.repo_name
  service_account_builder = {
    email = google_service_account.builder.email
    name  = google_service_account.builder.name
  }
  service_account_invoker = {
    email = google_service_account.invoker.email
    name  = google_service_account.invoker.name
  }

  depends_on = [
    google_project_service.services,
    google_artifact_registry_repository.docker-repo,
    google_secret_manager_secret.secrets,
  ]
}

module "app" {
  source              = "./app"
  project             = var.project
  region              = var.region
  repo_branch_pattern = var.repo_branch_pattern
  repo_owner          = var.repo_owner
  repo_name           = var.repo_name
  repo_regex          = var.repo_regex
  issue_regex         = var.issue_regex
  jira_host           = var.jira_host
  service_account_builder = {
    email = google_service_account.builder.email
    name  = google_service_account.builder.name
  }

  depends_on = [
    module.ciccd-service,
    google_project_service.services,
    google_artifact_registry_repository.docker-repo,
  ]
}

#-----------------------------------------------#

locals {
  target_service_account = "terraform@${var.project}.iam.gserviceaccount.com"
  services = [
    "ciccd-service",
    "forward-service",
  ]
  builder_roles = [
    "roles/run.admin",
    "roles/logging.logWriter",
    "roles/artifactregistry.writer",
    "roles/iam.serviceAccountUser",
    "roles/iam.serviceAccountTokenCreator",
    "roles/appengine.deployer",
    "roles/storage.admin",
    "roles/cloudbuild.builds.editor",
    "roles/appengine.serviceAdmin"
  ]
}

#-----------------------------------------------#

# expose the current project config (https://stackoverflow.com/questions/63824928/how-can-we-add-project-number-from-variable-in-terraform-gcp-resource-iam-bindin)
data "google_project" "current-project" {}


#-----------------------------------------------#

# Enable required apis
resource "google_project_service" "services" {
  count              = length(var.gcp_service_list)
  project            = var.project
  service            = element(var.gcp_service_list, count.index)
  disable_on_destroy = false
}

#-----------------------------------------------#

# Global service accounts

## Builder
resource "google_service_account" "builder" {
  account_id   = "builder"
  display_name = "builder"
  project      = var.project
  description  = "Service account used for cloud builds (including deploy permissions)"
}

resource "google_project_iam_member" "run-admin" {
  for_each = toset(local.builder_roles)
  project  = var.project
  role     = each.key
  member   = "serviceAccount:${google_service_account.builder.email}"
}

## Invoker

resource "google_service_account" "invoker" {
  account_id   = "invoker"
  display_name = "invoker"
  project      = var.project
  description  = "Service account used to invoke cloud run services"
}

# Artifact registry
resource "google_artifact_registry_repository" "docker-repo" {
  provider      = google-beta
  project       = var.project
  location      = var.region
  repository_id = "docker-repository"
  description   = "docker repository"
  format        = "DOCKER"

  depends_on = [
    google_project_service.services
  ]
}

#-----------------------------------------------#

# Pub sub

## Allow pubsub to create authentication tokens
resource "google_project_iam_member" "pubsub-token-creator" {
  project = var.project
  role    = "roles/iam.serviceAccountTokenCreator"
  member  = "serviceAccount:service-${data.google_project.current-project.number}@gcp-sa-pubsub.iam.gserviceaccount.com"
}

#-----------------------------------------------#

