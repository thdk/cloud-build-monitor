import { GetStaticPaths, GetStaticPropsContext, NextPage } from "next"
import React from "react";
import { CommitsList } from "../../../../components/commit-list";
import { Layout } from "../../../../components/layout";
import { getAllTags } from "../../../../github/tags";
import { getRepos } from "../../../../github/repos";
import { dehydrate, QueryClient } from "react-query";
import { RepoProvider } from "../../../../github/repo-context";
import { octokit } from "../../../../github/octocit";
import { getCommits } from "../../../../github/commits";

export const RepoPage: NextPage = () => {
    return (
        <RepoProvider>
            <Layout>
                <CommitsList />
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

    const queryClient = new QueryClient()

    await Promise.all([
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
            () => getCommits({
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
