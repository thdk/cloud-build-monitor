import JiraApi from "jira-client";

export const jiraApi = process.env.JIRA_HOST
    ? new JiraApi({
        host: process.env.JIRA_HOST,
        username: process.env.JIRA_ACCESS_TOKEN ? undefined : process.env.JIRA_USER,
        password: process.env.JIRA_ACCESS_TOKEN ? undefined : process.env.JIRA_PASSWORD,
        oauth: (
            process.env.JIRA_ACCESS_TOKEN
            && process.env.JIRA_CONSUMER_KEY
            && process.env.JIRA_CONSUMER_SECRET
            && process.env.JIRA_ACCESS_TOKEN
            && process.env.JIRA_ACCESS_TOKEN_SECRET
        )
            ? {
                consumer_key: process.env.JIRA_CONSUMER_KEY,
                consumer_secret: process.env.JIRA_CONSUMER_SECRET,
                access_token: process.env.JIRA_ACCESS_TOKEN,
                access_token_secret: process.env.JIRA_ACCESS_TOKEN_SECRET,
                signature_method: "RSA-SHA1",
            }
            : undefined,
        protocol: "https",
        strictSSL: true,
    })
    : undefined;