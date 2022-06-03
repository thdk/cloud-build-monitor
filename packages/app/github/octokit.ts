import { Octokit } from "@octokit/rest";

const options = {
    auth: process.env.GITHUB_TOKEN,
};

export const octokit = new Octokit(options);
