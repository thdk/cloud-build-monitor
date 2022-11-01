data "google_secret_manager_secret" "github-token" {
  secret_id = "github-token"
}

data "google_secret_manager_secret" "jira-user" {
  secret_id = "jira-user"
}

data "google_secret_manager_secret" "jira-password" {
  secret_id = "jira-password"
}

resource "google_cloudbuild_trigger" "app-triggers" {
  provider = google-beta
  name     = "app-trigger-deploy"
  location = var.region

  project = var.project

  description = "build and deploy app on cloud run"

  github {
    owner = var.repo_owner
    name  = var.repo_name
    push {
      branch = var.repo_branch_pattern
    }
  }

  included_files = ["packages/app/**"]

  service_account = "projects/${var.project}/serviceAccounts/${"builder@${var.project}.iam.gserviceaccount.com"}"

  build {
    step {
      name       = "gcr.io/cloud-builders/gcloud"
      entrypoint = "bash"
      args = [
        "-c",
        "gcloud secrets versions access latest --secret=firebase-env | tee ./packages/app/.env"
      ]
    }
    step {
      name       = "gcr.io/cloud-builders/docker"
      entrypoint = "bash"
      args = [
        "-c",
        join(" ", [
          "docker build",
          "-t ${var.region}-docker.pkg.dev/${var.project}/docker-repository/app:$COMMIT_SHA",
          "-f packages/app/Dockerfile",
          "--build-arg REPO_REGEX=${var.repo_regex}",
          "--build-arg ISSUE_REGEX='${var.issue_regex}'",
          " ."
        ]),
      ]
    }

    step {
      name = "gcr.io/cloud-builders/docker"
      args = ["push", "${var.region}-docker.pkg.dev/${var.project}/docker-repository/app:$COMMIT_SHA"]
    }
    step {
      name       = "gcr.io/cloud-builders/gcloud"
      entrypoint = "gcloud"
      args = ["run",
        "deploy",
        google_cloud_run_service.app.name,
        "--image",
        "${var.region}-docker.pkg.dev/${var.project}/docker-repository/app:$COMMIT_SHA",
        "--region",
        var.region,
        "--set-env-vars",
        join(",", [
          "HOSTNAME=${google_cloud_run_service.app.status[0].url}",
          "GCP_PROJECT=${var.project}",
          "JIRA_HOST=${var.jira_host}",
        ]),
        "--set-secrets",
        join(",", [
          "JIRA_USER=jira-user:latest",
          "JIRA_PASSWORD=jira-password:latest",
          "GITHUB_TOKEN=github-token:latest",
        ]),
        "--service-account",
        google_service_account.run-service-account.email
      ]
    }
    artifacts {
      images = [
        "${var.region}-docker.pkg.dev/${var.project}/docker-repository/app:$COMMIT_SHA",
      ]
    }
    options {
      logging = "CLOUD_LOGGING_ONLY"
    }
    timeout = "900s"
  }
}
