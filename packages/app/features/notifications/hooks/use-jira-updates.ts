import { useCollectionData } from "react-firebase-hooks/firestore";
import { JiraUpdate } from "../../../collections/jira-updates/types";
import { createGetAllJiraUpdatesQuery, jiraUpdateConverter } from "../firestore/jira-updates";

export const useJiraUpdates = () => {

    return useCollectionData<JiraUpdate>(
        createGetAllJiraUpdatesQuery()
            .withConverter(jiraUpdateConverter),
    );
};
