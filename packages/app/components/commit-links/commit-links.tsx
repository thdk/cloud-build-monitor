import { useIssueTracker } from "../../hooks/use-issue-tracker";
import { CICCDBuild } from "../../interfaces/build";

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
>> &{
    size: "small" | "standard"
}) {
    const { url } = useIssueTracker() || {};

    return (
        <div
            className="flex px-4"
        >
            <a
                target="_blank"
                href={`https://github.com/${githubRepoOwner}/${repo}/commit/${commitSha}`} rel="noreferrer"
                className='underline'
            >
                { /* eslint-disable-next-line  */}
                <img alt={origin} src='/icons/github.png' style={{ width: "auto", height: size === "small" ? "24px" : "32px" }} />
            </a>
            <a
                href={logUrl}
                title='logs'
                target="_blank" rel="noreferrer"
                className='px-2'
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
            </a>

            {
                url && issueNr && repo && githubRepoOwner && <a target="_blank" href={url
                    .replace("{0}", issueNr)
                    .replace("{1}", githubRepoOwner)
                    .replace("{2}", repo)
                } rel="noreferrer"
                >
                    { /* eslint-disable-next-line  */}
                    <img alt={origin} src='/icons/jira-icon.png' style={{ width: "auto", height: size === "small" ? "24px" : "32px" }} />
                </a>
            }
        </div>
    );
}