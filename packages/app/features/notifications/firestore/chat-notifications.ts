import { collection, FirestoreDataConverter, getDocs, getFirestore, QueryDocumentSnapshot } from "firebase/firestore";
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
            ...rest
        } = docData.data();

        return {
            ...rest,
            id: docData.id,
        } as unknown as ChatNotification;
    },
};

export const createGetAllChatNotificationsQuery = () => collection(getFirestore(), CHAT_NOTIFICATION_COLLECTION);

export const getAllChatNotifications = () => getDocs(createGetAllChatNotificationsQuery());
