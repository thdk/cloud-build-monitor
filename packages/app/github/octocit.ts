import { Octokit } from "@octokit/rest";

const options = {
    auth: process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN,
};

console.log({
    options,
})
export const octokit = new Octokit(options);
