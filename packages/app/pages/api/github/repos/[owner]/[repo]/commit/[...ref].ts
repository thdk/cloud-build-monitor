import { NextApiRequest, NextApiResponse } from "next";
import { getCommit } from "../../../../../../../github/commits";

export default async function commits(req: NextApiRequest, res: NextApiResponse) {
    
    const { repo, owner, ref } = req.query as { repo: string, owner: string; ref: string | string[]};

    const commit = await getCommit({
        ref: typeof ref === "string" ? ref : ref.join("/"),
        repo,
        owner,
    })

    res.status(200).json(commit);
}
