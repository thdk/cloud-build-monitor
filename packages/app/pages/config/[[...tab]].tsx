import { Settings, Build } from "@mui/icons-material";
import { Menu } from "antd";
import type { MenuProps } from 'antd';
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Layout } from "../../components/layout";
import { ConfigScreen } from "../../features/configs";
import { ArtifactScreen } from "../../components/artifact-screen/artifact-screen";

const items: MenuProps['items'] = [
    {
        label: 'Builds',
        key: 'builds',
        icon: <Build />,
    },
    {
        label: 'General',
        key: 'general',
        icon: <Settings />,
    },
];

const ConfigPage: NextPage<{ tab: string }> = ({
    tab,
}) => {

    const { pathname, query, replace } = useRouter();
    const [current, setCurrent] = useState(tab);

    const onClick: MenuProps['onClick'] = e => {
        replace({
            pathname,
            query: {
                ...query,
                tab: e.key,
            },
        });
    };

    useEffect(() => {
        setCurrent(tab);
    }, [tab])

    return (
        <Layout>
            <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
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
