import { Octokit } from "@octokit/rest";

export const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});
