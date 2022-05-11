# ciccd-builds-sub-function

Handles CICCD pub sub messages to add build statuses to the dashboard database and sends notifications.

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

## Setup the service

Add your github access token to the github-token secret in Google Secret Manager.
This secret is created with a dummy value by terraform.