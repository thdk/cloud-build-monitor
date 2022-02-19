import JiraApi from "jira-client";

export type Commit = {
    commit: {
        message: string;
        committer: {
            date: string | null;
        },
    },
    committer: {
        avatar_url: string | null;
        login: string | null;
    },
    author: {
        avatar_url: string | null;
    },
    sha: string;
    html_url: string;
}
    & {
        jiraIssue?: JiraApi.IssueObject | null;
    };

export type Commits = Commit[];


