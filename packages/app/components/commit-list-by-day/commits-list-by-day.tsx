import { CommitListItem } from "../commit-list-item";
import { Commit, Commits } from "../../github/types";
import { ComponentType, useMemo } from "react";

export function CommitsListByDay({
    commits,
    groupKey,
    GroupTitle,
}: {
    commits: Commit[];
    groupKey(commit: Commit): string;
    GroupTitle: ComponentType<any>;
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

    const commitDateFormatOptions: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit" };

    return (
        <>
            {

                Object.entries(body).map(([key, commits]) => {
                    return (
                        <div key={key} className="flex flex-col">
                            <div
                                className="pt-6 pr-8 mb-2 px-2 flex text-slate-700"
                            >
                                <GroupTitle issueId={key} commit={commits[0]} />
                            </div>
                            <div
                                className="inline-block rounded-lg border w-full"
                            >
                                <div>
                                    {
                                        commits.map((commit) => {
                                            return (
                                                <CommitListItem
                                                    key={commit.sha}
                                                    commit={commit}
                                                    dateFormatOptions={commitDateFormatOptions}
                                                />
                                            );
                                        })

                                    }
                                </div>
                            </div>
                        </div>
                    );
                })
            }
        </>
    );
}
