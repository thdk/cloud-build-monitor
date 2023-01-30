import { collection, FirestoreDataConverter, getDocs, getFirestore, orderBy, query, QueryDocumentSnapshot } from "firebase/firestore";
import { ChatNotification } from "../../../collections/chat-notifications/types";

export const CHAT_NOTIFICATION_COLLECTION = 'chat-notifications';

export const chatNotificationConverter: FirestoreDataConverter<ChatNotification> = {
    toFirestore: (appData) => {
        delete (appData as any).id;

        if (appData.threadKey === undefined) delete appData.threadKey;
        if (appData.branchFilterRegex === undefined) delete appData.branchFilterRegex;
        if (appData.description === undefined) delete appData.description;
        if (appData.statuses === undefined) delete appData.statuses;

        return appData;
    },
    fromFirestore: (docData: QueryDocumentSnapshot<ChatNotification>) => {
        const {
            webhooks = [],
            ...rest
        } = docData.data();

        return {
            ...rest,
            webhooks,
            id: docData.id,
        } as unknown as ChatNotification;
    },
};

export const createGetAllChatNotificationsQuery = () => query(
    collection(getFirestore(), CHAT_NOTIFICATION_COLLECTION),
    orderBy("name"),
);

export const getAllChatNotifications = () => getDocs(createGetAllChatNotificationsQuery());
