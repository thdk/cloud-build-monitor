import JiraApi from "jira-client";

export const jiraApi = process.env.JIRA_HOST
    ? new JiraApi({
        host: process.env.JIRA_HOST,
        username: process.env.JIRA_USER_NAME,
        password: process.env.JIRA_PASSWORD,
        protocol: "https",
        strictSSL: true,
    })
    : undefined;