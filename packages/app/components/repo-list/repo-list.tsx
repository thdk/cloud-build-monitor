import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { GetResponseDataTypeFromEndpointMethod } from "@octokit/types";
import type { Octokit } from "@octokit/rest";
import { List } from "antd";

export function RepoList() {
    const {
        data,
    } = useQuery(
        ["repos"],
        () => fetch(
            "/api/github/repos",
        ).then<GetResponseDataTypeFromEndpointMethod<Octokit["repos"]["listForAuthenticatedUser"]>>(
            async (response) => {
                const data = await response.json()
                if (response.ok) {
                    return data;
                }

                return Promise.reject(
                    (data && data.message) || response.status,
                );
            },
        ),
    );

    return data
        ? (
            <div>
                <List>
                    {
                        data.map((repo) => {
                            return (
                                <List.Item
                                    key={`${repo.owner.login}${repo.name}`}
                                >
                                    <Link
                                        href={`/repos/${repo.owner.login.toLowerCase()}/${repo.name.toLowerCase()}/commits`}
                                    >

                                        {repo.owner.login}/{repo.name}

                                    </Link>
                                </List.Item>
                            );
                        })
                    }

                </List>
            </div>
        )
        : (
            <div>
                Loading repos...
            </div>
        );
}
