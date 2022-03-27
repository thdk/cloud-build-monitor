const yenv = require('yenv');

const env = yenv('config.yaml');

export const config = {
  GITHUB_TOKEN: env.GITHUB_TOKEN,
  GITHUB_REPO: env.GITHUB_REPO,
  GITHUB_OWNER: env.GITHUB_OWNER,
  ISSUE_REGEX: env.ISSUE_REGEX,
  GCP_PROJECT: env.GCP_PROJECT,
  FIREBASE_ADMIN: env.FIREBASE_ADMIN,
} as const;
