# ciccd-service

Handles CICCD pub sub messages to add build statuses to the dashboard database.
These messages are usually sent by the [forward-service](../ciccd-service/README.md). However, you can also manually publish these.

## Pub sub message specifications

Pub sub messages sent to the `ciccd-builds` topic must/may have the following attributes:

 name            | required   | description 
-----------------|:----------:|-------------
branchName       |     x      |    
commitSha        |     x      |    
id               |     x      | A unique identifier of the build, used to set status updates for the same build
finishTime       |            | Time in seconds since 1/1/1970
githubRepoOwner  |     x      | Owner of repo
logUrl           |            |
name             |     x      | The name of the trigger/pipeline
origin           |     x      | The original CI/CD platform which triggerd the build event. Ex. 'google-cloud' or 'gocd'
repo             |     x      | The name of the github repo
startTime        |            | Time in seconds since 1/1/1970   
status           |     x      | [success, failure, cancelled, queued]

## Manually publish messages to the ciccd-builds topic

The service account that will publish the messages must be added to the `ciccd-builds-publisher` terraform variable.

```
ciccd-builds-publisher = [ "serviceAccount:my-service-account@my-other-project.iam.gserviceaccount.com" ]
```

Next, you can publish messages to the ciccd-builds messages like this:

```sh
gcloud pubsub topics publish \
    projects/[your-ciccd-project]/topics/ciccd-builds \
    --attribute='branchName=foo,commitSha=123,id=unique-build-id,githubRepoOwner=thdk,name=build,origin=circle-ci,repo=cloud-build-monitor,status=success'
```

