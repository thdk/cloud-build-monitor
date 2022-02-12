import JiraApi from "jira-client";

export const jiraApi = process.env.NEXT_PUBLIC_JIRA_HOST
    ? new JiraApi({
        host: process.env.NEXT_PUBLIC_JIRA_HOST,
        username: process.env.NEXT_PUBLIC_JIRA_USER_NAME,
        password: process.env.NEXT_PUBLIC_JIRA_PASSWORD,
        protocol: "https",
        strictSSL: true,
    })
    : undefined;