import { Button, Drawer, Space } from "antd";
import { PageHeader } from "@ant-design/pro-components";
import { Form } from "antd";
import { artifactConverter } from "../../collections/artifacts/firestore-converter";
import { BuildArtifactList } from "../../components/build-artifact-list";
import { BuildConfigForm } from "../../components/build-config-form";
import { useFirestoreCrud } from "../../firebase/use-firestore-crud";

const {
    useForm,
} = Form;

export const ArtifactScreen = () => {
    const [form] = useForm();

    const {
        isActiveDocumentLoading,
        activeDocument,
        deleteDocument,
        updateDocument,
        createDocument,
        setActiveDocumentId,
    } = useFirestoreCrud({
        collectionPath: "artifacts",
        converter: artifactConverter,
    });

    return (
        <>
            <PageHeader
                className="site-page-header-responsive"
                title="Artifact urls"
                extra={[
                    <Button key="1" type="primary" className="primary"
                        onClick={() => setActiveDocumentId(undefined)}>
                        New artifact url
                    </Button>
                ]}
            >
            </PageHeader>
            <BuildArtifactList
                onClick={setActiveDocumentId}
            />

            <Drawer
                title={activeDocument ? "Edit artifact url" : "Add artifact url"}
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
                {!isActiveDocumentLoading && <BuildConfigForm
                    form={form}
                    update={updateDocument}
                    create={createDocument}
                    artifact={activeDocument?.data()}
                />
                }
            </Drawer>
        </>
    );
};
