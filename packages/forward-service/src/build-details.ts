import { CloudBuildClient } from '@google-cloud/cloudbuild';

// Creates a client
const cb = new CloudBuildClient();

export const getBuild = async (build: any) => {
  const projectId = build.projectId;

  // use name instead of id to allow to fetch build / trigger from non global region
  // example build name: projects/902089564156/locations/europe-west1/builds/d41db8f6-687a-4fc7-b082-f4995ef83770
  const triggerName = `${build.name
    .substr(0, build.name.lastIndexOf("/") +1)
    .replace("builds", "triggers")}${build.buildTriggerId}`;

  const [trigger] =
    (build.buildTriggerId &&
      (await cb
        .getBuildTrigger({
          name: triggerName,
          projectId: projectId,
        })
        .catch(error => {
          console.error(`Failed to get build trigger: ${build.buildTriggerId} in project ${projectId}`);
          throw error;
        }))) ||
    [];

  // ---- Github push to branch substitutions ----
  // BRANCH_NAME: 'feat/email-notifications',
  // REF_NAME: 'feat/email-notifications',
  // TRIGGER_NAME: 'gcb-monitor',
  // TRIGGER_BUILD_CONFIG_PATH: 'cloudbuild.yaml',
  // REPO_NAME: 'cloud-build-monitor',
  // REVISION_ID: '8ddba877d8d80dbbd26b18ad464e0ee2a9c76775',
  // COMMIT_SHA: '8ddba877d8d80dbbd26b18ad464e0ee2a9c76775',
  // SHORT_SHA: '8ddba87'
  const {
    COMMIT_SHA: commitSha,
    BRANCH_NAME: branchName,
    REPO_NAME: repo,
  } = build.substitutions || {};

  return {
    source: {
      commitSha: commitSha || build.source?.repoSource?.commitSha || "",
      branchName: branchName || build.source?.repoSource?.branchName || "",
      repo,
    },
    trigger,
    build,
  };
};
