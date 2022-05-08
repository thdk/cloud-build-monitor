import { CloudBuildClient } from '@google-cloud/cloudbuild';

// Creates a client
const cb = new CloudBuildClient();

export const getBuild = async (build: any) => {
  // const [build] = await cb
  //   .getBuild({
  //     id,
  //   })
  //   .catch(error => {
  //     console.error(`Failed to get build: ${id} in project ${projectId}`);
  //     throw error;
  //   });

  const projectId = build.projectId;
  const id = build.id;

  const [trigger] =
    (build.buildTriggerId &&
      (await cb
        .getBuildTrigger({
          triggerId: build.buildTriggerId,
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
