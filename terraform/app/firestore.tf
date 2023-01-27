## Firestore default data
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
  fields      = "{\"value\":{\"stringValue\":\"${each.value}\"}}"

  lifecycle {
    ignore_changes = [
      fields
    ]
  }
}

## Firestore rules
data "local_file" "firestore-rules" {
  filename = "${path.module}/firestore.rules"
}
resource "google_firebaserules_ruleset" "rules-2022-12-24-2" {
  source {
    files {
      content     = data.local_file.firestore-rules.content
      name        = "firestore.rules"
      fingerprint = sha1(data.local_file.firestore-rules.content)
    }
  }

  lifecycle {
    ignore_changes = all
  }

  project = var.project
}

resource "google_firebaserules_ruleset" "rules-2023-01-27" {
  source {
    files {
      content     = data.local_file.firestore-rules.content
      name        = "firestore.rules"
      fingerprint = sha1(data.local_file.firestore-rules.content)
    }
  }

  lifecycle {
    ignore_changes = all
  }

  project = var.project
}

resource "google_firebaserules_ruleset" "rules-2023-01-27-2" {
  source {
    files {
      content = data.local_file.firestore-rules.content
      name    = "firestore.rules"
    }
  }

  lifecycle {
    ignore_changes = all
  }

  project = var.project
}

resource "google_firebaserules_ruleset" "rules" {
  source {
    files {
      content     = data.local_file.firestore-rules.content
      name        = "firestore.rules"
      fingerprint = sha1(data.local_file.firestore-rules.content)
    }
  }

  lifecycle {
    create_before_destroy = true
  }

  project = var.project
}

resource "google_firebaserules_release" "primary" {
  name         = "cloud.firestore"
  ruleset_name = "projects/${var.project}/rulesets/${google_firebaserules_ruleset.rules.name}"
  project      = var.project
}

