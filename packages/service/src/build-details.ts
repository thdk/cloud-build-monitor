import {CloudBuildClient} from '@google-cloud/cloudbuild';

// Creates a client
const cb = new CloudBuildClient();

export const getBuild = async (id: string) => {
  console.log('Requesting build: ' + id);
  const [build] = await cb
    .getBuild({
      id,
      projectId: 'express-dev',
    })
    .catch(error => {
      console.error(error);
      throw error;
    });

  const [trigger] =
    (build.buildTriggerId &&
      (await cb
        .getBuildTrigger({
          triggerId: build.buildTriggerId,
          projectId: 'express-dev',
        })
        .catch(error => {
          console.error(error);
          throw error;
        }))) ||
    [];

  const source = build.source?.repoSource;
  if (!source) {
    // build not triggered from a repo
    return undefined;
  }

  return {
    source,
    trigger,
    build,
  };
};
