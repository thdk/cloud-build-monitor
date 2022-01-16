import { NextPage } from "next";
import { BuildList } from "../../components/build-list/build-list";

const BuildsPage: NextPage = () => {
    return(
        <BuildList />
    );
};

export async function getServerSideProps() {}

export default BuildsPage;
