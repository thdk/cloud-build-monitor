
locals {
  services = [
    "forward-service", 
  ]
}

data "google_secret_manager_secret" "github-token" {
    secret_id = "github-token"
}

resource "google_cloudbuild_trigger" "cloud-run-service-triggers" {
  for_each = toset(local.services)
  provider = google-beta
  name     = "${each.key}-trigger-deploy"
  location = var.region

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

  service_account = var.service_account_builder.name

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
        google_cloud_run_service.forward-service.name,
        "--image",
        "${var.region}-docker.pkg.dev/${var.project}/docker-repository/${each.key}:$COMMIT_SHA",
        "--region",
        var.region,
        "--set-env-vars",
        "HOSTNAME=${google_cloud_run_service.forward-service.status[0].url},GCP_PROJECT=${var.project}",
        "--service-account",
        google_service_account.run-service-account.email
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