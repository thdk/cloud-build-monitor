import { initializeApp, applicationDefault,  } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp(
    {
        credential: applicationDefault(),
    }
);

const db = getFirestore();

export async function getChatNotification(
    trigger: string,
    status: string,
) {
    const chatNotificationsCollectionRef = db.collection('chat-notifications');

    const chatNotificationsForBuild = await chatNotificationsCollectionRef
        .where(
            "buildTrigger",
            "==",
            trigger,
        )
        .where("statuses", "array-contains", status)
        .get();

    return chatNotificationsForBuild;
}