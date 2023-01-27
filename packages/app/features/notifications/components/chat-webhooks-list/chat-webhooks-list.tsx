import { Table, Tag } from "antd";
import { ColumnType } from "antd/lib/table";
import antdStyles from "../../../../styles/antd.module.css";
import { ChatWebhook } from "../../../../collections/chat-webhooks/types";
import { useChatWebhooks } from "../../hooks/use-chat-webhooks";

const columns: ColumnType<ChatWebhook>[] = [
    {
        title: 'Name',
        dataIndex: 'name',
        width: 100,
    },
];

export const ChatWebhookList = ({
    onClick,
}: {
    onClick: (id: string) => void;
}) => {
    const [data, isLoading] = useChatWebhooks();

    return !isLoading
        ? (

            <Table
                rowClassName={antdStyles.tableRowInteractive}
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
