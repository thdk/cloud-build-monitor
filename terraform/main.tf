locals {
  target_service_account = "terraform@${var.project}.iam.gserviceaccount.com"
  cloud_build_topics = toset(var.cloud-build-projects)
  services = [
    "forward-service", 
    "ciccd-service",
  ]
  apps = [
    "app",
  ]
}

# Terraform backend

resource "google_storage_bucket" "terraform-state" {
  name          = "ciccd-terraform-state"
  force_destroy = false
  location      = "EU"
  storage_class = "STANDARD"
  versioning {
    enabled = true
  }
}

terraform {
 backend "gcs" {
   bucket  = "ciccd-terraform-state"
   prefix  = "terraform/state"
 }
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

# Add firebase to the project
resource "google_app_engine_application" "app" {
  project     = var.project
  location_id = var.location
  database_type = "CLOUD_FIRESTORE"
}

# Firestore indexes

resource "google_firestore_index" "builds-1" {
  project = var.project

  collection = "builds"
  query_scope = "COLLECTION"

  fields {
    field_path = "branch"
    order = "ASCENDING"
  }
  fields {
    field_path = "commitSha"
    order = "ASCENDING"
  }
  fields {
    field_path = "created"
    order = "DESCENDING"
  }
}

resource "google_firestore_index" "builds-3" {
  project = var.project

  collection = "builds"
  query_scope = "COLLECTION"

  fields {
    field_path = "branch"
    order = "ASCENDING"
  }
  fields {
    field_path = "created"
    order = "DESCENDING"
  }
}

resource "google_firestore_index" "builds-4" {
  project = var.project

  collection = "builds"
  query_scope = "COLLECTION"

  fields {
    field_path = "branchName"
    order = "ASCENDING"
  }
  fields {
    field_path = "created"
    order = "DESCENDING"
  }
}

resource "google_firestore_index" "builds-5" {
  project = var.project

  collection = "builds"
  query_scope = "COLLECTION"

  fields {
    field_path = "commitSha"
    order = "ASCENDING"
  }
  fields {
    field_path = "created"
    order = "DESCENDING"
  }
}

resource "google_firestore_index" "builds-6" {
  project = var.project

  collection = "builds"
  query_scope = "COLLECTION"

  fields {
    field_path = "githubRepoOwner"
    order = "ASCENDING"
  }
  fields {
    field_path = "repo"
    order = "ASCENDING"
  }
  fields {
    field_path = "created"
    order = "DESCENDING"
  }
}

# Enable required apis
resource "google_project_service" "services" {
  count              = length(var.gcp_service_list)
  project            = var.project
  service            = element(var.gcp_service_list, count.index)
  disable_on_destroy = false
}

# Global service accounts

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

resource "google_project_iam_member" "builder-token-creator" {
  project = var.project
  role    = "roles/iam.serviceAccountTokenCreator"
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

# Cloud run services

resource "google_cloud_run_service" "cloud-run-services" {
  for_each = toset(concat(local.services, local.apps))
  name     = each.key
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
      template[0].spec[0].containers[0].env,
    ]
  }

  depends_on = [
    google_project_service.services
  ]
}

### IAM

#### Allow global invoker service account to invoke the cloud run services
resource "google_cloud_run_service_iam_binding" "services-invoker-binding" {
  for_each = toset(local.services)
  location = google_cloud_run_service.cloud-run-services[each.key].location
  project = google_cloud_run_service.cloud-run-services[each.key].project
  service = google_cloud_run_service.cloud-run-services[each.key].name
  role = "roles/run.invoker"
  members = [
    "serviceAccount:${google_service_account.invoker.email}",
  ]
}

#### Create and configure runtime service account
resource "google_service_account" "run-service-accounts" {
  for_each = toset(concat(local.services, local.apps))
  account_id   = "${each.key}-runtime"
  display_name = each.key
  project = var.project
  description = "Service account which will get impersonated by the ${each.key}"
}

// Add roles to runtime service account for forward service
resource "google_project_iam_member" "cloudbuild-builds-viewer-forward-service" {
  project = var.project
  role    = "roles/cloudbuild.builds.viewer"
  member  = "serviceAccount:${google_service_account.run-service-accounts["forward-service"].email}"
}

resource "google_pubsub_topic_iam_member" "pubsub-publisher-forward-service" {
  project   = google_pubsub_topic.ciccd-builds.project
  topic     = google_pubsub_topic.ciccd-builds.name
  role      = "roles/pubsub.publisher"
  member    = "serviceAccount:${google_service_account.run-service-accounts["forward-service"].email}"
}

