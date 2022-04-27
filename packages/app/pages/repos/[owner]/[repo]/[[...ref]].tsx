import { GetStaticPaths, GetStaticPropsContext, NextPage } from "next"
import React from "react";
import { CommitsList } from "../../../../components/commit-list";
import { Layout } from "../../../../components/layout";
import { getRepos } from "../../../../github/repos";
import { RepoProvider, useRepo } from "../../../../github/repo-context";
import { octokit } from "../../../../github/octocit";
import { PageHeader, Tabs } from "antd";
import { BuildList } from "../../../../components/build-list";

const {
    TabPane,
} = Tabs;

export const RepoPage: NextPage<{
    repo: string;
    owner: string;
}> = ({
    repo,
    owner,
}) => {
        return (
            <RepoProvider>
                <Layout>
                    <PageHeader
                        onBack={() => window.history.back()}
                        title={`${owner} / ${repo}`}
                    >

                    </PageHeader>
                    <div
                        className="mx-4 mb-8"
                    >

                        <Tabs
                            defaultActiveKey="commits"
                        >
                            <TabPane tab="Commits" key="commits" className="mt-4">
                                <CommitsList />

                            </TabPane>
                            <TabPane tab="Builds" key="builds" className="mt-4">
                                <BuildList />
                            </TabPane>
                        </Tabs>
                    </div>
                </Layout>
            </RepoProvider>
        );
    };

export const getStaticProps = async (context: GetStaticPropsContext<{
    ref?: string;
    repo: string;
    owner: string;
}>) => {
    const ref = context.params?.ref;
    const repo = context.params?.repo;
    const owner = context.params?.owner;

    if (!ref && repo && owner) {
        const gitRepo = await octokit.repos.get({
            owner,
            repo,
        });

        const defaultBranch = gitRepo.data.default_branch;

        return {
            redirect: {
                statusCode: 301, // permanent redirect
                destination: `/repos/${owner}/${repo}/${defaultBranch}`,
            },
        };
    }

    return {
        props: {
            repo,
            owner,
        },
    };
};

export const getStaticPaths: GetStaticPaths = async () => {
    const repos = await getRepos();
    return {
        paths: repos.map(({
            owner,
            name: repo,
        }) => ({
            params: {
                ref: ["master"],
                repo,
                owner,
            },
        })),
        fallback: true,
    };
};


export default RepoPage;
