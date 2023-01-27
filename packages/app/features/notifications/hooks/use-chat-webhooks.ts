import { useCollectionData } from "react-firebase-hooks/firestore";
import { ChatWebhook } from "../../../collections/chat-webhooks/types";
import { chatWebHookConverter, createGetAllChatWebhooksQuery } from "../firestore";

export const useChatWebhooks = () => {

    return useCollectionData<ChatWebhook>(
        createGetAllChatWebhooksQuery()
            .withConverter(chatWebHookConverter),
    );
};
