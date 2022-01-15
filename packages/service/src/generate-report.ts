import {getBuild} from './build-details';
import { config } from './config';
import {getCommitInfo} from './git';

export const generateReport = async ({
  buildId,
}: {
  status: string;
  buildId: string;
}) => {
  const build = await getBuild(buildId).catch(error => {
    console.error(error);
    return undefined;
  });

  if (!build) {
    return;
  }

  if (!build.source.commitSha) {
    throw new Error("Can't get commit info without commit sha");
  }

  const commit = await getCommitInfo(build.source.commitSha);

  const issue = commit.message.match(new RegExp(config.ISSUE_REGEX));
  return {
    build,
    commit,
    issue: issue ? issue[0] : null,
  };
};
