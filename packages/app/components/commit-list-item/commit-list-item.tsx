/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useMemo } from "react";
import { useRepo } from "../../github/repo-context";
import { getTagsGroupedByCommitSha } from "../../github/tags";
import { Commit } from "../../github/types";
import { useTags } from "../../github/use-tags";
import { CommitChecks } from "../commit-checks";
import { CommitLinks } from "../commit-links";
import { Tag } from "../tag";

export function CommitListItem({
  commit,
  showCommitSubject,
  dateFormatOptions,
}: {
  commit: Commit;
  showCommitSubject: boolean;
  dateFormatOptions: Intl.DateTimeFormatOptions,
}) {
  const committer = commit.committer;
  const commitSubject = commit.commit.message.split('\n')[0];
  const issue = commit.jiraIssue;
  const sha = commit.sha;

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

  const date = new Date(commit.commit.committer.date || 0);
  const formattedDate = new Intl.DateTimeFormat(undefined, dateFormatOptions).format(date);

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
          className="flex mt-4 ml-4 mb-2"
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
            className='mx-4 my-2 max-w-32 flex-shrink-0 align-center'
          >
            {
              (committer.avatar_url)
                ? (
                  <div className="flex items-center justify-center">
                    <span>
                      <img
                        title={committer.login!}
                        src={committer.avatar_url}
                        alt={committer.login || undefined}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    </span>
                  </div>
                )
                : null
            }
          </div>

          <div
            className='mx-8 ml-0 my-2 mr-0'
          >
            <div className="flex flex-col">
              {
                issue
                  ? (
                    <div
                      className=""
                    >
                      {issue.key}: {issue.summary}
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
          <div
            className="text-slate-500 mx-2"
          >
            {formattedDate}
          </div>
        </div>

        <div
          className="flex items-center"
        >
          <CommitChecks
            sha={sha}
          />
          <div
            className='my-2 align-center'
          >
            {commit.sha.substring(0, 7)}
          </div>
          {
            <div
              className="w-24 flex justify-center align-center mx-4 mr-2"
            >
              <CommitLinks
                commitSha={sha}
                githubRepoOwner={owner}
                issueNr={commit?.jiraIssue?.key}
                repo={repo}
                size="small"
              />
            </div>
          }
        </div>
      </div>
    </div>
  );
}
