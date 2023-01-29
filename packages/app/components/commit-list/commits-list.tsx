import { CommitListItem } from "../commit-list-item";
import { Commit } from "../../github/types";
import { useQuery } from "@tanstack/react-query";
import { RefInput } from "../ref-input";
import { useRepo } from "../../github/repo-context";
import { useState } from "react";
import { CommitsListGrouped } from "../commit-list-grouped";
import { getIssue } from "../../jira/issues";
import { Form, Select } from "antd";

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
    if (!process.env.NEXT_PUBLIC_ISSUE_REGEX) {
        return commit.sha;
    }

    const issueRegex = new RegExp(process.env.NEXT_PUBLIC_ISSUE_REGEX)
    const issueId = commit.commit.message.match(issueRegex);

    return issueId ? issueId[0] : commit.sha;
}

function CommitListGroupedByIssueTitle({
    issueId,
    commit,
}: {
    issueId: string;
    commit: Commit;
}) {
    const issueQuery = useQuery(
        [
            "jira-issue",
            issueId,
        ],
        () => getIssue(issueId),
        {
            retry: false,
            enabled: false,
        }
    );

    return (
        <strong>
            {
                issueQuery.data
                    ? `${issueId}: ${issueQuery.data.summary}`
                    : commit.commit.message.split("\n")[0]
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

    const [groupBy, setGroupBy] = useState<"none" | "date" | "issue">(
        process.env.NEXT_PUBLIC_ISSUE_REGEX
            ? "issue"
            : "date"
    );

    const [since, setSince] = useState<string | undefined>();

    const { data: gitRepo } = useQuery([
        'repo',
        owner,
        repo,
    ],
        () => {
            return owner && repo
                ? fetch(`/api/github/repos/${owner}/${repo}`).then((response) => response.json())
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

            return fetch(
                `/api/github/repos/${owner}/${repo}/commit/${since}`
            ).then((response) => response.json());
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
        () => fetch(
            `/api/github/repos/${owner}/${repo}/commits/${repoRef || gitRepo?.data.default_branch}?since=${sinceDate || ""}`,
        ).then((response) => response.json()),
        {
            select: (data) => {
                return groupBy === "issue"
                    // filter out merge commits (they have more than one parent)
                    ? data.filter((commit: any) => commit.parents.length === 1)
                    : data;
            },
            enabled: !!gitRepo?.data.default_branch && commitData !== undefined,
        },
    );

    return (
        <div
            className="flex -pl-32 flex-col"
        >
            <div
                className="flex-col"
            >
                <div
                    className="flex flex-col"
                >
                    <div
                        className="mb-4 flex items-center space-x-4"
                    >
                        {repoRef !== null && (
                            <Form.Item
                                label="Head"
                            >
                                <RefInput
                                    allowClear={false}
                                    placeholder="Head"
                                    value={repoRef || defaultBranch}
                                    onChange={(value) => setRepoRef(value!)}
                                />
                            </Form.Item>
                        )}

                        {repoRef !== null && (
                            <Form.Item
                                label="Since"
                            >
                                <RefInput
                                    placeholder="Since"
                                    value={since}
                                    onChange={setSince}
                                    noBranches
                                />
                            </Form.Item>
                        )}
                        <div
                            className="flex"
                        >
                            <Form.Item
                                label="Group by"
                            >

                                <Select
                                    value={groupBy}
                                    onChange={setGroupBy}
                                    placeholder="Group by"
                                >
                                    <Select.Option value="none">None</Select.Option>
                                    <Select.Option value="date">Date</Select.Option>
                                    {process.env.NEXT_PUBLIC_ISSUE_REGEX && <Select.Option value="issue">Issue</Select.Option>}
                                </Select>
                            </Form.Item>
                        </div>
                    </div>
                    <div>
                        {
                            groupBy === "date" && (
                                <CommitsListGrouped
                                    commits={commits.data || []}
                                    groupKey={getListCommitsByDayGroupKey}
                                    GroupTitle={CommitListGroupedByDayTitle}
                                    dateFormatOptions={
                                        { hour: "2-digit", minute: "2-digit" }
                                    }
                                />
                            )
                        }
                        {
                            groupBy === "issue" && (
                                <CommitsListGrouped
                                    commits={commits.data || []}
                                    groupKey={getListCommitsByIssueGroupKey}
                                    GroupTitle={CommitListGroupedByIssueTitle}
                                />
                            )
                        }
                        {groupBy === "none" && (
                            <div
                                className="rounded-lg border"
                            >
                                {
                                    commits.data?.map((commit: any) => {
                                        return (
                                            <CommitListItem
                                                key={commit.sha}
                                                commit={commit}
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
