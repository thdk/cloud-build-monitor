import { GetStaticPaths, GetStaticPropsContext, NextPage } from "next"
import React from "react";
import { CommitsList } from "../../../../../components/commit-list";
import { Layout } from "../../../../../components/layout";
import { RepoProvider } from "../../../../../github/repo-context";
import { Tabs } from "antd";
import { PageHeader } from "@ant-design/pro-components";
import { BuildList } from "../../../../../components/build-list";
import { useRouter } from "next/router";
import { createOctokit } from "../../../../../github/octokit";

const {
    TabPane,
} = Tabs;

export const RepoPage: NextPage<{
    repo: string;
    owner: string;
    tab: string;
}> = ({
    repo,
    owner,
    tab,
}) => {

        const {
            pathname,
            query,
            replace,
        } = useRouter();

        return (
            <RepoProvider>
                <Layout>
                    <PageHeader
                        onBack={() => window.history.back()}
                        title={ owner && repo ? `${owner} / ${repo}` : "/"}
                        footer={
                            <Tabs
                                activeKey={tab}
                                size="large"
                                onChange={(value) => replace({
                                    pathname,
                                    query: {
                                        ...query,
                                        tab: value,
                                    },
                                })}
                            >
                                <TabPane tab="Commits" key="commits" />
                                <TabPane tab="Builds" key="builds" />
                            </Tabs>
                        }
                    >

                    </PageHeader>
                    <div
                        className="mx-4 mb-8"
                    >
                        {
                            tab === "commits" && (
                                <CommitsList />
                            )
                        }

                        {
                            tab === "builds" && (
                                <BuildList />
                            )
                        }

                    </div>
                </Layout>
            </RepoProvider>
        );
    };

export const getStaticProps = async (context: GetStaticPropsContext<{
    ref?: string;
    repo: string;
    owner: string;
    tab?: "commits" | "builds";
}>) => {
    const ref = context.params?.ref;
    const repo = context.params?.repo;
    const owner = context.params?.owner;
    const tab = context.params?.tab || "commits";

    const octokit = createOctokit();
    if (!ref && repo && owner) {
        const gitRepo = await octokit.repos.get({
            owner,
            repo,
        });

        const defaultBranch = ref || gitRepo.data.default_branch;

        return {
            redirect: {
                statusCode: 301, // permanent redirect
                destination: `/repos/${owner}/${repo}/${tab || "commits"}/${defaultBranch}`,
            },
        };
    }

    return {
        props: {
            repo,
            owner,
            tab,
        },
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: true,
    };
};

export default RepoPage;
