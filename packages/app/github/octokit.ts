import { Octokit } from "@octokit/rest";

const options = {
    auth: process.env.GITHUB_TOKEN,
};

if (!options.auth) {
    throw new Error("Missing value for GITHUB_TOKEN");
}

export const octokit = new Octokit(options);
