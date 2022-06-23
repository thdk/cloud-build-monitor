data "google_secret_manager_secret" "github-token" {
  secret_id = "github-token"
}

data "google_secret_manager_secret" "jira-user" {
  secret_id = "jira-user"
}

data "google_secret_manager_secret" "jira-password" {
  secret_id = "jira-password"
}

resource "google_cloudbuild_trigger" "app-triggers-app-engine" {
  count    = var.use_app_engine ? 1 : 0
  provider = google-beta
  name     = "app-trigger-deploy-app-engine"

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
      name       = "node:16-alpine"
      entrypoint = "yarn"
    }
    step {
      name       = "node:16-alpine"
      entrypoint = "yarn"
      args       = ["workspace", "app", "build"]
      env = [
        "REPO_REGEX=${var.repo_regex}",
        "ISSUE_REGEX=${var.issue_regex}",
      ]
      secret_env = [
        "GITHUB_TOKEN",
        "JIRA_USER",
        "JIRA_PASSWORD",
      ]
    }
    step {
      name       = "gcr.io/google.com/cloudsdktool/cloud-sdk"
      entrypoint = "bash"
      dir        = "./packages/app"
      args = [
        "-c",
        join(" && ", [
          "sed -i 's/APP_ENGINE_SERVICE_VALUE/${var.app_engine_service}/g' app.yaml",
          "sed -i 's/JIRA_HOST_VALUE/${var.jira_host}/g' app.yaml"
        ])
      ]
    }
    step {
      name       = "gcr.io/google.com/cloudsdktool/cloud-sdk"
      entrypoint = "bash"
      dir        = "./packages/app"
      args = [
        "-c",
          "sed -i 's/GITHUB_TOKEN_VALUE/$$GITHUB_TOKEN/g' app.yaml",
      ]
      secret_env = [
        "GITHUB_TOKEN",
      ]
    }
    step {
      name       = "gcr.io/cloud-builders/gcloud"
      entrypoint = "gcloud"
      dir        = "./packages/app"
      args = ["app",
        "deploy",
        "--quiet",
        "--service-account",
        google_service_account.run-service-account.email
      ]
    }
    options {
      logging = "CLOUD_LOGGING_ONLY"
    }
    timeout = "900s"
    available_secrets {
      secret_manager {
        env          = "GITHUB_TOKEN"
        version_name = "projects/${var.project}/secrets/${data.google_secret_manager_secret.github-token.secret_id}/versions/latest"
      }
      secret_manager {
        env          = "JIRA_USER"
        version_name = "projects/${var.project}/secrets/${data.google_secret_manager_secret.jira-user.secret_id}/versions/latest"
      }
      secret_manager {
        env          = "JIRA_PASSWORD"
        version_name = "projects/${var.project}/secrets/${data.google_secret_manager_secret.jira-password.secret_id}/versions/latest"
      }
    }
  }
}

resource "google_cloudbuild_trigger" "app-triggers" {
  count    = var.use_app_engine ? 0 : 1
  provider = google-beta
  name     = "app-trigger-deploy"

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
        google_cloud_run_service.app[0].name,
        "--image",
        "${var.region}-docker.pkg.dev/${var.project}/docker-repository/app:$COMMIT_SHA",
        "--region",
        var.region,
        "--set-env-vars",
        join(",", [
          "HOSTNAME=${google_cloud_run_service.app[0].status[0].url}",
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
