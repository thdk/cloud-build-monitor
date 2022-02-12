import { GetStaticProps, NextPage } from "next";
import { Layout } from "../../components/layout";
import { RepoList } from "../../components/repo-list";
import { octokit } from "../../github/octocit";

export type Repo = {
    name: string;
    owner: string;
}

type Props = {
    repos: Repo[],
};

const ReposPage: NextPage<Props> = ({
    repos,
}) => {

    return (
        <Layout>
            <RepoList
                repos={repos}
            />
        </Layout>
    );
};

export const getStaticProps: GetStaticProps<Props> = async () => {


    const repos = await octokit.repos.listForAuthenticatedUser({
        type: "owner"
    });

    return {
        props: {
            repos: repos.data.map((repo) => ({
                owner: repo.owner.login,
                name: repo.name,
            })),
        }
    }
}

export default ReposPage;
