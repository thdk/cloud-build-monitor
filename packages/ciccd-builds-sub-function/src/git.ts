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
  }).catch((e) => {
    console.error(`Couldnt find commit for ${JSON.stringify({repo, owner, sha})}`)
    throw e;

});

  return commit.data;
};
