import { Button, Drawer, Space, Form } from "antd";
import { PageHeader } from "@ant-design/pro-components";
import { useFirestoreCrud } from "../../../../firebase/use-firestore-crud";
import { chatWebHookConverter, CHAT_WEBHOOK_COLLECTION, deleteChatWebhookUrl, newChatWebhookId, saveChatWebhookUrl } from "../../firestore"
import { ChatWebhookList } from "../chat-webhooks-list";
import { ChatWebhookForm, ChatWebhookFormFields } from "../chat-webhook-form";
import { useCallback } from "react";

const {
    useForm,
} = Form;

export const ChatWebhooksScreen = () => {
    const [form] = useForm();

    const {
        isActiveDocumentLoading,
        activeDocument,
        deleteDocument,
        updateDocument,
        createDocument,
        setActiveDocumentId,
    } = useFirestoreCrud({
        collectionPath: CHAT_WEBHOOK_COLLECTION,
        converter: chatWebHookConverter,
    });

    const saveNewWebhook = useCallback(
        ({ url, ...webhook }: ChatWebhookFormFields) => {
            const id = newChatWebhookId();
            createDocument(webhook, id);

            // save webhook url using the same id as the webhook document
            saveChatWebhookUrl(
                {
                    url,
                },
                id,
            );
        },
        [
            createDocument,
        ]
    );

    const updateWebHook = useCallback(
        ({ url, ...webhook }: ChatWebhookFormFields) => {
            updateDocument(webhook);

            if (url) {
                saveChatWebhookUrl(
                    {
                        url,
                    },
                    webhook.id,
                );
            }
        },
        [
            updateDocument,
        ],
    );

    const deleteWebhook = useCallback(
        () => {
            if (activeDocument) {
                deleteChatWebhookUrl(activeDocument?.id)
                deleteDocument();
            }
        },
        [
            activeDocument,
            deleteDocument,
        ],
    );

    return (
        <>
            <PageHeader
                className="site-page-header-responsive"
                title="Chat alerts"
                subTitle="webhooks"
                extra={[
                    <Button key="1" type="primary"
                        className="primary"
                        onClick={() => setActiveDocumentId(undefined)}>
                        New webhook
                    </Button>
                ]}
            >
            </PageHeader>
            <ChatWebhookList
                onClick={setActiveDocumentId}
            />

            <Drawer
                title={activeDocument ? "Edit chat alert" : "Add chat alert"}
                width={720}
                open={activeDocument !== null}
                onClose={() => setActiveDocumentId(null)}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                    <Space>
                        <Button onClick={deleteWebhook}>Delete</Button>
                        <Button onClick={() => {
                            setActiveDocumentId(null);
                        }}>Cancel</Button>
                        <Button onClick={() => {
                            form.submit();
                        }} type="primary"
                            className="primary"
                        >
                            Submit
                        </Button>
                    </Space>
                }
            >
                {!isActiveDocumentLoading && <ChatWebhookForm
                    form={form}
                    update={updateWebHook}
                    create={saveNewWebhook}
                    hook={activeDocument?.data()}
                />
                }
            </Drawer>
        </>
    );
};
