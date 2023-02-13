import { collection, deleteField, FirestoreDataConverter, getDocs, getFirestore, orderBy, query, QueryDocumentSnapshot } from "firebase/firestore";
import { ChatNotification } from "../../../collections/chat-notifications/types";

export const CHAT_NOTIFICATION_COLLECTION = 'chat-notifications';

export const chatNotificationConverter: FirestoreDataConverter<ChatNotification> = {
    toFirestore: ({
        id,
        ...appData
    }) => {
        if (id && !appData.notifyFix) appData.notifyFix = deleteField();
        if (!id && !appData.notifyFix) delete appData.notifyFix;

        if (appData.threadKey === undefined) delete appData.threadKey;
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
        };
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
    orderBy("name_case_insensitive"),
);

export const getAllChatNotifications = () => getDocs(createGetAllChatNotificationsQuery());
