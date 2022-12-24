import { initializeApp, applicationDefault,  } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

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
