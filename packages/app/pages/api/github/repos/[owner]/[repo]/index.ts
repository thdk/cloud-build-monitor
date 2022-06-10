import { Octokit } from "@octokit/rest";
import { NextApiRequest, NextApiResponse } from "next";

export default async function repo(req: NextApiRequest, res: NextApiResponse) {
    if (!process.env.GITHUB_TOKEN) {
        res.status(500).json({
            message: "GITHUB_TOKEN environment variable is not set",
        });
    }

    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN,
    });

    const { repo, owner, } = req.query as { repo: string, owner: string; };

    const gitRepo = await octokit.repos.get({
        repo,
        owner,
    });

    res.status(200).json(gitRepo);
}
