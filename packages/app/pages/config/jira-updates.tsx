import { NextPage } from "next";
import { Layout } from "../../components/layout";
import { JiraUpdateScreen } from "../../features/notifications/components/jira-update-screen";

const JiraUpdates: NextPage = () => {
    return (
        <Layout>
            <JiraUpdateScreen />
        </Layout>
    );
}

export default JiraUpdates;
