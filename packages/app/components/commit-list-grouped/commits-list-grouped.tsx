import { CommitListItem } from "../commit-list-item";
import { Commit, Commits } from "../../github/types";
import { ComponentType, useMemo } from "react";
import { Foldable } from "../foldable";
import { CommitChecks } from "../commit-checks";
import { CommitTags } from "../commit-tags";

export function CommitsListGrouped({
    commits,
    groupKey,
    GroupTitle,
    dateFormatOptions,
}: {
    commits: Commit[];
    groupKey(commit: Commit): string;
    GroupTitle: ComponentType<{ commit: Commit, issueId: string }>;
    dateFormatOptions?: Intl.DateTimeFormatOptions;
}) {

    const body = useMemo(
        () => commits.reduce<{ [date: string]: Commits }>(
            (p, commit) => {
                const key = groupKey(commit);

                p[key] = [...p[key] || [], commit];

                return p;
            },
            {},
        ),
        [
            commits,
            groupKey,
        ],
    );

    return (
        <>
            {

                Object.entries(body).map(([key, commits]) => {
                    return (
                        <Foldable
                            key={key}
                            Header={({ open }: { open: boolean }) => (
                                <div className="w-full justify-between flex items-center">
                                    <div
                                        className="flex items-center space-x-2"
                                    >
                                        {!open
                                            ? <CommitTags
                                                sha={commits[0].sha}
                                            />
                                            : null
                                        }
                                        <GroupTitle
                                            issueId={key}
                                            commit={commits[0]}
                                        />

                                    </div>
                                    {!open
                                        ? <CommitChecks
                                            sha={commits[0].sha}
                                        />
                                        : null
                                    }
                                </div>
                            )
                            }
                            content={(
                                <div
                                    className=""
                                >
                                    {
                                        commits.map((commit) => {
                                            return (
                                                <CommitListItem
                                                    key={commit.sha}
                                                    commit={commit}
                                                    dateFormatOptions={dateFormatOptions}
                                                />
                                            );
                                        })

                                    }
                                </div>
                            )}
                        />
                    );
                })
            }
        </>
    );
}
