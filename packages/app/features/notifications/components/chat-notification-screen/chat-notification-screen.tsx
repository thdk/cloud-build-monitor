import { Button, Drawer, Space, Form } from "antd";
import { PageHeader } from "@ant-design/pro-components";
import { useFirestoreCrud } from "../../../../firebase/use-firestore-crud";
import { chatNotificationConverter, CHAT_NOTIFICATION_COLLECTION } from "../../firestore"
import { ChatNotificationForm } from "../chat-notification-form";
import { ChatNotificationList } from "../chat-notification-list";

const {
    useForm,
} = Form;

export const ChatNotificationScreen = () => {
    const [form] = useForm();

    const {
        isActiveDocumentLoading,
        activeDocument,
        deleteDocument,
        updateDocument,
        createDocument,
        setActiveDocumentId,
    } = useFirestoreCrud({
        collectionPath: CHAT_NOTIFICATION_COLLECTION,
        converter: chatNotificationConverter,
    });

    return (
        <>
            <PageHeader
                className="site-page-header-responsive"
                title="Chat alerts"
                extra={[
                    <Button key="1" type="primary"
                    className="primary"
                        onClick={() => setActiveDocumentId(undefined)}>
                        New chat alert
                    </Button>
                ]}
            >
                <div>
                    <p>
                        Configure google chat alerts for your CI/CD pipelines.
                    </p>
                   
                </div>
            </PageHeader>
            <ChatNotificationList
                onClick={setActiveDocumentId}
            />

            <Drawer
                title={activeDocument ? "Edit chat alert" : "Add chat alert"}
                width={720}
                visible={activeDocument !== null}
                onClose={() => setActiveDocumentId(null)}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                    <Space>
                        <Button onClick={() => {
                            deleteDocument();
                        }}>Delete</Button>
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
                {!isActiveDocumentLoading && <ChatNotificationForm
                    form={form}
                    update={updateDocument}
                    create={createDocument}
                    notification={activeDocument?.data()}
                />
                }
            </Drawer>
        </>
    );
};
