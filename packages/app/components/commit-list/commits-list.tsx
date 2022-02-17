import { CommitListItem } from "../commit-list-item";
import { useRepoContext } from "../repo-provider";
import { Commits } from "../../github/types";

export function CommitsList({
    commits,
}: {
    commits?: Commits;
}) {

    const {
        repo,
        owner,
        ref,
    } = useRepoContext();

    const body = (commits || []).reduce<{ [date: string]: Commits }>(
        (p, commit) => {
            const commitedOnTime = new Date(commit.commit.committer?.date || 0);

            const commitOnDate = `${commitedOnTime.getFullYear()}${commitedOnTime.getMonth}${commitedOnTime.getDate()}`

            p[commitOnDate] = [...p[commitOnDate] || [], commit];

            return p;
        },
        {},
    );

    return (
        <div
            className="w-full flex flex-col p-10"
        >
            <div
                className="w-full flex items-start flex-col pb-10"
                style={{
                    maxWidth: "80em"
                }}
            >
                <h1
                    className="text-xl mb-10 py-4"
                >{owner} / {repo}</h1>
                <h2>{ref}</h2>
            </div>
            <div
                className="flex-col px-20"
                style={{
                    maxWidth: "100em"
                }}
            >
                {
                    Object.entries(body).map(([key, commits]) => {
                        const date = new Date(commits[0].commit.committer?.date || 0);
                        const options = { weekday: 'long', month: 'short', day: 'numeric' } as const;
                        const formattedDate = new Intl.DateTimeFormat(undefined, options).format(date);
                        return (
                            <div key={key} className="flex flex-col">
                                <div
                                    className="py-4 px-2"
                                >
                                    Commits on {formattedDate}
                                </div>
                                <div
                                    className="inline-block rounded-lg border"
                                >
                                    <div
                                        className="w-full"
                                    >
                                        {
                                            commits.map((commit) => {
                                                return (
                                                    <CommitListItem
                                                        key={commit.sha}
                                                        commit={commit}
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
            </div>
        </div>
    );
}
