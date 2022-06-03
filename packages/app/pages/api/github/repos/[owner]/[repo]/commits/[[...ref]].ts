import { NextApiRequest, NextApiResponse } from "next";
import { getCommits } from "../../../../../../../github/commits";

export default async function commits(req: NextApiRequest, res: NextApiResponse) {

    const { repo, owner, ref, since } = req.query as {
        repo: string,
        owner: string;
        ref?: string;
        since?: string;
    };
    const commits = await getCommits({
        ref,
        repo,
        owner,
        since: since || undefined,
    })

    res.status(200).json(commits);
}
