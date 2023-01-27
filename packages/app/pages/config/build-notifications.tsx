import { Tabs, TabsProps } from "antd";
import { NextPage } from "next";
import { Layout } from "../../components/layout";
import { ChatNotificationScreen } from "../../features/notifications/components/chat-notification-screen";
import { GoogleChatWebhooksScreen } from "../../features/notifications/components/google-chat-webhooks-screen";

const items: TabsProps['items'] = [
    {
        key: 'messages',
        label: `Messages`,
        children: <ChatNotificationScreen />,
    },
    {
        key: 'webhooks',
        label: `Webhooks`,
        children: <GoogleChatWebhooksScreen />,
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
