
# Terraform backend
terraform {
  backend "gcs" {
    prefix = "terraform/state"
  }

   required_version = ">= 1.3.4"
}
