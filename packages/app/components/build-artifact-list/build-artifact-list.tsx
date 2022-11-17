import { Table, Row, Col } from "antd";
import { ColumnType } from "antd/lib/table";
import { collection, getFirestore } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { artifactConverter } from "../../collections/artifacts/firestore-converter";
import { BuildArtifact } from "../../collections/artifacts/types";


const columns: ColumnType<BuildArtifact>[] = [
    {
        title: 'Name',
        dataIndex: 'triggerName',
        render: (text: string) => <a>{text}</a>,
        width: 200,
    },
    {
        title: 'Title',
        dataIndex: 'title',
        width: 320,
    },
    {
        title: 'Url',
        dataIndex: 'artifactUrl',
    },
];

export const BuildArtifactList = ({
    onClick,
}: {
    onClick: (id: string) => void;
}) => {
    const [data] = useCollectionData(
        collection(getFirestore(), "artifacts")
            .withConverter<BuildArtifact>(artifactConverter),
    );

    return (

        <Table
            className="m-4"
            size="large"
            columns={columns}
            dataSource={data}
            pagination={{
                hideOnSinglePage: true,
            }}
            onRow={(record, rowIndex) => {
                return {
                    onClick: () => onClick(record.id),
                };
            }}
            rowKey="id"
        />
    )
};
