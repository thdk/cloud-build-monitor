locals {
  target_service_account = "terraform@${var.project}.iam.gserviceaccount.com"
}

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
resource "google_cloud_run_service" "forward-service" {
  name     = "forward-service"
  location = var.region
  project  = var.project

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

  build {
    step {
      name = "gcr.io/cloud-builders/docker"
      args = [
        "build",
        "-t",
        "${var.region}.pkg.dev/${var.project}/forward-service:$COMMIT_SHA",
        "-f",
        "packages/forward-service/Dockerfile",
        "."
        ]
    }
    step {
      name = "gcr.io/cloud-builders/docker"
      args = ["push", "${var.region}.pkg.dev/${var.project}/forward-service:$COMMIT_SHA"]
    }
    step {
      name       = "gcr.io/cloud-builders/gcloud"
      entrypoint = "gcloud"
      args = ["run",
        "deploy",
        google_cloud_run_service.forward-service.name,
        "--image",
        "${var.region}.pgk.dev/${var.project}/forward-service:$COMMIT_SHA",
        "--region",
        var.region,
        "--update-env-vars",
        "HOSTNAME=${google_cloud_run_service.forward-service.status[0].url}"
      ]
    }
    artifacts {
      images = ["${var.region}.pkg.dev/${var.project}/forward-service:$COMMIT_SHA"]
    }
  }
}