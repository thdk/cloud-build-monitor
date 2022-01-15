import type { PubsubMessage } from '@google-cloud/pubsub/build/src/publisher';
import type { EventFunction } from '@google-cloud/functions-framework';

import { PubSub } from '@google-cloud/pubsub';
import { getBuild } from './build-details';

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

  const build = await getBuild(buildId);

  pubSubClient.topic("ciccd-builds").publishMessage({
    attributes: {
      origin: "cloud-build",
      name: build.trigger?.name || "n/a",
      status: status.toLowerCase(),
      commitSha: build.source.commitSha,
      repo: build.source.repo,
      branchName: build.source.branchName,
    },
  })
};
