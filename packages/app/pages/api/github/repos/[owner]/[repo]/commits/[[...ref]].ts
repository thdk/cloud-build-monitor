import { NextApiRequest, NextApiResponse } from "next";
import { getCommits } from "../../../../../../../github/commits";

export default async function commits(req: NextApiRequest, res: NextApiResponse) {
    const { repo, owner, ref: refFromParam, since } = req.query;

    const ref = Array.isArray(refFromParam) ? refFromParam.join("/") : refFromParam;

    if (Array.isArray(repo)) {
        throw new Error("repo must be a string");
    }

    if (Array.isArray(owner)) {
        throw new Error("owner must be a string");
    }

    if (Array.isArray(since)) {
        throw new Error("since must be a string");
    }

    const commits = await getCommits({
        ref,
        repo,
        owner,
        since: since || undefined,
    });

    res.status(200).json(commits);
}
