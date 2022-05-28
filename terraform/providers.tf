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
