locals {
  target_service_account = "terraform@${var.project}.iam.gserviceaccount.com"
}

# expose the current project config (https://stackoverflow.com/questions/63824928/how-can-we-add-project-number-from-variable-in-terraform-gcp-resource-iam-bindin)
data "google_project" "current-project" {}

# Default providers
provider "google" {
  project     = var.project
  region      = var.region
  zone        = var.zone
}

provider "google-beta" {
  project     = var.project
  region      = var.region
  zone        = var.zone
}

# Impersonated providers
data "google_service_account_access_token" "default" {
  provider               = google
  target_service_account = local.target_service_account
  scopes                 = ["userinfo-email", "cloud-platform"]
  lifetime               = "3600s"
}

provider "google" {
  alias        = "impersonated"
  access_token = data.google_service_account_access_token.default.access_token
}

provider "google-beta" {
  alias        = "impersonated"
  access_token = data.google_service_account_access_token.default.access_token
}

# Enable required apis
resource "google_project_service" "services" {
  count              = length(var.gcp_service_list)
  project            = var.project
  service            = element(var.gcp_service_list, count.index)
  disable_on_destroy = false
}

# Service accounts

## Builder
resource "google_service_account" "builder" {
  account_id   = "builder"
  display_name = "builder"
  project = var.project
  description = "Service account used for cloud builds (including deploy permissions)"
}

resource "google_project_iam_member" "run-admin" {
  project = var.project
  role    = "roles/run.admin"
  member  = "serviceAccount:${google_service_account.builder.email}"
}

resource "google_project_iam_member" "logging-logWriter" {
  project = var.project
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.builder.email}"
}

resource "google_project_iam_member" "artifactregistry-writer" {
  project = var.project
  role    = "roles/artifactregistry.writer"
  member  = "serviceAccount:${google_service_account.builder.email}"
}

resource "google_project_iam_member" "iam-serviceAccountUser" {
  project = var.project
  role    = "roles/iam.serviceAccountUser"
  member  = "serviceAccount:${google_service_account.builder.email}"
}

## Invoker

resource "google_service_account" "invoker" {
  account_id   = "invoker"
  display_name = "invoker"
  project = var.project
  description = "Service account used to invoke cloud run services"
}

# Artifact registry
resource "google_artifact_registry_repository" "docker-repo" {
  provider = google-beta.impersonated
  project = var.project
  location      = var.region
  repository_id = "docker-repository"
  description   = "docker repository"
  format        = "DOCKER"
}

# Cloud run service

## forward-service

resource "google_cloud_run_service" "forward-service" {
  name     = "forward-service"
  location = var.region
  project  = var.project
  
  autogenerate_revision_name = true

  template {
    spec {
      containers {
        image = "us-docker.pkg.dev/cloudrun/container/hello"
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  lifecycle {
    ignore_changes = [
      template[0].spec[0].containers[0].image,
    ]
  }

  depends_on = [
    google_project_service.services
  ]
}

resource "google_cloud_run_service_iam_binding" "forward-service-invoker-binding" {
  location = google_cloud_run_service.forward-service.location
  project = google_cloud_run_service.forward-service.project
  service = google_cloud_run_service.forward-service.name
  role = "roles/run.invoker"
  members = [
    "serviceAccount:${google_service_account.invoker.email}",
  ]
}

# Pub sub

## Allow pubsub to create authentication tokens
resource "google_project_iam_member" "pubsub-token-creator" {
  project = var.project
  role    = "roles/iam.serviceAccountTokenCreator"
  member = "serviceAccount:service-${data.google_project.current-project.number}@gcp-sa-pubsub.iam.gserviceaccount.com"
}

## push subscription for cloud-builds topic

resource "google_pubsub_subscription" "cloud-build" {
  name    = "cloud-build-subscription"
  labels  = {}
  topic   = "cloud-builds"

  ack_deadline_seconds = 600
  push_config {
    push_endpoint = google_cloud_run_service.forward-service.status[0].url
    oidc_token {
      service_account_email = google_service_account.invoker.email
    }
  }
}

# Cloud builds
resource "google_cloudbuild_trigger" "forward-service-trigger" {

  provider = google-beta
  name     = "forward-service-trigger-deploy"

  project = var.project

  description = "build and deploy forward-service on cloud run"

  github {
    owner = var.repo_owner
    name  = var.repo_name
    push {
      branch = var.repo_branch_pattern
    }
  }

  included_files = ["packages/forward-service/**"]

  service_account = "projects/${var.project}/serviceAccounts/${google_service_account.builder.email}"

  build {
    step {
      name = "gcr.io/cloud-builders/docker"
      args = [
        "build",
        "-t",
        "${var.region}-docker.pkg.dev/${var.project}/docker-repository/forward-service:$COMMIT_SHA",
        "-f",
        "packages/forward-service/Dockerfile",
        "."
        ]
    }
    step {
      name = "gcr.io/cloud-builders/gcloud"
      args = [
        "auth",
        "configure-docker",
        "${var.region}-docker.pkg.dev"
      ]
    }
    step {
      name = "gcr.io/cloud-builders/docker"
      args = ["push", "${var.region}-docker.pkg.dev/${var.project}/docker-repository/forward-service:$COMMIT_SHA"]
    }
    step {
      name       = "gcr.io/cloud-builders/gcloud"
      entrypoint = "gcloud"
      args = ["run",
        "deploy",
        google_cloud_run_service.forward-service.name,
        "--image",
        "${var.region}-docker.pkg.dev/${var.project}/docker-repository/forward-service:$COMMIT_SHA",
        "--region",
        var.region,
        "--update-env-vars",
        "HOSTNAME=${google_cloud_run_service.forward-service.status[0].url},GCP_PROJECT=${var.project}",
        "--service-account",
        google_service_account.builder.email
      ]
    }
    artifacts {
      images = ["${var.region}-docker.pkg.dev/${var.project}/docker-repository/forward-service:$COMMIT_SHA"]
    }

    options {
      logging = "CLOUD_LOGGING_ONLY"
    }
  }
}