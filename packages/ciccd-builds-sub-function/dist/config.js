"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const yenv = require('yenv');
const env = yenv('config.yaml');
exports.config = {
    GITHUB_TOKEN: env.GITHUB_TOKEN,
    GITHUB_REPO: env.GITHUB_REPO,
    GITHUB_OWNER: env.GITHUB_OWNER,
    ISSUE_REGEX: env.ISSUE_REGEX,
    SENDGRID_API_KEY: env.SENDGRID_API_KEY,
    SENDGRID_TEMPLATE_PREVIEW_BUILD_STATUS: env.SENDGRID_TEMPLATE_PREVIEW_BUILD_STATUS,
    SENDGRID_SENDER: env.SENDGRID_SENDER,
    GCP_PROJECT: env.GCP_PROJECT,
};
