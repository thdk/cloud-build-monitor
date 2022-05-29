# Service accounts

data "google_service_account" "builder" {
  account_id = "builder"
}

data "google_service_account" "invoker" {
  account_id = "invoker"
}

resource "google_service_account" "run-service-account" {
  account_id   = "forward-service-runtime"
  display_name = "forward-service"
  project      = var.project
  description  = "Service account which will get impersonated by the forward service"
}

// Add roles to runtime service account for forward service
resource "google_project_iam_member" "cloudbuild-builds-viewer-forward-service" {
  project = var.project
  role    = "roles/cloudbuild.builds.viewer"
  member  = "serviceAccount:${google_service_account.run-service-account.email}"
}

resource "google_pubsub_topic_iam_member" "pubsub-publisher-forward-service" {
  project = var.project
  topic   = "ciccd-builds"
  role    = "roles/pubsub.publisher"
  member  = "serviceAccount:${google_service_account.run-service-account.email}"
}

# Cloud run services

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
      template[0].spec[0].containers[0].env,
    ]
  }

  #   depends_on = [
  #     google_project_service.services
  #   ]
}

# Allow global invoker service account to invoke the cloud run service
resource "google_cloud_run_service_iam_binding" "service-invoker-binding" {
  location = google_cloud_run_service.forward-service.location
  project  = google_cloud_run_service.forward-service.project
  service  = google_cloud_run_service.forward-service.name
  role     = "roles/run.invoker"
  members = [
    "serviceAccount:${data.google_service_account.invoker.email}",
  ]
}


# Pub sub

## push subscription for cloud-builds topic in listed gcp projects

resource "google_pubsub_subscription" "cloud-build" {
  for_each = toset(var.cloud_build_projects)
  name     = "cloud-builds-subscription-${each.key}"
  labels   = {}
  topic    = "projects/${each.key}/topics/cloud-builds"

  ack_deadline_seconds = 600
  push_config {
    push_endpoint = google_cloud_run_service.forward-service.status[0].url
    oidc_token {
      service_account_email = data.google_service_account.invoker.email
    }
  }

  enable_message_ordering = true
}
