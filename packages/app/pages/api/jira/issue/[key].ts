import type { NextApiRequest, NextApiResponse } from 'next'
import { jiraApi } from '../../../../jira/jira-api';

type Data = any;

type Error = {
  error: string;
}

const issue = async (req: NextApiRequest, res: NextApiResponse<Data | Error>) => {
  const { key } = req.query;
  if (typeof key !== "string") {
    throw new Error("Exactly one issue key is required.")
  }

  const issue = await jiraApi?.getIssue(key as string);

  if (issue) {
    res.status(200).json(issue);
  } else {
    res.status(404).json({
      error: ""
    });
  }
}

export default issue;
