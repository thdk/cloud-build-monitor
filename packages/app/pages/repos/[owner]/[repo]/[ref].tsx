import { GetServerSideProps, NextPage } from "next"
import React from "react";
import { CommitsList } from "../../../../components/commit-list";
import { Commits } from "../../../../components/commit-list/types";
import { Layout } from "../../../../components/layout";
import { RepoContext } from "../../../../components/repo-provider";
import { getCommitsWithIssue } from "../../../../utils/get-commits-with-issue";

type Props = {
    commits: Commits,
    repoRef?: string;
    repo?: string;
    owner?: string;
};

export const RepoPage: NextPage<Props> = ({
    commits,
    repoRef,
    repo,
    owner,
}) => {
    return (
        <RepoContext.Provider value={{
            ref: repoRef,
            repo,
            owner,
        }}>
            <Layout>
                <CommitsList
                    commits={commits}
                />
            </Layout>
        </RepoContext.Provider>
    );
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
    const ref = context.params?.ref;
    const repo = context.params?.repo;
    const owner = context.params?.owner;
    const searchRef = Array.isArray(ref) ? ref[0] : ref;
    const searchRepo = Array.isArray(repo) ? repo[0] : repo;
    const searchOwner = Array.isArray(owner) ? owner[0] : owner;


    const commitsWithIssueInfo = (searchOwner && searchRef && searchRepo)
        ? await getCommitsWithIssue({
            ref: searchRef,
            repo: searchRepo,
            owner: searchOwner,
        })
        : [];

    return {
        props: {
            commits: commitsWithIssueInfo,
            repoRef: searchRef,
            repo: searchRepo,
            owner: searchOwner,
        },
    };
};


export default RepoPage;
