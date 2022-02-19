import Link from "next/link";
import { useQuery } from "react-query";
import { getRepos } from "../../github/repos";

export function RepoList() {
    const {
        data,
    } = useQuery(
        "repos",
        getRepos,
    );

    return data
        ? (
            <div
                className="flex flex-col mx-20 m-10 border rounded-lg w-full"
            >
                {
                    data.map((repo) => {
                        return (
                            <div
                                className="p-4 w-full border"
                                key={`${repo.owner}${repo.name}`}>


                                <Link
                                    href={`/repos/${repo.owner.toLowerCase()}/${repo.name.toLowerCase()}`}
                                >
                                    <a
                                        className="underline"
                                    >
                                        {repo.owner}/{repo.name}
                                    </a>
                                </Link>
                            </div>
                        );
                    })
                }
            </div>
        )
        : (
            <div>
                Loading repos...
            </div>
        );
}
