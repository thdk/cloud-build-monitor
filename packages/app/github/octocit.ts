import { Octokit } from "@octokit/rest";

export const octokit = new Octokit({
    auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});
