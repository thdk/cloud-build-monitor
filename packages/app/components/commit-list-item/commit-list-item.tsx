import { Commit } from "../commit-list/types";
import Image from "next/image";
import { useIssueTracker } from "../../hooks/use-issue-tracker";

export function CommitListItem({
  commit,
}: {
  commit: Commit
}) {
  const author = commit.author;
  const commiter = commit.committer;
  const commitSubject = commit.commit.message.split('\n')[0];
  const issue = commit.jiraIssue;
  const sha = commit.sha;

  const { url } = useIssueTracker() || {};

  return (
    <div
      className='flex border w-full flex items-center justify-between'
      style={{
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
      }}
    >
      <div
        key={sha}
        className='flex items-center'
      >
        <div
          className='px-4 py-2 max-w-32'
        >
          {
            (author || commiter)
              ? (
                <div className="flex items-center">
                  <span>
                    <Image
                      title={(author || commiter)!.name || undefined}
                      src={(author || commiter)!.avatar_url}
                      alt={(author || commiter)!.login}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  </span>
                </div>
              )
              : null
          }
        </div>

        <div
          className='px-8 pl-0 py-2 vw-50'
        >
          <div className="flex flex-col">
            {
              issue
                ? (
                  <div>
                    <div
                      className="truncate ...  overflow-hidden no-wrap"
                    >
                      {
                        url
                          ? <a
                            href={url
                              .replace("{0}", commit.jiraIssue?.key)
                            } rel="noreferrer">
                            <span
                              className="underline pr-2">
                              {issue.key}
                            </span>
                          </a>
                          : <span>
                            {issue.key}
                          </span>
                      }
                      {issue.summary}
                    </div>
                  </div>
                )
                : null
            }
            <div
              className=""
            >
              {commitSubject}
            </div>

          </div>
        </div>

      </div>

      <div
        className="flex  items-center"
      >
        <div
          className='px-8 py-2 w-48 pl-16'
        >
          <a
            target="_blank"
            href={commit.html_url}
            rel="noreferrer"
          >
            {commit.sha.substring(0, 7)} <span>🔗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
