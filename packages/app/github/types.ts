import JiraApi from "jira-client";

export type Commit = {
    commit: {
        message: string;
        committer: {
            date: string;
        },
        author: {
            avatar_url: string;
        }
    },
    committer: {
        avatar_url: string;
        login: string;
    },
    author: {
        login: string;
        avatar_url: string;
        name: string;
    },
    sha: string;
    html_url: string;
}
    & {
        jiraIssue?: JiraApi.IssueObject | null;
    };

export type Commits = Commit[];


