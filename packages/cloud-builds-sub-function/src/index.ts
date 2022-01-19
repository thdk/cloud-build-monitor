import type { PubsubMessage } from '@google-cloud/pubsub/build/src/publisher';
import type { EventFunction } from '@google-cloud/functions-framework';

import { PubSub } from '@google-cloud/pubsub';
import { getBuild } from './build-details';
import { config } from './config';

const pubSubClient = new PubSub();

export const cloudBuildEvents: EventFunction = async ({
  attributes,
}: PubsubMessage) => {
  const { buildId, status } = attributes || {};

  if (!buildId) {
    return;
  }

  if (!status) {
    return;
  }

  const {
    trigger,
    source,
    build,
  } = await getBuild(buildId);

  await pubSubClient.topic("ciccd-builds").publishMessage({
    attributes: {
      origin: "cloud-build",
      name: trigger?.name || "n/a",
      status: status.toLowerCase(),
      commitSha: source.commitSha,
      repo: trigger?.github ? source.repo : config.GITHUB_REPO || "",
      githubRepoOwner: trigger?.github?.owner || config.GITHUB_OWNER || "",
      branchName: source.branchName,
      id: buildId,
      logUrl: build.logUrl || "",
      startTime: build.startTime?.seconds?.toString() || "",
      finishTime: build.finishTime?.seconds?.toString() || "",
    },
  });
};
