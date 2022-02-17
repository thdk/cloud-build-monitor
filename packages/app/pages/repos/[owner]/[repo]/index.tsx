import { GetStaticProps } from "next"
import { Commits } from "../../../../github/types";
import { octokit } from "../../../../github/octocit";
import { getCommitsWithIssue } from "../../../../utils/get-commits-with-issue";
import RepoPage from "./[ref]";
import { getTagsGroupedByCommitSha } from "../../../../github/tags";

type Props = {
    commits: Commits,
};

export const getServerSideProps: GetStaticProps<Props> = async (context) => {
    const repo = context.params?.repo;
    const owner = context.params?.owner;
    const searchRepo = Array.isArray(repo) ? repo[0] : repo;
    const searchOwner = Array.isArray(owner) ? owner[0] : owner;

    const repoData = await octokit.repos.get({
        owner: searchOwner!,
        repo: searchRepo!,
    })

    const commitsWithIssueInfo = (searchOwner && searchRepo)
        ? await getCommitsWithIssue({
            ref: repoData.data.default_branch,
            repo: searchRepo,
            owner: searchOwner,
        })
        : [];

    const tags = (searchOwner && searchRepo)
        ? await getTagsGroupedByCommitSha({
            repo: searchRepo,
            owner: searchOwner,
        })
        : {};

    return {
        props: {
            tags,
            commits: commitsWithIssueInfo,
            repoRef: repoData.data.default_branch,
            repo: searchRepo,
            owner: searchOwner,
        },
    };
};

export default RepoPage;
