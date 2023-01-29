import { Table, Tag } from "antd";
import { ColumnType } from "antd/lib/table";
import { BuildStatus, ChatNotification } from "../../../../collections/chat-notifications/types";
import { useChatNotifications } from "../../hooks/use-chat-notifications";
import antdStyles from "../../../../styles/antd.module.css";

const columns: ColumnType<ChatNotification>[] = [
    {
        title: 'Name',
        dataIndex: 'name',
        width: 100,
    },
    {
        title: 'Trigger',
        dataIndex: 'buildTrigger',
        width: 100,
    },
    {
        title: 'Description',
        dataIndex: 'description',
        width: 250,
        responsive: [
            "xs"
        ]
    },
    {
        title: 'Statuses',
        dataIndex: 'statuses',
        render: (statuses: BuildStatus[]) => statuses?.map((s) => <Tag key={s}>{s}</Tag>),
        width: 100,
        responsive: [
            "md",
        ]
    },
    {
        title: 'Message',
        dataIndex: 'message',
        render: (text: string) => <code style={{ display: "block", alignContent: "center" }}>{text}</code>,
        width: 500,
        responsive: [
            'lg',
        ]
    },

    {
        title: 'Branch filter',
        dataIndex: 'branchFilterRegex',
        width: 200,
        responsive: [
            'lg',
        ]
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
                        onClick: () => {
                            const selection = window.getSelection();
                            if (selection?.toString().length === 0) {
                                onClick(record.id);
                            }
                        },
                    };
                }}
                rowKey="id"
            />
        )
        : null;
};
