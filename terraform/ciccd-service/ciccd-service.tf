# Service accounts

data "google_service_account" "builder" {
  account_id = "builder"
}

data "google_service_account" "invoker" {
  account_id = "invoker"
}

resource "google_service_account" "run-service-account" {
  account_id   = "ciccd-service-runtime"
  display_name = "ciccd-service"
  project      = var.project
  description  = "Service account which will get impersonated by the ciccd service"
}

# Cloud run services

resource "google_cloud_run_service" "ciccd-service" {
  name     = "ciccd-service"
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

  #   depends_on = [
  #     google_project_service.services
  #   ]
}

# IAM
resource "google_cloud_run_service_iam_binding" "service-invoker-binding" {
  location = google_cloud_run_service.ciccd-service.location
  project  = google_cloud_run_service.ciccd-service.project
  service  = google_cloud_run_service.ciccd-service.name
  role     = "roles/run.invoker"
  members = [
    "serviceAccount:${data.google_service_account.invoker.email}",
  ]
}

// Add roles to runtime service account for ciccd service
resource "google_project_iam_member" "firebase-admin-ciccd-service" {
  project = var.project
  role    = "roles/firebase.admin"
  member  = "serviceAccount:${google_service_account.run-service-account.email}"
}

# Pub sub

resource "google_pubsub_topic" "ciccd-builds" {
  name = "ciccd-builds"
}

resource "google_pubsub_subscription" "ciccd-build" {
  name   = "ciccd-builds-subscription"
  labels = {}
  topic  = "ciccd-builds"

  ack_deadline_seconds    = 600
  enable_message_ordering = true
  push_config {
    push_endpoint = google_cloud_run_service.ciccd-service.status[0].url
    oidc_token {
      service_account_email = data.google_service_account.invoker.email
    }
  }
}
