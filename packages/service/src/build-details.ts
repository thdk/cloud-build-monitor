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

  console.log({
    build
  })

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
  let source = build.source?.repoSource ?? {
    ...build.source,
    commitSha: build.substitutions?.COMMIT_SHA,
    commitShaShort: build.substitutions?.SHORT_SHA,
    branchName: build.substitutions?.BRANCH_NAME,
    repo: build.substitutions?.REPO_NAME,
  };

  console.log({
    source
  })

  return {
    source,
    trigger,
    build,
  };
};
