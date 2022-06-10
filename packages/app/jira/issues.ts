export function getIssue(id: string) {
    return fetch(`${process.env.NEXT_PUBLIC_HOST || ""}/api/jira/issue/${id}`)
        .then(async (response) => {
            const data = await response.json()
                if (response.ok) {
                    return data;
                }

                return Promise.reject(
                    (data && data.message) || response.status,
                );
        })
        .then((jiraIssue) => ({
            summary: jiraIssue.fields.summary || null,
            key: jiraIssue.key
        }));
}
