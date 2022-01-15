import { CloudBuildClient } from '@google-cloud/cloudbuild';
import { config } from './config';

// Creates a client
const cb = new CloudBuildClient();

export const getBuild = async (id: string) => {
  const [build] = await cb
    .getBuild({
      id,
      projectId: config.GCP_PROJECT,
    })
    .catch(error => {
      console.error(`Failed to get build: ${id} in project ${config.GCP_PROJECT}`);
      throw error;
    });

  const [trigger] =
    (build.buildTriggerId &&
      (await cb
        .getBuildTrigger({
          triggerId: build.buildTriggerId,
          projectId: config.GCP_PROJECT,
        })
        .catch(error => {
          console.error(`Failed to get build trigger: ${build.buildTriggerId} in project ${config.GCP_PROJECT}`);
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
    SHORT_SHA: commitShaShort,
  } = build.substitutions || {};

  return {
    source: {
      commitSha,
      branchName,
      repo,
      commitShaShort,
    },
    trigger,
    build,
  };
};
