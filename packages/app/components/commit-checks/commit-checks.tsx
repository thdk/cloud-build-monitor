import { query, collection, where, getFirestore } from "firebase/firestore";
import Link from "next/link";
import { Line } from "rc-progress";
import { useCollection } from "react-firebase-hooks/firestore";
import { CICCDBuildConverter } from "../../interfaces/build";

export function CommitChecks({
    sha,
}: {
    sha: string;
}) {
    const [buildData] = useCollection(
        query(
            collection(getFirestore(), "builds")
                .withConverter(CICCDBuildConverter),
            where("commitSha", "==", sha),
        )
    );

    const total = buildData?.size || undefined;
    const success = buildData?.docs.filter(doc => doc.data().status === "success").length || 0;

    return (
        <div
            className="px-4 w-32"
        >
            {total && <Link
                href={`/builds?commit=${sha}`}
            >
                <a
                    title="Show all builds for this commit"
                    onClick={(e) => e.stopPropagation()}
                >
                    <Line
                        percent={total ? success / total * 100 : 0}
                        strokeWidth={8}
                        strokeColor="green"
                        trailColor="red"
                        trailWidth={8}
                    />
                </a>
            </Link>}
        </div>
    );
}
