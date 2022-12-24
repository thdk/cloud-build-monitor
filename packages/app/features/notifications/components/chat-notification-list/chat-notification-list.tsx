import { Table, Tag } from "antd";
import { ColumnType } from "antd/lib/table";
import { BuildStatus, ChatNotification } from "../../../../collections/chat-notifications/types";
import { useChatNotifications } from "../../hooks/use-chat-notifications";
import antdStyles from "../../../../styles/antd.module.css";

const columns: ColumnType<ChatNotification>[] = [
    {
        title: 'Trigger',
        dataIndex: 'buildTrigger',
        width: 100,
    },
    {
        title: 'Statuses',
        dataIndex: 'statuses',
        render: (statuses: BuildStatus[]) => statuses?.map((s) => <Tag key={s}>{s}</Tag>),
        width: 100,
    },
    {
        title: 'Message',
        dataIndex: 'message',
        render: (text: string) => <code style={{ display: "block", alignContent: "center" }}>{text}</code>,
        width: 500,
    },
    
    {
        title: 'Branch filter',
        dataIndex: 'branchFilterRegex',
        width: 200,
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
