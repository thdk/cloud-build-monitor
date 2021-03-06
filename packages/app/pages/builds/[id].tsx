import { doc, getFirestore } from "firebase/firestore";
import { useRouter } from "next/router";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { BuildDetail } from "../../components/build-detail";
import { Layout } from "../../components/layout";
import { CICCDBuildConverter } from "../../interfaces/build";

export default function BuildDetails() {
    const {
        query,
    } = useRouter();

    const id = Array.isArray(query.id)
        ? query.id[0]
        : query.id;


    const [docData] = useDocumentData(
        id
            ? doc(getFirestore(), `builds/${id}`)
                .withConverter(CICCDBuildConverter)
            : null
    );

    return docData
        ? (
            <Layout>
                <BuildDetail
                    build={docData}
                />
            </Layout>
        )
        : null;
}
