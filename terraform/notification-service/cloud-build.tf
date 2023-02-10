
locals {
  services = [
    "notification-service", 
  ]
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
      entrypoint = "bash"
      args = [
        "-c",
        "docker build --target test -f packages/${each.key}/Dockerfile ."
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
        google_cloud_run_service.notification-service.name,
        "--image",
        "${var.region}-docker.pkg.dev/${var.project}/docker-repository/${each.key}:$COMMIT_SHA",
        "--region",
        var.region,
        "--service-account",
        google_service_account.run-service-account.email,
        "--set-env-vars",
        join(",", [
          "JIRA_HOST=${var.jira-host}",
        ]),
        "--update-secrets",
        join(",", [
          "GITHUB_TOKEN=${var.github-token-secret-id}:latest",
          "JIRA_USER=${var.jira-user-secret-id}:latest",
          "JIRA_PASSWORD=${var.jira-password-secret-id}:latest",
        ]),
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