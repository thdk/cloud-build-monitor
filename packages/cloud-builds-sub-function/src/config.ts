const yenv = require('yenv');

const env = yenv('config.yaml');

export const config = {
  GCP_PROJECT: env.GCP_PROJECT,
  GITHUB_OWNER: env.GITHUB_OWNER,
  GITHUB_REPO: env.GITHUB_REPO,
} as const;
