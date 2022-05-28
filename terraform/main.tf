# Modules
module "forward-service" {
  source               = "./forward-service"
  depends_on = [
    module.ciccd-service
  ]
  cloud_build_projects = var.cloud_build_projects
  project              = var.project
  region               = var.region
  repo_branch_pattern  = var.repo_branch_pattern
  repo_owner           = var.repo_owner
  repo_name            = var.repo_name
}

module "ciccd-service" {
  source               = "./ciccd-service"
  project              = var.project
  region               = var.region
  repo_branch_pattern  = var.repo_branch_pattern
  repo_owner           = var.repo_owner
  repo_name            = var.repo_name
}

module "app" {
  source              = "./app"
  project             = var.project
  region              = var.region
  repo_branch_pattern = var.repo_branch_pattern
  repo_owner          = var.repo_owner
  repo_name           = var.repo_name
  repo_regex          = var.repo_regex
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
  project = var.project
  role    = "${each.key}"
  member  = "serviceAccount:${google_service_account.builder.email}"
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
  provider      = google-beta.impersonated
  project       = var.project
  location      = var.region
  repository_id = "docker-repository"
  description   = "docker repository"
  format        = "DOCKER"
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

# Secret manager

resource "google_secret_manager_secret" "github-token" {
  secret_id = "github-token"
  labels    = {}
  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret" "firebase-env" {
  secret_id = "firebase-env"
  labels    = {}
  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_iam_member" "forward-service-secret-accessor" {
  project   = google_secret_manager_secret.github-token.project
  secret_id = google_secret_manager_secret.github-token.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${module.ciccd-service.runtime_service_account}"
}

resource "google_secret_manager_secret_iam_member" "app-github-token-secret-accessor" {
  project   = google_secret_manager_secret.github-token.project
  secret_id = google_secret_manager_secret.github-token.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.builder.email}"
}

resource "google_secret_manager_secret_iam_member" "app-firebase-env-secret-accessor" {
  project   = google_secret_manager_secret.firebase-env.project
  secret_id = google_secret_manager_secret.firebase-env.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.builder.email}"
}

resource "google_secret_manager_secret_iam_member" "app-runtime-github-token-secret-accessor" {
  project   = google_secret_manager_secret.github-token.project
  secret_id = google_secret_manager_secret.github-token.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${module.app.runtime_service_account}"
  depends_on = [
    module.app
  ]
}

resource "google_secret_manager_secret_iam_member" "app-runtime-firebase-env-secret-accessor" {
  project   = google_secret_manager_secret.firebase-env.project
  secret_id = google_secret_manager_secret.firebase-env.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${module.app.runtime_service_account}"
  depends_on = [
    module.app
  ]
}
