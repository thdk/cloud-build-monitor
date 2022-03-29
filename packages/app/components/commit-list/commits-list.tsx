import { CommitListItem } from "../commit-list-item";
import { Commit } from "../../github/types";
import { useQuery } from "react-query";
import { RefInput } from "../ref-input";
import { useRepo } from "../../github/repo-context";
import { FormControl, FormGroup, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { getRepo } from "../../github/repos";
import { CommitsListByDay } from "../commit-list-by-day";
import { getCommit, getCommits } from "../../github/commits";
import { getIssue } from "../../jira/issues";

function getListCommitsByDayGroupKey(commit: Commit) {
    const commitedOnTime = new Date(commit.commit.committer?.date || 0);

    return `${commitedOnTime.getFullYear()}${commitedOnTime.getMonth}${commitedOnTime.getDate()}`;
}

function CommitListGroupedByDayTitle({
    commit,
}: {
    commit: Commit,
}) {
    const date = new Date(commit.commit.committer?.date || 0);
    const options = { weekday: 'long', month: 'short', day: 'numeric' } as const;
    const formattedDate = new Intl.DateTimeFormat(undefined, options).format(date);

    return <strong>
        {`Commits on ${formattedDate}`}
    </strong>;
}

function getListCommitsByIssueGroupKey(commit: Commit) {
    const issueRegex = new RegExp(process.env.NEXT_PUBLIC_ISSUE_REGEX || "")
    const issueId = commit.commit.message.match(issueRegex);

    return issueId ? issueId[0] : commit.sha;
}

function CommitListGroupedByIssueTitle({
    issueId,
}: {
    issueId: string;
}) {
    const issueQuery = useQuery(
        [
            "jira-issue",
            issueId,
        ],
        () => getIssue(issueId),
        {
            retry: false,
        }
    );

    return (
        <strong>
            {
                issueQuery.data
                    ? `${issueId}: ${issueQuery.data.summary}`
                    : `Commits for ${issueId}`
            }
        </strong>
    );
}

export function CommitsList() {

    const {
        owner,
        repo,
        repoRef,
        setRepoRef,
        defaultBranch,
    } = useRepo();

    const [groupBy, setGroupBy] = useState<"none" | "date" | "issue">("issue");
    const [since, setSince] = useState<string | undefined>();

    const { data: gitRepo } = useQuery([
        'repo',
        owner,
        repo,
    ],
        () => {
            return owner && repo
                ? getRepo({
                    owner,
                    repo,
                })
                : undefined
        }
    )

    const { data: commitData } = useQuery(
        [
            "commit",
            owner,
            repo,
            since,
        ],
        () => {
            if (!owner || !repo) {
                return undefined;
            }

            if (!since) {
                return null;
            }

            return getCommit({
                owner: owner,
                repo: repo,
                ref: since,
            });
        },
    );

    const sinceDate = commitData?.data.commit.committer?.date;
    const commits = useQuery(
        [
            'commits',
            owner,
            repo,
            repoRef,
            groupBy,
            sinceDate,
        ],
        () => getCommits({
            ref: repoRef || gitRepo?.data.default_branch as string,
            repo: repo as string,
            owner: owner as string,
            since: sinceDate,
        }),
        {
            select: (data) => groupBy === "issue"
                // filter out merge commits (they have more than one parent)
                ? data.filter((commit) => commit.parents.length === 1)
                : data,
            enabled: !!gitRepo?.data.default_branch && commitData !== undefined,
        },
    );

    const commitDateFormatOptions: Intl.DateTimeFormatOptions = groupBy === "date"
        ? { hour: "2-digit", minute: "2-digit" }
        : { year: 'numeric', month: 'short', day: 'numeric', hour: "2-digit", minute: "2-digit" };

    return (
        <div
            className="w-full flex -pl-32 flex-col p-4 lg:p-10"
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
                className="flex-col lg:px-20"
            >
                <div
                    className="flex flex-col"
                >
                    <div
                        className="mb-4 flex"
                    >
                        {repoRef !== null && <RefInput
                            label="Head"
                            value={repoRef || defaultBranch}
                            onChange={(value) => setRepoRef(value!)}
                            disableClearable
                            className="mr-4"
                        />}

                        {repoRef !== null && <RefInput
                            label="Since"
                            value={since}
                            onChange={setSince}
                            noBranches
                            className="mr-4"
                        />}
                        <div
                            className="flex"
                        >
                            <FormGroup>
                                <FormControl>
                                    <InputLabel id="group-select-label">Group by</InputLabel>
                                    <Select
                                        autoWidth
                                        size="small"
                                        labelId="group-select-label"
                                        value={groupBy}
                                        label="Group by"
                                        onChange={(e) => {
                                            setGroupBy(e.target.value as any);
                                        }}
                                    >
                                        <MenuItem value="none">None</MenuItem>
                                        <MenuItem value="date">Date</MenuItem>
                                        <MenuItem value="issue">Issue</MenuItem>
                                    </Select>
                                </FormControl>
                            </FormGroup>
                        </div>
                    </div>
                    <div>
                        {
                            groupBy === "date" && (
                                <CommitsListByDay
                                    commits={commits.data || []}
                                    groupKey={getListCommitsByDayGroupKey}
                                    GroupTitle={CommitListGroupedByDayTitle}
                                />
                            )
                        }
                        {
                            groupBy === "issue" && (
                                <CommitsListByDay
                                    commits={commits.data || []}
                                    groupKey={getListCommitsByIssueGroupKey}
                                    GroupTitle={CommitListGroupedByIssueTitle}
                                />
                            )
                        }
                        {groupBy === "none" && (
                            <div
                                className="inline-block rounded-lg border w-full"
                            >
                                {
                                    commits.data?.map((commit) => {
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
                        )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
