import { Octokit } from "@octokit/rest";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getRepos(
    req: NextApiRequest,
    res: NextApiResponse<unknown>
) {

    if (!process.env.GITHUB_TOKEN) {
        res.status(500).json({
            message: "GITHUB_TOKEN environment variable is not set",
        });
    }

    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
    });
    // TODO: allow user to choose to list only private, public, owner, repos
    // and fetch all of them (not only the first page)
    const repos = await octokit.repos.listForAuthenticatedUser({
        type: "all",
        per_page: 100,
    });

    const repoRegex = new RegExp(process.env.REPO_REGEX || '.*');
    const result = repos.data
        .filter((repo) => repoRegex.test(repo.full_name));

    res.status(200).json(result);
}
