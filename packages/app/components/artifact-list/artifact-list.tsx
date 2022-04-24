import { List } from "antd";
import { collection, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { artifactConverter } from "../../collections/artifacts/firestore-converter";
import { firestore } from "../../firebase/init-firebase";
import Mustache from "mustache";
import { CICCDBuild } from "../../interfaces/build";
import Link from "next/link";

export function ArtifactList({
    build,
}: {
    build: CICCDBuild;
}) {
    const [data, isLoading] = useCollectionData(
        build
            ? query(
                collection(firestore, "artifacts")
                    .withConverter(artifactConverter),
                where("triggerName", "==", build.name),
            )
            : null
    );

    const mustacheData = {
        sha: build.commitSha,
        branch: build.branchName,
    };

    return (
        <div
            className='border rounded-lg px-4'
        >
            <List
                itemLayout="horizontal"
                loading={isLoading}
                dataSource={data}
                renderItem={item => (
                    <List.Item
                        actions={[
                            <Link
                                href="/config/builds"
                                key="list-loadmore-edit"
                            >
                                <a>edit</a>

                            </Link>
                        ]}
                    >
                        <List.Item.Meta
                            title={<a href={Mustache.render(item.artifactUrl, mustacheData)}>{item.title}</a>}
                        />
                    </List.Item>
                )}
            />
        </div>
    );
}