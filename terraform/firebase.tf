
# Add firebase to the project
resource "google_app_engine_application" "app" {
  project       = var.project
  location_id   = var.location
  database_type = "CLOUD_FIRESTORE"
}

# Firestore indexes

resource "google_firestore_index" "builds-1" {
  project = var.project

  collection  = "builds"
  query_scope = "COLLECTION"

  fields {
    field_path = "branch"
    order      = "ASCENDING"
  }
  fields {
    field_path = "commitSha"
    order      = "ASCENDING"
  }
  fields {
    field_path = "created"
    order      = "DESCENDING"
  }
}

resource "google_firestore_index" "builds-3" {
  project = var.project

  collection  = "builds"
  query_scope = "COLLECTION"

  fields {
    field_path = "branch"
    order      = "ASCENDING"
  }
  fields {
    field_path = "created"
    order      = "DESCENDING"
  }
}

resource "google_firestore_index" "builds-4" {
  project = var.project

  collection  = "builds"
  query_scope = "COLLECTION"

  fields {
    field_path = "branchName"
    order      = "ASCENDING"
  }
  fields {
    field_path = "created"
    order      = "DESCENDING"
  }
}

resource "google_firestore_index" "builds-5" {
  project = var.project

  collection  = "builds"
  query_scope = "COLLECTION"

  fields {
    field_path = "commitSha"
    order      = "ASCENDING"
  }
  fields {
    field_path = "created"
    order      = "DESCENDING"
  }
}

resource "google_firestore_index" "builds-6" {
  project = var.project

  collection  = "builds"
  query_scope = "COLLECTION"

  fields {
    field_path = "githubRepoOwner"
    order      = "ASCENDING"
  }
  fields {
    field_path = "repo"
    order      = "ASCENDING"
  }
  fields {
    field_path = "created"
    order      = "DESCENDING"
  }
}
