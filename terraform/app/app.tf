resource "google_service_account" "run-service-account" {
  account_id   = "app-runtime"
  display_name = "app"
  project      = var.project
  description  = "Service account which will get impersonated by the app"
}

# Cloud run services

resource "google_cloud_run_service" "app" {
  name     = "app"
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

resource "google_cloud_run_service_iam_binding" "binding" {
  count    = length(var.allowed_http_viewers)
  location = google_cloud_run_service.app.location
  project  = google_cloud_run_service.app.project
  service  = google_cloud_run_service.app.name
  role     = "roles/run.invoker"
  members  = var.allowed_http_viewers
}
