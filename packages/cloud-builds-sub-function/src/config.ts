const yenv = require('yenv');

const env = yenv('config.yaml');

export const config = {
  GCP_PROJECT: env.GCP_PROJECT,
} as const;
