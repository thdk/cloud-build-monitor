import { GetStaticProps, NextPage } from "next";
import { Layout } from "../../components/layout";
import { RepoList } from "../../components/repo-list";
import { getRepos } from "../../github/repos";
import { dehydrate, QueryClient, useQuery } from 'react-query';



export type Repo = {
    name: string;
    owner: string;
}


const ReposPage: NextPage = () => {

    return (
        <Layout>
            <RepoList />
        </Layout>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    const queryClient = new QueryClient()

    await queryClient.prefetchQuery('repos', getRepos);

    return {
        props: {
            dehydratedState: dehydrate(queryClient),
        },
    };
}

export default ReposPage;
