import Link from "next/link";
import { CICCDBuild } from "../../interfaces/build";
import { CommitLinks } from "../commit-links";
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
    return (
        <div
            className="w-full flex -pl-32 flex-col p-10"
        >
            <div>
                <div
                    className="flex justify-between align-center"
                >
                    <h1
                        className="text-2xl mb-10 py-2 capitalize"
                    >
                        {status}: <span className="normal-case">{name}</span>
                    </h1>
                    <CommitLinks
                        commitSha={commitSha}
                        githubRepoOwner={githubRepoOwner}
                        issueNr={issueNr}
                        logUrl={logUrl}
                        repo={repo}
                        origin={origin}
                        size="standard"
                    />

                </div>

                <p
                    className="mb-4 text-xl"
                >
                    Build summary
                </p>
            </div>
            <div
                className="flex justify-between border rounded-lg p-4"
            >
                <div
                    className="flex flex-col"
                >
                    <div>
                        Trigger: {name}
                    </div>
                    <div>
                        Source: {githubRepoOwner}/{repo}
                    </div>
                    <div>
                        Branch: <Link href={`/repos/${githubRepoOwner}/${repo}/${branchName}`}>
                            <a className="underline">{branchName}</a>
                        </Link>
                    </div>
                    <div>
                        Commit: <Link href={`/repos/${githubRepoOwner}/${repo}/${commitSha}`}>
                            <a className="underline">{commitSha}</a>
                        </Link>
                    </div>
                </div>
                <div
                    className="flex flex-col"
                >
                    <div>
                        Started on {new Intl.DateTimeFormat('default', options).format(created)}

                    </div>
                    <div>
                        Duration: <Timer
                            finishTime={finishTime}
                            startTime={startTime}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
};
