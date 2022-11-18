locals {
  configs = tomap({
    issueTrackerUrl = ""
  })
}

resource "google_firestore_document" "config" {
  for_each    = local.configs
  project     = var.project
  collection  = "configs"
  document_id = each.key
  fields      = "{\"value\":\"${each.value}\"}"

  lifecycle {
    ignore_changes = [
      # TODO: ignore changed values
    ]
  }
}
