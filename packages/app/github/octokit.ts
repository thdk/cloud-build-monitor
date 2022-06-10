import { Octokit } from "@octokit/rest";

export function createOctokit() {

    const options = {
        auth: process.env.GITHUB_TOKEN,
    };

    if (!options.auth) {
        throw new Error("Missing value for GITHUB_TOKEN");
    }
    return new Octokit(options);
}
