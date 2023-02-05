import { collection, deleteField, FirestoreDataConverter, getDocs, getFirestore, orderBy, query, QueryDocumentSnapshot } from "firebase/firestore";
import { JiraUpdate } from "../../../collections/jira-updates/types";

export const JIRA_UPDATES_COLLECTION = 'jira-updates';

export const jiraUpdateConverter: FirestoreDataConverter<JiraUpdate> = {
    toFirestore: ({
        issueRegex,
        ...appData
    }) => {
        delete (appData as any).id;

        if (appData.branchFilterRegex === undefined) delete appData.branchFilterRegex;
        if (appData.description === undefined) delete appData.description;
        if (appData.statuses === undefined) delete appData.statuses;
        if (appData.name === undefined) delete appData.name;

        const caseInsensitiveName = appData.name
            ? {
                name_case_insensitive:
                    typeof appData.name === "string"
                        ? (appData.name || "n/a").toUpperCase()
                        : appData.name,
            }
            : {};

        return {
            ...appData,
            ...caseInsensitiveName,
            issueRegex: !issueRegex ? deleteField() : issueRegex,
        };
    },
    fromFirestore: (docData: QueryDocumentSnapshot<JiraUpdate>) => {
        const {
            ...rest
        } = docData.data();

        return {
            ...rest,
            id: docData.id,
        } as unknown as JiraUpdate;
    },
};

export const createGetAllJiraUpdatesQuery = () => query(
    collection(getFirestore(), JIRA_UPDATES_COLLECTION),
    orderBy("name_case_insensitive"),
);

export const getAllJiraUpdates = () => getDocs(createGetAllJiraUpdatesQuery());
