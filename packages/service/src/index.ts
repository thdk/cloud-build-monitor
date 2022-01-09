import type {PubsubMessage} from '@google-cloud/pubsub/build/src/publisher';
import type {EventFunction} from '@google-cloud/functions-framework';

import {generateReport} from './generate-report';
import {sendBuildReportEmail} from './send-email';

export const cloudBuildEvents: EventFunction = async ({
  attributes,
}: PubsubMessage) => {
  const {buildId, status} = attributes || {};

  if (!buildId) {
    return;
  }

  if (!status) {
    return;
  }

  switch (status) {
    case 'SUCCESS':
    case 'FAILURE': {
      const report = await generateReport({status, buildId});

      if (report) {

        await sendBuildReportEmail({
          ...report,
          status,

        });

        // TODO
        // - update issue status in jira
      }
      break;
    }
    case 'QUEUED':
    case 'WORKING':
      break;
    default:
      throw new Error(`Unknown build status: ${status}`);
  }
};
