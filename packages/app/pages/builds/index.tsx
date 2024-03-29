import { PageHeader } from "@ant-design/pro-components";
import { NextPage } from "next";
import { BuildList } from "../../components/build-list/build-list";
import { Layout } from "../../components/layout";

const BuildsPage: NextPage = () => {
    return (
        <Layout>
            <PageHeader
                title="Builds"
            />
            <div
                style={{
                    padding: "1em"
                }}
            >
                <BuildList />
            </div>
        </Layout>
    );
};

export default BuildsPage;
