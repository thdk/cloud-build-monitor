/*
* Here we are giving the terraform service account that is used by cicd-reporting project
* permissions to create subscriptions in cicd-reporting-project project and attach it to the cloud-builds 
* topic in this project 
*/

# The cloud-builds topic might already exist, if so you'll have to run `terraform import` to update your state with the existing topic
resource "google_pubsub_topic" "cloud-builds-topic" {
  project = var.build_project_id
  name    = "cloud-builds"
}

# allow the te account in the cicd reporting project to attach subscriptions to the cloud-builds topic of this project
resource "google_pubsub_topic_iam_member" "cloud-builds-topic-subscriber" {
  topic  = google_pubsub_topic.cloud-builds-topic.name
  role   = "roles/pubsub.subscriber"
  member = "serviceAccount:terraform@${var.ciccd_reporting_project_id}.iam.gserviceaccount.com"
}

# allow the forward service of the cicd reporting project to get build information for builds from this project
resource "google_project_iam_member" "cicd-build-viewer" {
  project = var.build_project_id
  role    = "roles/cloudbuild.builds.viewer"
  member  = "serviceAccount:forward-service-runtime@${var.ciccd_reporting_project_id}.iam.gserviceaccount.com"
}
