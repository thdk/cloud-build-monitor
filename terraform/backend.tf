
# Terraform backend
terraform {
  backend "gcs" {
    prefix = "terraform/state"
  }
}
