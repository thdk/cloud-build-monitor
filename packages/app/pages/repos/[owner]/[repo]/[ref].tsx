import { GetServerSideProps, NextPage } from "next"
import React from "react";
import { CommitsList } from "../../../../components/commit-list";
import { Commits } from "../../../../github/types";
import { Layout } from "../../../../components/layout";
import { RepoContext } from "../../../../components/repo-provider";
import { getTagsGroupedByCommitSha, TagsDictionary } from "../../../../github/tags";
import { getCommitsWithIssue } from "../../../../utils/get-commits-with-issue";

type Props = {
    commits: Commits,
    repoRef?: string;
    repo?: string;
    owner?: string;
    tags: TagsDictionary;
};

export const RepoPage: NextPage<Props> = ({
    commits,
    repoRef,
    repo,
    owner,
    tags,
}) => {
    return (
        <RepoContext.Provider value={{
            ref: repoRef,
            repo,
            owner,
            tagDictionary: tags,
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

    const tags = (searchOwner && searchRef && searchRepo)
        ? await getTagsGroupedByCommitSha({
            repo: searchRepo,
            owner: searchOwner,
        })
        : {};

    return {
        props: {
            commits: commitsWithIssueInfo,
            tags,
            repoRef: searchRef,
            repo: searchRepo,
            owner: searchOwner,
        },
    };
};


export default RepoPage;
