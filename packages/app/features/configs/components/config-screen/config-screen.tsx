import { Button, Drawer, Space } from "antd";
import { PageHeader } from "@ant-design/pro-components";
import { Form } from "antd";
import { useFirestoreCrud } from "../../../../firebase/use-firestore-crud";
import { configConverter, CONFIG_COLLECTION } from "../../firestore";
import { ConfigForm } from "../config-form";
import { ConfigList } from "../config-list";

const {
    useForm,
} = Form;

export const ConfigScreen = () => {
    const [form] = useForm();

    const {
        isActiveDocumentLoading,
        activeDocument,
        deleteDocument,
        updateDocument,
        createDocument,
        setActiveDocumentId,
    } = useFirestoreCrud({
        collectionPath: CONFIG_COLLECTION,
        converter: configConverter,
    });

    return (
        <>
            <PageHeader
                className="site-page-header-responsive"
                title="Configuration"
                extra={[
                    <Button key="1" type="primary"
                        onClick={() => setActiveDocumentId(undefined)}>
                        New config
                    </Button>
                ]}
            >
            </PageHeader>
            <ConfigList
                onClick={setActiveDocumentId}
            />

            <Drawer
                title={activeDocument ? "Edit config" : "Add config"}
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
                {!isActiveDocumentLoading && <ConfigForm
                    form={form}
                    update={updateDocument}
                    create={createDocument}
                    config={activeDocument?.data()}
                />
                }
            </Drawer>
        </>
    );
};
