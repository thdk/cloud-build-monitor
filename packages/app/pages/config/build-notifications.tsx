import { Tabs, TabsProps } from "antd";
import { NextPage } from "next";
import { Layout } from "../../components/layout";
import { ChatNotificationScreen } from "../../features/notifications/components/chat-notification-screen";
import { ChatWebhooksScreen } from "../../features/notifications/components/chat-webhooks-screen";

const items: TabsProps['items'] = [
    {
        key: 'messages',
        label: `Messages`,
        children: <ChatNotificationScreen />,
    },
    {
        key: 'webhooks',
        label: `Webhooks`,
        children: <ChatWebhooksScreen />,
    },
];

const BuildNotifications: NextPage = () => {
    return (
        <Layout>
            <Tabs
                defaultActiveKey="1"
                items={items}
                tabPosition="left"
                style={{
                    marginTop: "2em",
                }}
            />
        </Layout>
    );
}

export default BuildNotifications;
