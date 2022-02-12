import Link from "next/link";
import { Repo } from "../../pages/repos"

export function RepoList({
    repos,
}: {
    repos: Repo[],
}) {
    return (
        <div
            className="flex flex-col mx-20 m-10 border rounded-lg w-full"
        >
            {
                repos.map((repo) => {
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
}