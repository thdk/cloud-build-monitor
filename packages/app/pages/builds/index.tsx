import { NextPage } from "next";
import { BuildList } from "../../components/build-list/build-list";
import { Layout } from "../../components/layout";

const BuildsPage: NextPage = () => {
    return (
        <Layout>
            <BuildList />
        </Layout>
    );
};

export default BuildsPage;
