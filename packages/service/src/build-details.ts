import {CloudBuildClient} from '@google-cloud/cloudbuild';
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

  const source = build.source?.repoSource;
  if (!source) {
    console.log('build not triggered from a repo');
    console.log({
      source: build.source,
    })
    return undefined;
  }

  return {
    source,
    trigger,
    build,
  };
};
