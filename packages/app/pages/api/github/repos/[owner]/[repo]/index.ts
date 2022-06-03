import { Octokit } from "@octokit/rest";
import { NextApiRequest, NextApiResponse } from "next";

export default async function repo(req: NextApiRequest, res: NextApiResponse) {
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
