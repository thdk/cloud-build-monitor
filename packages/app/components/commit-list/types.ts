import { RestEndpointMethodTypes } from "@octokit/rest";
import JiraApi from "jira-client";

export type Commit = RestEndpointMethodTypes["repos"]["listCommits"]["response"]["data"][number]
    & {
        jiraIssue?: JiraApi.IssueObject | null;
    };

export type Commits = Commit[];

