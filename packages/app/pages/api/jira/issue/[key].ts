import type { NextApiRequest, NextApiResponse } from 'next'
import { jiraApi } from '../../../../jira/jira-api';

type Data = any;

type Error = {
  error: string;
}

const repos = async (req: NextApiRequest, res: NextApiResponse<Data | Error>) => {
  const { key } = req.query;
  if (typeof key !== "string") {
    res.status(500).send({
      name: "Failed to fetch issue"
    });
  }

  const issue = await jiraApi?.getIssue(key as string)
    .catch((e) => {
      console.error(e);
      throw e;
    });
  if (issue) {
    res.status(200).json(issue);
  } else {
    res.status(404).json({
      error: ""
    });
  }
}

export default repos;
