# forward-service

Handles push notifications from pub sub for the `cloud-builds` topic.

Google Cloud Build will automatically publish these messages for all cloud builds. 

Note that GCP does not publish this message for manual running `gcloud builds submit`.

But manually running a cloud build trigger with `gcloud beta builds triggers run <trigger>` will cause cloud build to publish pub sub messages with build statuses.

The forward-service collects additional build info from GCP cloud build api and publishes a new pub sub message to the `ciccd-builds` topic.