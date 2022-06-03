import Link from "next/link";
import { Fragment } from "react";
import { useQuery } from "react-query";
import { GetResponseDataTypeFromEndpointMethod } from "@octokit/types";
import { octokit } from "../../github/octokit";

export function RepoList() {
    const {
        data,
    } = useQuery(
        "repos",
        () => fetch(
            "/api/github/repos",
        ).then<GetResponseDataTypeFromEndpointMethod<typeof octokit.repos.listForAuthenticatedUser>>((response) => response.json()),
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
                                key={`${repo.owner.login}${repo.name}`}
                            >
                                <Link
                                    href={`/repos/${repo.owner.login.toLowerCase()}/${repo.name.toLowerCase()}/commits`}
                                >
                                    <a
                                        className="p-4 underline border"
                                    >
                                        {repo.owner.login}/{repo.name}
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
