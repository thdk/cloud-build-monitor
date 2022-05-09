const yenv = require('yenv');

const env = yenv('config.yaml');

export const config = {
  GITHUB_TOKEN: env.GITHUB_TOKEN,
  ISSUE_REGEX: env.ISSUE_REGEX,
  GCP_PROJECT: env.GCP_PROJECT,
} as const;
