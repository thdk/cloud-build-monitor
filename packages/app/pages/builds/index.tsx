import { PageHeader } from "antd";
import { NextPage } from "next";
import { BuildList } from "../../components/build-list/build-list";
import { Layout } from "../../components/layout";

const BuildsPage: NextPage = () => {
    return (
        <Layout>
            <PageHeader
                title="Builds"
            />
            <BuildList />
        </Layout>
    );
};

export default BuildsPage;
