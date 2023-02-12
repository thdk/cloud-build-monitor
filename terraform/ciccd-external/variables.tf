variable "ciccd_reporting_project_id" {
  type    = string
  default = "express-cicd-reporting"
}

variable "build_project_id" {
  type = string
  description = "The project id of the gcp project that will run cloud builds and publish to the ciccd reporting project"
}
