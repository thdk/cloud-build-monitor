locals {
  all_secrets = toset([
    "github-token",
    "firebase-env",
    "jira-user",
    "jira-password"
  ])
  app_secrets = toset([
    "github-token", // TODO: remove? firebase now uses application default credentials in app api
    "firebase-env",
    "jira-user",
    "jira-password"
  ])
  builder_secrets = toset([
    "github-token", // TODO: remove once github token is no longer included in bundle
    "firebase-env",
  ])
  forward_service_secrets = toset([
    "github-token",
  ])
}

resource "google_secret_manager_secret" "secrets" {
  for_each  = local.all_secrets
  secret_id = each.key
  labels    = {}
  replication {
    automatic = true
  }

  depends_on = [
    google_project_service.services
  ]
}

# Allow access to secrets by global builder service account

resource "google_secret_manager_secret_iam_member" "builder-secret-accessor" {
  for_each  = local.builder_secrets
  project   = google_secret_manager_secret.secrets[each.key].project
  secret_id = google_secret_manager_secret.secrets[each.key].secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.builder.email}"
}

# Allow access to secrets by app runtime service account

resource "google_secret_manager_secret_iam_member" "app-runtime-secret-accessor" {
  for_each  = local.app_secrets
  project   = google_secret_manager_secret.secrets[each.key].project
  secret_id = google_secret_manager_secret.secrets[each.key].secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${module.app.runtime_service_account}"
  depends_on = [
    module.app
  ]
}

# Allow access to secrets by forward service runtime service account

resource "google_secret_manager_secret_iam_member" "forward-service-secret-accessor" {
  for_each  = local.forward_service_secrets
  project   = google_secret_manager_secret.secrets[each.key].project
  secret_id = google_secret_manager_secret.secrets[each.key].secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${module.forward-service.runtime_service_account}"
}
