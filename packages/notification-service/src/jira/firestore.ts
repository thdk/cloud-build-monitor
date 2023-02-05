import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { db } from '../common/init-firebase';
import { JiraUpdate, JiraUpdateFirestoreData } from './interfaces';

const jiraUpdateConverter: FirebaseFirestore.FirestoreDataConverter<JiraUpdate> = {
    toFirestore: (v: JiraUpdate) => v,
    fromFirestore: (docData: QueryDocumentSnapshot<JiraUpdateFirestoreData>) => {
        const {
            issueRegex = "[A-Z][A-Z0-9]+-[0-9]+",
            ...rest
        } = docData.data();

        return {
            issueRegex,
            ...rest,
        };
    },
};

export async function getJiraUpdates(
    trigger: string,
    status: string,
    branchName: string,
) {
    const jiraUpdatesCollectionRef = db.collection('jira-updates');

    const jiraUpdates = await jiraUpdatesCollectionRef
        // todo: also filter on git repo? (maybe similar to branchRegex filter?)
        .where(
            "buildTrigger",
            "==",
            trigger,
        )
        .where("statuses", "array-contains", status)
        .withConverter<JiraUpdate>(jiraUpdateConverter)
        .get();

    if (!jiraUpdates.size) {
        return [];
    }

    // filter out jira updates that don't match the branch filter
    const jiraUpdatesMap = jiraUpdates.docs
        .reduce<Map<string, JiraUpdate>>(
            (result, update) => {
                const {
                    branchFilterRegex,
                } = update.data();

                let skip = false;
                if (branchFilterRegex) {
                    const regex = new RegExp(branchFilterRegex);

                    if (!regex.test(branchName)) {
                        skip = true;
                    }
                }

                if (!skip) {
                    // use map to avoid notifications being sent out twice 
                    // (once because of status match and once because of fix-after-failure flag)
                    result.set(update.id, update.data());
                }

                return result;
            },
            new Map(),
        );

    return Array.from(jiraUpdatesMap.values());
}

