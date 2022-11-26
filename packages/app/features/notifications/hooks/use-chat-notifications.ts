import { useCollectionData } from "react-firebase-hooks/firestore";
import { chatNotificationConverter, getAllChatNotificationsQuery } from "../firestore";

export const useChatNotifications = () => {

    return useCollectionData(
        getAllChatNotificationsQuery
            .withConverter(chatNotificationConverter),
    );
};
