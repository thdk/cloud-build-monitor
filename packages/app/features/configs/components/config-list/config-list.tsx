import { Table } from "antd";
import { ColumnType } from "antd/lib/table";
import { useConfigs } from "../../hooks/use-configs";
import { Config } from "../../types";

const columns: ColumnType<Config>[] = [
    {
        title: 'Key',
        dataIndex: 'id',
        width: 200,
    },
    {
        title: 'Value',
        dataIndex: 'value',
        width: 320,
    },
    {
        title: 'Section',
        dataIndex: 'section',
    },
];

export const ConfigList = ({
    onClick,
}: {
    onClick: (id: string) => void;
}) => {
    const [data, isLoading] = useConfigs();

    return !isLoading
        ? (

            <Table
                className="m-4"
                size="large"
                columns={columns}
                dataSource={data}
                pagination={{
                    hideOnSinglePage: true,
                }}
                onRow={(record) => {
                    return {
                        onClick: () => onClick(record.id),
                    };
                }}
                rowKey="id"
            />
        )
        : null;
};
