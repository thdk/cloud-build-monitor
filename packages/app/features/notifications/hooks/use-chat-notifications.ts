import { useCollectionData } from "react-firebase-hooks/firestore";
import { ChatNotification } from "../../../collections/chat-notifications/types";
import { chatNotificationConverter, createGetAllChatNotificationsQuery } from "../firestore";

export const useChatNotifications = () => {

    return useCollectionData<ChatNotification>(
        createGetAllChatNotificationsQuery()
            .withConverter(chatNotificationConverter),
    );
};
