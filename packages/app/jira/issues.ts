export function getIssue(id: string) {
    return fetch(`${process.env.NEXT_PUBLIC_HOST || "http://localhost:3000"}/api/jira/issue/${id}`)
        .then((response) => response.json())
        .then((jiraIssue) => ({
            summary: jiraIssue.fields.summary || null,
            key: jiraIssue.key
        }));
}
