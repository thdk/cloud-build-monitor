
# Terraform backend

resource "google_storage_bucket" "terraform-state" {
  name          = "ciccd-terraform-state"
  force_destroy = false
  location      = "EU"
  storage_class = "STANDARD"
  versioning {
    enabled = true
  }
}

terraform {
  backend "gcs" {
    bucket = "ciccd-terraform-state"
    prefix = "terraform/state"
  }
}
