/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useMemo } from "react";
import { useRepo } from "../../github/repo-context";
import { getTagsGroupedByCommitSha } from "../../github/tags";
import { Commit } from "../../github/types";
import { useTags } from "../../github/use-tags";
import { useIssueTracker } from "../../hooks/use-issue-tracker";
import { CommitChecks } from "../commit-checks";
import { CommitLinks } from "../commit-links";
import { Tag } from "../tag";

export function CommitListItem({
  commit,
  showCommitSubject,
}: {
  commit: Commit;
  showCommitSubject: boolean;
}) {
  const committer = commit.committer;
  const commitSubject = commit.commit.message.split('\n')[0];
  const issue = commit.jiraIssue;
  const sha = commit.sha;

  const { url } = useIssueTracker() || {};

  const {
    repo,
    owner,
  } = useRepo();

  const tags = useTags();


  const tagDictionary = useMemo<Record<string, string[]>>(
    () => tags
      ? getTagsGroupedByCommitSha(tags)
      : {},
    [
      tags,
    ],
  );

  const commitTags = tagDictionary[sha];

  return (
    <div
      className='flex border w-full flex-col'
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
              href={`/repos/${owner}/${repo}/${tag}`}
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
          className='flex items-center flex-shrink'
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
                        alt={committer.login || undefined}
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
            className='px-8 pl-0 py-2'
          >
            <div className="flex flex-col">
              {
                issue
                  ? (
                    <div
                      className=""
                    >
                      <span>
                        {issue.key}
                      </span>
                      {issue.summary}
                    </div>
                  )
                  : null
              }
              {(showCommitSubject || !issue) && (<div
                className=""
              >
                {commitSubject}
              </div>
              )}

            </div>
          </div>

        </div>

        <div
          className="flex items-center"
        >
          <CommitChecks
            sha={sha}
          />
          <div
            className='px-8 py-2'
          >
            {commit.sha.substring(0, 7)}
          </div>
          {
            owner && repo && <CommitLinks
              commitSha={sha}
              githubRepoOwner={owner}
              issueNr={commit?.jiraIssue?.key}
              repo={repo}
              size="small"
            />
          }
        </div>
      </div>
    </div>
  );
}
