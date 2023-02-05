import { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { db } from '../common/init-firebase';
import { ChatNotification, ChatNotificationFirestoreData, ChatWebhook, CICCDBuild } from './interfaces';

const chatNotificationConverter: FirebaseFirestore.FirestoreDataConverter<ChatNotification> = {
    toFirestore: (v: ChatNotification) => v,
    fromFirestore: (docData: QueryDocumentSnapshot<ChatNotificationFirestoreData>) => {
        const {
            threadKey,
            ...rest
        } = docData.data();

        return {
            threadKey: threadKey || undefined,
            ...rest,
        };
    },
};

export async function getChatNotifications(
    trigger: string,
    status: string,
    branchName: string,
    commitSha: string,
    githubRepoOwner: string,
    repo: string,
    currentBuildId: string,
) {
    const chatNotificationsCollectionRef = db.collection('chat-notifications');

    const [notifications, notificationsFixAfterFailure] = await Promise.all([
        // do we have notifications for this trigger?
        chatNotificationsCollectionRef
            // todo: also filter on git repo? (maybe similar to branchRegex filter?)
            .where(
                "buildTrigger",
                "==",
                trigger,
            )
            .where("statuses", "array-contains", status)
            .withConverter<ChatNotification>(chatNotificationConverter)
            .get(),

        // do we have 'notify fix after failure' notifications? (only need to fetch if current status is success)
        status === "success"
            ? chatNotificationsCollectionRef
                // todo: also filter on git repo? (maybe similar to branchRegex filter?)
                .where(
                    "buildTrigger",
                    "==",
                    trigger,
                )
                .where("notifyFix", "==", "add")
                .withConverter<ChatNotification>(chatNotificationConverter)
                .get()
                .then(async (chatNotificationsFixAfterFailure) => {
                    // only get the previous build info if we have we have notifications that rely on it
                    if (chatNotificationsFixAfterFailure.size) {
                        const isStatusSuccessAfterPreviousBuildFailed = (
                            await getPreviousBuild({
                                commitSha,
                                branch: branchName,
                                repo,
                                repoOwner: githubRepoOwner,
                                currentBuildId,
                                trigger,
                            }).catch((error) => {
                                console.error(`Failed to fetch previous build for branch ${branchName} and ${commitSha} in ${githubRepoOwner}/${repo}`);
                                console.error(error);
                                return undefined;
                            })
                        )?.status === "failure";

                        return isStatusSuccessAfterPreviousBuildFailed
                            ? chatNotificationsFixAfterFailure
                            : undefined;
                    }

                })
            : undefined
    ]);

    if (!notifications.size && !notificationsFixAfterFailure?.size) {
        return [];
    }

    // filter out notification that don't match the branch filter
    const notificationMap = [...notifications.docs, ...(notificationsFixAfterFailure?.docs || [])]
        .reduce<Map<string, QueryDocumentSnapshot<ChatNotification>>>(
            (result, notification) => {
                const {
                    branchFilterRegex,
                } = notification.data();

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
                    result.set(notification.id, notification);
                }

                return result;
            },
            new Map(),
        );

    return Array.from(notificationMap.values());
}

export async function getWebhooksByIds(webhookIds: string[]) {
    return Promise.all(
        webhookIds.map(async (id) => {
            const doc = await db.collection('chat-webhook-urls')
                .doc(id)
                .get();

            return doc.exists
                ? doc.data() as ChatWebhook
                : undefined;
        }),
    );
}

export async function getPreviousBuild({
    commitSha,
    branch,
    trigger,
    currentBuildId,
    repo,
    repoOwner,
}: {
    commitSha: string;
    currentBuildId: string;
    branch: string;
    trigger: string;
    repo: string;
    repoOwner: string;
}) {
    // rebuild triggered for same commit sha?
    const recentBuildsWithSameSha = await db.collection('builds')
        .where('commitSha', '==', commitSha)
        .where('name', '==', trigger)
        .where('repo', '==', repo)
        .where('githubRepoOwner', '==', repoOwner)
        .orderBy('created', 'desc')
        .limit(2)
        .get()
        .catch((error) => {
            console.error("Failed to get recents builds with same commit sha.");
            throw error;
        });

    // filter the current build from the results
    let previousBuild = (recentBuildsWithSameSha.docs
        .reverse()
        .filter((doc) => doc.data().id !== currentBuildId)[0])?.data() as CICCDBuild | undefined;

    if (previousBuild) {
        console.log(`Found build with same commit sha as current build:`);
        console.log({
            previousBuild,
        })
        return previousBuild;
    }

    // last build on same branch?
    const recentBuildsWithSameBranch = await db.collection('builds')
        .where('branchName', '==', branch)
        .where('name', '==', trigger)
        .where('repo', '==', repo)
        .where('githubRepoOwner', '==', repoOwner)
        .orderBy('created', 'desc')
        .limit(2)
        .get()
        .catch((error) => {
            console.error("Failed to get recents builds with same branch name.");
            throw error;
        });

    // filter the current build from the results
    previousBuild = (recentBuildsWithSameBranch.docs
        .reverse()
        .filter((doc) => doc.data().id !== currentBuildId)[0])?.data() as CICCDBuild | undefined;

    if (previousBuild) {
        console.log(`Found build with same branch as current build:`);
        console.log({
            previousBuild,
        })
    }

    return previousBuild;

}
