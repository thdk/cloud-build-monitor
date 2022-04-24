import { Button, Descriptions, Layout, PageHeader, Row, Tag } from "antd";
import { Content } from "antd/lib/layout/layout";
import Column from "antd/lib/table/Column";
import Link from "next/link";
import { CICCDBuild } from "../../interfaces/build";
import { CommitLinks, GithubLink, IssueLink, LogsLink } from "../commit-links";
import { Timer } from "../timer";

const options = {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false,
} as const;

export function BuildDetail({
    build: {
        name,
        repo,
        created,
        githubRepoOwner,
        commitSha,
        commitSubject,
        commitAuthor,
        branchName,
        logUrl,
        startTime,
        finishTime,
        origin,
        status,
        issueNr,
    },
}: {
    build: CICCDBuild;
}) {

    let tagColor = "blue";
    switch (status) {
        case "success":
            tagColor = "green"
            break;
        case "failure":
            tagColor = "red";
            break;
    }
    return (
        <>
            <PageHeader
                title="Build detail"
                subTitle={name}
                tags={<Tag color={tagColor}>{status}</Tag>}
                onBack={() => window.history.back()}
            >
                <div>

                    <Descriptions size="small" column={3}>
                        <Descriptions.Item label="Source">
                            {githubRepoOwner}/{repo}
                        </Descriptions.Item>
                        <Descriptions.Item label="Branch">
                            <Link href={`/repos/${githubRepoOwner}/${repo}/${branchName}`}>
                                <a className="underline">{branchName}</a>
                            </Link>
                        </Descriptions.Item>
                        <Descriptions.Item label="Commit">
                            <Link href={`/repos/${githubRepoOwner}/${repo}/${commitSha}`}>
                                <a className="underline">{commitSha}</a>
                            </Link>
                        </Descriptions.Item>
                        <Descriptions.Item label="Started on">
                            {new Intl.DateTimeFormat('default', options).format(created)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Duration">
                            <Timer
                                finishTime={finishTime}
                                startTime={startTime}
                            />
                        </Descriptions.Item>
                    </Descriptions>
                    <div
                        className="flex space-x-8 mt-4"
                    >
                        <GithubLink
                            owner={githubRepoOwner}
                            repo={repo}
                            sha={commitSha}
                            label="github"
                        />

                        <LogsLink
                            logUrl={logUrl}
                            label="logs"
                            origin={origin}
                        />

                        <IssueLink
                            issueNr={issueNr}
                            owner={githubRepoOwner}
                            repo={repo}
                            label={issueNr}
                        />
                    </div>
                </div>
            </PageHeader>
        </>
    )
};
