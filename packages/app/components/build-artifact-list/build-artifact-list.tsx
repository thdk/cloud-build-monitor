import { Table, Row, Col } from "antd";
import { ColumnType } from "antd/lib/table";
import { collection } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { artifactConverter } from "../../collections/artifacts/firestore-converter";
import { BuildArtifact } from "../../collections/artifacts/types";
import { firestore } from "../../firebase/init-firebase";


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
        collection(firestore, "artifacts")
            .withConverter<BuildArtifact>(artifactConverter),
    );

    return (

        <Table
            size="large"
            columns={columns}
            dataSource={data}
            pagination={{
                hideOnSinglePage: true,
            }}
            onRow={(record, rowIndex) => {
                return {
                    onClick: () => onClick(record.key),
                };
            }}
        />
    )
};
