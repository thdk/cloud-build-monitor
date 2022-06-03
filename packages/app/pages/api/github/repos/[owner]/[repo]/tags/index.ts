import { NextApiRequest, NextApiResponse } from "next";
import { getAllTags } from "../../../../../../../github/tags";

export default async function tags(req: NextApiRequest, res: NextApiResponse) {
   
    const { repo, owner, } = req.query as { repo: string, owner: string; };
    const tags = await getAllTags({
        repo,
        owner,
    })

    res.status(200).json(tags);
}