// Add roles to runtime service account for ciccd service
resource "google_project_iam_member" "firebase-admin-ciccd-service" {
  project = var.project
  role    = "roles/firebase.admin"
  member  = "serviceAccount:${google_service_account.run-service-accounts["ciccd-service"].email}"
}

# Pub sub

resource "google_pubsub_topic" "ciccd-builds" {
  name = "ciccd-builds"
}

## Allow pubsub to create authentication tokens
resource "google_project_iam_member" "pubsub-token-creator" {
  project = var.project
  role    = "roles/iam.serviceAccountTokenCreator"
  member = "serviceAccount:service-${data.google_project.current-project.number}@gcp-sa-pubsub.iam.gserviceaccount.com"
}

## push subscription for cloud-builds topic in listed gcp projects

resource "google_pubsub_subscription" "cloud-build" {
  for_each = local.cloud_build_topics
  name    = "cloud-builds-subscription-${each.key}"
  labels  = {}
  topic   = "projects/${each.key}/topics/cloud-builds"

  ack_deadline_seconds = 600
  push_config {
    push_endpoint = google_cloud_run_service.cloud-run-services["forward-service"].status[0].url
    oidc_token {
      service_account_email = google_service_account.invoker.email
    }
  }
}

resource "google_pubsub_subscription" "ciccd-build" {
  name    = "ciccd-builds-subscription"
  labels  = {}
  topic   = "ciccd-builds"

  ack_deadline_seconds        = 600
  enable_message_ordering     = true
  push_config {
    push_endpoint = google_cloud_run_service.cloud-run-services["ciccd-service"].status[0].url
    oidc_token {
      service_account_email = google_service_account.invoker.email
    }
  }
}

# Secret manager

resource "google_secret_manager_secret" "github-token" {
  secret_id = "github-token"
  labels      = {}
  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_version" "github-token-dummy" {
  secret = google_secret_manager_secret.github-token.id

  secret_data = "GITHUB_TOKEN" // must manually add new secret version outside terraform
}

resource "google_secret_manager_secret" "firebase-env" {
  secret_id = "firebase-env"
  labels      = {}
  replication {
    automatic = true
  }
}

// TODO: forward service doesnt use the github token secret, create separate deploy script for each service
// and remove this permission
resource "google_secret_manager_secret_iam_member" "forward-service-secret-accessor" {
  project = google_secret_manager_secret.github-token.project
  secret_id = google_secret_manager_secret.github-token.secret_id
  role = "roles/secretmanager.secretAccessor"
  member = "serviceAccount:${google_service_account.run-service-accounts["ciccd-service"].email}"
}

resource "google_secret_manager_secret_iam_member" "ciccd-service-secret-accessor" {
  project = google_secret_manager_secret.github-token.project
  secret_id = google_secret_manager_secret.github-token.secret_id
  role = "roles/secretmanager.secretAccessor"
  member = "serviceAccount:${google_service_account.run-service-accounts["forward-service"].email}"
}

resource "google_secret_manager_secret_iam_member" "app-github-token-secret-accessor" {
  project = google_secret_manager_secret.github-token.project
  secret_id = google_secret_manager_secret.github-token.secret_id
  role = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.builder.email}"
}

resource "google_secret_manager_secret_iam_member" "app-firebase-env-secret-accessor" {
  project = google_secret_manager_secret.firebase-env.project
  secret_id = google_secret_manager_secret.firebase-env.secret_id
  role = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_service_account.builder.email}"
}

resource "google_secret_manager_secret_iam_member" "app-runtime-github-token-secret-accessor" {
  project = google_secret_manager_secret.github-token.project
  secret_id = google_secret_manager_secret.github-token.secret_id
  role = "roles/secretmanager.secretAccessor"
  member = "serviceAccount:${google_service_account.run-service-accounts["app"].email}"
}

resource "google_secret_manager_secret_iam_member" "app-runtime-firebase-env-secret-accessor" {
  project = google_secret_manager_secret.firebase-env.project
  secret_id = google_secret_manager_secret.firebase-env.secret_id
  role = "roles/secretmanager.secretAccessor"
  member = "serviceAccount:${google_service_account.run-service-accounts["app"].email}"
}

