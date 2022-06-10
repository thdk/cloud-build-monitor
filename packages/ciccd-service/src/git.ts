import { Octokit } from '@octokit/rest';

export const getCommitInfo = async ({
  sha,
  repo,
  owner
}: {
  sha: string;
  repo: string;
  owner: string;
}) => {

  if (!process.env.GITHUB_TOKEN) {
    throw new Error("GITHUB_TOKEN environment variable is not set");
  }

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
    repo,
    owner,
  });

  const commit = await octokit.git.getCommit({
    repo,
    owner,
    commit_sha: sha,
  }).catch((e) => {
    console.error(`Couldnt find commit for ${JSON.stringify({ repo, owner, sha })}`)
    throw e;

  });

  return commit.data;
};
