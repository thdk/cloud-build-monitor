/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { Commit } from "../../github/types";
import { useIssueTracker } from "../../hooks/use-issue-tracker";
import { useRepoContext } from "../repo-provider";
import { Tag } from "../tag";

export function CommitListItem({
  commit,
}: {
  commit: Commit
}) {
  const committer = commit.committer;
  const commitSubject = commit.commit.message.split('\n')[0];
  const issue = commit.jiraIssue;
  const sha = commit.sha;

  const { url } = useIssueTracker() || {};

  const {
    tagDictionary,
    repo,
    owner
  } = useRepoContext();

  const commitTags: undefined | string[] = tagDictionary[sha];

  return (
    <div
      className='flex border w-full flex flex-col'
      style={{
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
      }}
    >
      {commitTags && (
        <div
          className="flex pt-4 pl-4 pb-2"
        >
          {commitTags.map((tag) => (
            <Link
              key={tag}
              href={`/repos/${owner}/${repo}/${encodeURIComponent(tag)}`}
              passHref
            >
              <Tag
                name={tag}
              />
            </Link>
          ))}
        </div>
      )}
      <div
        className="flex justify-between"
      >
        <div
          key={sha}
          className='flex items-center'
        >
          <div
            className='px-4 py-2 max-w-32 w-16'
          >
            {
              (committer.avatar_url)
                ? (
                  <div className="flex items-center">
                    <span>
                      <img
                        title={committer.login!}
                        src={committer.avatar_url}
                        alt={committer.login || committer.login}
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
    </div>
  );
}