# Cloud builds
resource "google_cloudbuild_trigger" "cloud-run-service-triggers" {
  for_each = toset(local.services)
  provider = google-beta
  name     = "${each.key}-trigger-deploy"

  project = var.project

  description = "build and deploy ${each.key} on cloud run"

  github {
    owner = var.repo_owner
    name  = var.repo_name
    push {
      branch = var.repo_branch_pattern
    }
  }

  included_files = ["packages/${each.key}/**"]

  service_account = "projects/${var.project}/serviceAccounts/${google_service_account.builder.email}"

  build {
    step {
      name = "gcr.io/cloud-builders/docker"
      entrypoint = "bash"
      args = [
        "-c",
        "docker build -t ${var.region}-docker.pkg.dev/${var.project}/docker-repository/${each.key}:$COMMIT_SHA -f packages/${each.key}/Dockerfile ."
        ]
    }

    step {
      name = "gcr.io/cloud-builders/docker"
      args = ["push", "${var.region}-docker.pkg.dev/${var.project}/docker-repository/${each.key}:$COMMIT_SHA"]
    }
    step {
      name       = "gcr.io/cloud-builders/gcloud"
      entrypoint = "gcloud"
      args = ["run",
        "deploy",
        google_cloud_run_service.cloud-run-services[each.key].name,
        "--image",
        "${var.region}-docker.pkg.dev/${var.project}/docker-repository/${each.key}:$COMMIT_SHA",
        "--region",
        var.region,
        "--set-env-vars",
        "HOSTNAME=${google_cloud_run_service.cloud-run-services[each.key].status[0].url},GCP_PROJECT=${var.project}",
        "--service-account",
        google_service_account.run-service-accounts[each.key].email,
        "--impersonate-service-account",
        google_service_account.builder.email,
        "--update-secrets",
        "GITHUB_TOKEN=${google_secret_manager_secret.github-token.secret_id}:latest"
      ]
    }
    artifacts {
      images = [
        "${var.region}-docker.pkg.dev/${var.project}/docker-repository/${each.key}:$COMMIT_SHA",
      ]
    }

    options {
      logging = "CLOUD_LOGGING_ONLY"
    }
  }
}

resource "google_cloudbuild_trigger" "app-triggers" {
  for_each = toset(local.apps)
  provider = google-beta
  name     = "${each.key}-trigger-deploy"

  project = var.project

  description = "build and deploy ${each.key} on cloud run"

  github {
    owner = var.repo_owner
    name  = var.repo_name
    push {
      branch = var.repo_branch_pattern
    }
  }

  included_files = ["packages/${each.key}/**"]

  service_account = "projects/${var.project}/serviceAccounts/${google_service_account.builder.email}"

  build {
    step {
      name = "gcr.io/cloud-builders/gcloud"
      entrypoint = "bash"
      args = [
        "-c",
        "gcloud secrets versions access latest --secret=firebase-env | tee ./packages/app/.env"
        ]
    }
    step {
      name = "gcr.io/cloud-builders/docker"
      entrypoint = "bash"
      args = [
        "-c",
        "docker build -t ${var.region}-docker.pkg.dev/${var.project}/docker-repository/${each.key}:$COMMIT_SHA -f packages/${each.key}/Dockerfile --build-arg=GITHUB_TOKEN=$$GITHUB_TOKEN --build-arg=REPO_REGEX=${var.repo_regex} ."
        ]
      secret_env = ["GITHUB_TOKEN"]
    }

    step {
      name = "gcr.io/cloud-builders/docker"
      args = ["push", "${var.region}-docker.pkg.dev/${var.project}/docker-repository/${each.key}:$COMMIT_SHA"]
    }
    step {
      name       = "gcr.io/cloud-builders/gcloud"
      entrypoint = "gcloud"
      args = ["run",
        "deploy",
        google_cloud_run_service.cloud-run-services[each.key].name,
        "--image",
        "${var.region}-docker.pkg.dev/${var.project}/docker-repository/${each.key}:$COMMIT_SHA",
        "--region",
        var.region,
        "--set-env-vars",
        "HOSTNAME=${google_cloud_run_service.cloud-run-services[each.key].status[0].url},GCP_PROJECT=${var.project}",
        "--service-account",
        google_service_account.run-service-accounts[each.key].email,
        "--impersonate-service-account",
        google_service_account.builder.email
      ]
    }
    artifacts {
      images = [
        "${var.region}-docker.pkg.dev/${var.project}/docker-repository/${each.key}:$COMMIT_SHA",
      ]
    }

    available_secrets {
      secret_manager {
        env          = "GITHUB_TOKEN"
        version_name = "projects/${var.project}/secrets/${google_secret_manager_secret.github-token.secret_id}/versions/latest"
      }
    }

    options {
      logging = "CLOUD_LOGGING_ONLY"
    }
    timeout = "900s"
  }
}
