import { query, collection, where } from "firebase/firestore";
import Link from "next/link";
import { useCollectionDataOnce, useCollectionOnce } from "react-firebase-hooks/firestore";
import { firestore } from "../../firebase/init-firebase";
import { CICCDBuildConverter } from "../../interfaces/build";
import { BuildStatusIcon } from "../build-status-icon";

export function CommitChecks({
    sha,
}: {
    sha: string;
}) {
    const [buildData] = useCollectionOnce(
        query(
            collection(firestore, "builds")
                .withConverter(CICCDBuildConverter),
            where("commitSha", "==", sha),
        )
    );

    return (
        <div
            className="px-4"
        >
            {
                buildData?.docs.map((build) => {
                    const {
                        name,
                        status,
                    } = build.data();

                    return (
                        <Link
                            href={`/builds/${build.id}`}
                            key={build.id}
                        >
                            <a
                                title={name}
                            >
                                <BuildStatusIcon
                                    status={status}
                                />
                            </a>
                        </Link>
                    );
                })
            }
        </div>
    );
}
