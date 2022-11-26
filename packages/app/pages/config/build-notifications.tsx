import { NextPage } from "next";
import { Layout } from "../../components/layout";
import { ChatNotificationScreen } from "../../features/notifications/components/chat-notification-screen";

const BuildNotifications: NextPage = () => {
    return (
        <Layout>
            <ChatNotificationScreen />
        </Layout>
    );
}

export default BuildNotifications;
