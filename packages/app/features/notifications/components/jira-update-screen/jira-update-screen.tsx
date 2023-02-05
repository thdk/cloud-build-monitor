import { Button, Drawer, Space, Form } from "antd";
import { PageHeader } from "@ant-design/pro-components";
import { useFirestoreCrud } from "../../../../firebase/use-firestore-crud";
import { JiraUpdateList } from "../jira-update-list";
import { JiraUpdateForm } from "../jira-update-form ";
import { jiraUpdateConverter, JIRA_UPDATES_COLLECTION } from "../../firestore/jira-updates";

const {
    useForm,
} = Form;

export const JiraUpdateScreen = () => {
    const [form] = useForm();

    const {
        isActiveDocumentLoading,
        activeDocument,
        deleteDocument,
        updateDocument,
        createDocument,
        setActiveDocumentId,
    } = useFirestoreCrud({
        collectionPath: JIRA_UPDATES_COLLECTION,
        converter: jiraUpdateConverter,
    });

    return (
        <>
            <PageHeader
                className="site-page-header-responsive"
                title="Jira updates"
                extra={[
                    <Button key="1" type="primary"
                        className="primary"
                        onClick={() => setActiveDocumentId(undefined)}>
                        New jira update
                    </Button>
                ]}
            >
            </PageHeader>
            <JiraUpdateList
                onClick={setActiveDocumentId}
            />

            <Drawer
                title={activeDocument ? "Edit jira update" : "Add jira update"}
                width={720}
                open={activeDocument !== null}
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
                {!isActiveDocumentLoading && <JiraUpdateForm
                    form={form}
                    update={updateDocument}
                    create={createDocument}
                    data={activeDocument
                        ? activeDocument.data()
                        // undefined = create new document; null = no document selected
                        : activeDocument
                    }
                />
                }
            </Drawer>
        </>
    );
};
