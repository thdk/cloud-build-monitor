import { NextApiRequest, NextApiResponse } from "next";
import { getAllBranches } from "../../../../../../../github/branches";

export default async function branches(req: NextApiRequest, res: NextApiResponse) {
    
    const { repo, owner, } = req.query as { repo: string, owner: string; };
    const branches = await getAllBranches({
        repo,
        owner,
    });

    res.status(200).json(branches);
}
