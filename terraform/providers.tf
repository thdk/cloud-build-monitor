# Default providers
provider "google" {
  alias = "non-impersonated"
}

provider "google-beta" {
  alias = "non-impersonated"
}

# Impersonated providers
data "google_service_account_access_token" "default" {
  provider               = google.non-impersonated
  target_service_account = local.target_service_account
  scopes                 = ["userinfo-email", "cloud-platform"]
  lifetime               = "3600s"
}

provider "google" {
  project      = var.project
  region       = var.region
  zone         = var.zone
  access_token = data.google_service_account_access_token.default.access_token
}

provider "google-beta" {
  project      = var.project
  region       = var.region
  zone         = var.zone
  access_token = data.google_service_account_access_token.default.access_token
}
