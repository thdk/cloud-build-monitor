import { useIssueTracker } from "../../hooks/use-issue-tracker";
import { CICCDBuild } from "../../interfaces/build";

export function GithubLink({
    repo,
    owner,
    size,
    sha,
    label,
}: {
    repo?: string;
    owner?: string;
    sha?: string;
    size?: "standard" | "small";
    label?: string;
}) {
    return (
        <a
            target="_blank"
            href={`https://github.com/${owner}/${repo}/commit/${sha}`} rel="noreferrer"
            className='flex items-center space-x-2'
        >
            { /* eslint-disable-next-line  */}
            <img alt={origin} src='/icons/github.png' style={{ width: "auto", height: size === "small" ? "24px" : "32px" }} />
            {label && <div>{label}</div>}
        </a>
    );
}

export function LogsLink({
    logUrl,
    size,
    label,
    origin,
}: {
    logUrl?: string;
    size?: "standard" | "small";
    label?: string;
    origin?: string;
}) {
    return (
        <a
            href={logUrl}
            title='logs'
            target="_blank" rel="noreferrer"
            className='px-2 flex items-center space-x-2'
        >
            {
                (origin === "cloud-build")
                    // eslint-disable-next-line
                    ? <img alt={origin} src='/icons/cloud_build.png' style={{ width: "auto", height: size === "small" ? "24px" : "32px" }} />
                    : null
            }
            {
                (origin === "gocd")
                    // eslint-disable-next-line
                    ? <img alt={origin} src='/icons/gocd.png' style={{ width: "auto", height: size === "small" ? "12px" : "16px" }} />
                    : null
            }
            {label && <div>{label}</div>}
        </a>
    );
}

export function IssueLink({
    issueNr,
    repo,
    owner,
    size,
    label,
}: {
    repo?: string;
    owner?: string;
    size?: "standard" | "small";
    label?: string;
    issueNr?: string;
}) {
    const { url } = useIssueTracker() || {};

    return (
        <>
            {
                url && issueNr && repo && owner && <a
                    target="_blank"
                    href={url
                        .replace("{0}", issueNr)
                        .replace("{1}", owner)
                        .replace("{2}", repo)
                    }
                    rel="noreferrer"
                    className="flex items-center space-x-2"
                >
                    { /* eslint-disable-next-line  */}
                    <img alt={origin} src='/icons/jira-icon.png' style={{ width: "auto", height: size === "small" ? "24px" : "32px" }} />
                    {label && <div>{label}</div>}
                </a>
            }
        </>
    );
}

export function CommitLinks({
    githubRepoOwner,
    repo,
    commitSha,
    logUrl,
    issueNr,
    origin,
    size = "standard"
}: Partial<Pick<
    CICCDBuild,
    "commitSha" | "githubRepoOwner" | "repo" | "logUrl" | "issueNr" | "origin"
>> & {
    size: "small" | "standard"
}) {
    return (
        <>
            <GithubLink
                size={size}
                owner={githubRepoOwner}
                repo={repo}
                sha={commitSha}
            />

            <LogsLink
                logUrl={logUrl}
                size={size}
                origin={origin}
            />

            <IssueLink
                issueNr={issueNr}
                owner={githubRepoOwner}
                repo={repo}
                size={size}
            />
        </>
    );
}