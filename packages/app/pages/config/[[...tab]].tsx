import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { Layout } from "../../components/layout";
import { ConfigScreen } from "../../features/configs";
import { ArtifactScreen } from "../../components/artifact-screen/artifact-screen";

const ConfigPage: NextPage<{ tab: string }> = ({
    tab,
}) => {
    return (
        <Layout>
           
            {
                tab === "builds"
                    ? <ArtifactScreen />
                    : <ConfigScreen />
            }
        </Layout>
    );
}

export const getStaticProps: GetStaticProps = ({ params: { tab } = {} }) => {

    if (!tab?.length) {
        return {
            redirect: {
                statusCode: 301,
                destination: "/config/general",
            }
        }
    }
    return {
        props: {
            tab: tab[0],
        }
    };
};

export const getStaticPaths: GetStaticPaths<{ tab?: string[] }> = () => {
    return {
        paths: [
            { params: { tab: ["builds"] } },
            { params: { tab: ["general"] } },
        ],
        fallback: true,
    }
};

export default ConfigPage;
