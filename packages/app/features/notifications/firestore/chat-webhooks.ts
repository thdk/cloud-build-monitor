import { collection, deleteDoc, doc, FirestoreDataConverter, getDoc, getDocs, getFirestore, QueryDocumentSnapshot, setDoc } from "firebase/firestore";
import { ChatWebhook, ChatWebhookUrl } from "../../../collections/chat-webhooks/types";

export const CHAT_WEBHOOK_COLLECTION = 'chat-webhooks';
// separate collection needed to store sensitive urls so we can have different firestore security rules for this collection
export const CHAT_WEBHOOK_URL_COLLECTION = 'chat-webhook-urls';

export const chatWebHookConverter: FirestoreDataConverter<ChatWebhook> = {
    toFirestore: ({
        ...appData
    }) => {
        delete (appData as any).id;

        return {
            ...appData,
        };
    },
    fromFirestore: (docData: QueryDocumentSnapshot<ChatWebhook>) => {
        const {
            ...rest
        } = docData.data();

        return {
            ...rest,
            id: docData.id,
        } as unknown as ChatWebhook;
    },
};

export const createGetAllChatWebhooksQuery = () => collection(getFirestore(), CHAT_WEBHOOK_COLLECTION);

export const getAllChatWebhooks = () => getDocs(createGetAllChatWebhooksQuery());

export const newChatWebhookId = () => doc(collection(getFirestore(), CHAT_WEBHOOK_COLLECTION)).id;

export const saveChatWebhookUrl = (data: ChatWebhookUrl, id: string) => setDoc(
    doc(
        collection(
            getFirestore(),
            CHAT_WEBHOOK_URL_COLLECTION,
        ),
        id,
    ),
    data,
)

export const deleteChatWebhookUrl = (id: string) => deleteDoc(
    doc(
        collection(
            getFirestore(),
            CHAT_WEBHOOK_URL_COLLECTION,
        ),
        id,
    )
);
