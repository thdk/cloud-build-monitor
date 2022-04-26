import Link from "next/link";
import { Fragment } from "react";
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
                className="flex flex-col m-4 border rounded-lg"
            >
                {
                    data.map((repo) => {
                        return (
                            <Fragment
                                key={`${repo.owner}${repo.name}`}
                            >
                                <Link
                                    href={`/repos/${repo.owner.toLowerCase()}/${repo.name.toLowerCase()}`}
                                >
                                    <a
                                        className="p-4 underline border"
                                    >
                                        {repo.owner}/{repo.name}
                                    </a>
                                </Link>
                            </Fragment>
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
