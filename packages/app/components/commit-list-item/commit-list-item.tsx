/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { getTagsGroupedByCommitSha } from "../../github/tags";
import { Commit } from "../../github/types";
import { useTags } from "../../github/use-tags";
import { useIssueTracker } from "../../hooks/use-issue-tracker";
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
    query: {
      repo,
      owner
    }
  } = useRouter();

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
          className="flex items-center"
        >
          <div
            className='px-4 py-2'
          >
            <a
              target="_blank"
              href={commit.html_url}
              rel="noreferrer"
              className="no-wrap flex"
            >
              {commit.sha.substring(0, 7)} <span className="pl-2">🔗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
