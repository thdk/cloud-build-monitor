import { CommitListItem } from "../commit-list-item";
import { Commits } from "../../github/types";
import { useQuery } from "react-query";
import { getCommitsWithIssue } from "../../utils/get-commits-with-issue";
import { RefInput } from "../ref-input";
import { useRepo } from "../../github/repo-context";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useState } from "react";

export function CommitsList() {

    const {
        owner,
        repo,
        repoRef,
    } = useRepo();

    const commits = useQuery(
        [
            'commits-issues',
            owner,
            repo,
            repoRef,
        ],
        () => getCommitsWithIssue({
            ref: repoRef as string,
            repo: repo as string,
            owner: owner as string,
        }),
    );

    const body = (commits.data || []).reduce<{ [date: string]: Commits }>(
        (p, commit) => {
            const commitedOnTime = new Date(commit.commit.committer?.date || 0);

            const commitOnDate = `${commitedOnTime.getFullYear()}${commitedOnTime.getMonth}${commitedOnTime.getDate()}`

            p[commitOnDate] = [...p[commitOnDate] || [], commit];

            return p;
        },
        {},
    );

    const [showCommitSubject, setShowCommitSubject] = useState(false);

    return (
        <div
            className="w-full flex -pl-32 flex-col p-10"
        >
            <div
                className="flex"
            >
                <h1
                    className="text-xl mb-10 py-4"
                >
                    {owner} / {repo}
                </h1>
            </div>
            <div
                className="flex-col px-20"
            >
                <div
                    className="flex flex-col"
                >
                    <div
                        className="mb-4 flex justify-between"
                    >
                        <RefInput />
                        <FormGroup>
                            <FormControlLabel
                                labelPlacement="start"
                                control={
                                    <Checkbox
                                        size="small"
                                        value={showCommitSubject}
                                        onChange={() => setShowCommitSubject(!showCommitSubject)}
                                    />}
                                label="Show commit subject"
                            />
                        </FormGroup>
                    </div>
                    <div>
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
                                            className="inline-block rounded-lg border w-full"
                                        >
                                            <div>
                                                {
                                                    commits.map((commit) => {
                                                        return (
                                                            <CommitListItem
                                                                key={commit.sha}
                                                                commit={commit}
                                                                showCommitSubject={showCommitSubject}
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
            </div>
        </div>
    );
}
