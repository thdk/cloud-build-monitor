import { GetStaticPaths, GetStaticPropsContext, NextPage } from "next"
import React from "react";
import { CommitsList } from "../../../../components/commit-list";
import { Layout } from "../../../../components/layout";
import { getAllTags } from "../../../../github/tags";
import { getCommitsWithIssue } from "../../../../utils/get-commits-with-issue";
import { getRepos } from "../../../../github/repos";
import { dehydrate, QueryClient } from "react-query";

export const RepoPage: NextPage = () => {
    return (
        <Layout>
            <CommitsList />
        </Layout>
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

    const queryClient = new QueryClient()

    await Promise.all([
        queryClient.prefetchQuery('repos', getRepos),
        queryClient.prefetchQuery(
            [
                'tags',
                owner,
                repo,
            ],
            () => getAllTags({
                owner,
                repo,
            }),
        ),
        queryClient.prefetchQuery(
            [
                'commits-issues',
                owner,
                repo,
            ],
            () => getCommitsWithIssue({
                ref,
                repo,
                owner,
            }),
        ),
    ]);

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
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
