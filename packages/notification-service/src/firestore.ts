import { initializeApp, applicationDefault, } from 'firebase-admin/app';
import { getFirestore, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { ChatNotification, ChatNotificationFirestoreData, ChatWebhook } from './interfaces';

initializeApp(
    {
        credential: applicationDefault(),
    }
);

const db = getFirestore();

export async function getChatNotifications(
    trigger: string,
    status: string,
    branchName: string,
) {
    const chatNotificationsCollectionRef = db.collection('chat-notifications');

    const chatNotificationsForBuild = await chatNotificationsCollectionRef
        .where(
            "buildTrigger",
            "==",
            trigger,
        )
        .where("statuses", "array-contains", status)
        .withConverter<ChatNotification>(({
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
        }))
        .get();

    if (!chatNotificationsForBuild.size) {
        return [];
    }

    // filter out notification that don't match the branch filter
    return chatNotificationsForBuild.docs.filter(
        (notification) => {
            const {
                branchFilterRegex,
            } = notification.data();

            if (!branchFilterRegex) {
                return true;
            }

            const regex = new RegExp(branchFilterRegex);

            return regex.test(branchName);
        }
    )
}

export async function getWebhooksByIds(webhookIds: string[]) {
    return Promise.all(
        webhookIds.map(async (id) => {
            const doc = await db.collection('chat-webhook-urls')
                .doc(id)
                .get();

            return doc.data() as ChatWebhook;
        }),
    );
}
