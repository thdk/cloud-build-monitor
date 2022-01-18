import { Octokit } from '@octokit/rest';
import { config } from './config';

export const getCommitInfo = async ({
  sha,
  repo,
  owner
}: {
  sha: string;
  repo: string;
  owner: string;
}) => {
  const octokit = new Octokit({
    auth: config.GITHUB_TOKEN,
    repo,
    owner,
  });

  const commit = await octokit.git.getCommit({
    repo,
    owner,
    commit_sha: sha,
  });

  return commit.data;
};
