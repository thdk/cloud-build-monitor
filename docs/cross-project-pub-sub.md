# CICCD: Cross project pub sub messaging


## Guide

Continue reading if one of the following applies to your setup:
- You already have cloud datastore enabled in your current project.
  You can't have both the datastore and firestore api enabled in the same project.

    Firestore is required for the ciccd-console database.

- You want to send messages to the ciccd-builds pub/sub topic from different GCP projects.
- You don't want your build infrastructure share the same project as ciccd console.

```sh
gcloud pubsub topics get-iam-policy \
   projects/${CICCD_PROJECT}/topics/ciccd-builds \
   --format json > topic_policy.json
```

Now open the `topic_policy.json` file and edit it to look like something below:

```json
{
    "etag": "ACAB",
    "bindings": [
        {
            "role": "roles/pubsub.publisher",
            "members": [
                "serviceAccount:<CLOUDBUILD_PROJECT_NUMBER>@cloudbuild.gserviceaccount.com"
            ]
        }
    ]
}
```

The `members` list should contain all the service accounts from other projects which you want to give the publisher role to for 
the cloud-builds topic in the CICCD GCP project.

Once the file is saved, apply it:

```sh
gcloud pubsub topics set-iam-policy  \
   projects/${CICCD_PROJECT}/topics/ciccd-builds     \
   topic_policy.json
```


## Official docs and resources

https://cloud.google.com/pubsub/docs/access-control