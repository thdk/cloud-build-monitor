import {Octokit} from '@octokit/rest';
import {config} from './config';

const gitConfig = {
  owner: config.GITHUB_OWNER,
  repo: config.GITHUB_REPO,
  auth: config.GITHUB_TOKEN,
};
export const getCommitInfo = async (sha: string) => {
  const octokit = new Octokit(gitConfig);

  const commit = await octokit.git.getCommit({
    ...gitConfig,
    commit_sha: sha,
  });

  return commit.data;
};
