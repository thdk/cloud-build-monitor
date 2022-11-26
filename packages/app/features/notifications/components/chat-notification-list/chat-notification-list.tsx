import { Table } from "antd";
import { ColumnType } from "antd/lib/table";
import { ChatNotification } from "../../../../collections/chat-notifications/types";
import { useChatNotifications } from "../../hooks/use-chat-notifications";

const columns: ColumnType<ChatNotification>[] = [
    {
        title: 'Trigger',
        dataIndex: 'buildTrigger',
        width: 200,
    },
    {
        title: 'Message',
        dataIndex: 'message',
        render: (text: string) => <span>{text}</span>,
        width: 600,
    },
    {
        title: 'Webhook url',
        dataIndex: 'webhookUrl',
        width: 320,
    },
];

export const ChatNotificationList = ({
    onClick,
}: {
    onClick: (id: string) => void;
}) => {
    const [data, isLoading] = useChatNotifications();

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
