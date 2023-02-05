import { jiraApi } from "./jira-api";

export const transitionIssueTo = async (
    issueId: string,
    transition: string,
) => {
    if (!jiraApi) {
        console.error(`jiraApi was not initialized. Probably the JIRA_HOST env variable is not set.`);
        return;
    }

    // get available transitions for issue
    const availableTransitions = (
        await jiraApi.listTransitions(issueId)
    ) as {
        transitions: {
            id: string;
            name: string;
        }[]
    };

    if (!availableTransitions) {
        console.error(`No transitions available for issue ${issueId}`);
        return;
    }

    const transitionToRun = availableTransitions.transitions
        .find((t) => t.name === transition);

    if (!transitionToRun) {
        console.error(`${transition} is not available for ${issueId}. Available transitions are ${availableTransitions.transitions.map((t) => t.name).join(", ")}`);
    } else {
        console.log(`Transitioning issue ${issueId} to ${transitionToRun?.name}`)
        // transition issue to another status
        await jiraApi?.transitionIssue(
            issueId,
            {
                transition: transitionToRun,
            },
        ).catch((error) => {
            console.error(`Failed to transition issue ${issueId} to ${transition}.`);
            console.error(error);
        });
    }
}
