/* eslint-disable @next/next/no-img-element */
import { useRepo } from "../../github/repo-context";
import { Commit } from "../../github/types";
import { CommitChecks } from "../commit-checks";
import { CommitLinks } from "../commit-links";
import { CommitTags } from "../commit-tags";

export function CommitListItem({
  commit,
  dateFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: "2-digit",
    minute: "2-digit"
},
}: {
  commit: Commit;
  dateFormatOptions?: Intl.DateTimeFormatOptions,
}) {
  const committer = commit.committer;
  const commitSubject = commit.commit.message.split('\n')[0];
  const issue = commit.jiraIssue;
  const sha = commit.sha;

  const {
    repo,
    owner,
  } = useRepo();
 
  const date = new Date(commit.commit.committer.date || 0);
  const formattedDate = new Intl.DateTimeFormat(undefined, dateFormatOptions).format(date);

  return (
    <div
      className='flex border-b last:border-0 flex-col'
      style={{
        borderTop: "none",
        borderLeft: "none",
        borderRight: "none",
      }}
    >
      <CommitTags 
        sha={sha}
        className="ml-4 mt-4"
      />
      <div
        className="flex justify-between"
      >
        <div
          key={sha}
          className='flex items-center'
        >
          <div
            className='mx-4 my-2 max-w-32 align-center flex-none'
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
            className='mx-8 ml-0 my-2 mr-0 shrink'
          >
            <div className="flex flex-col">
              {
                issue
                  ? (
                    <div
                      className="truncate ... shrink"
                    >
                      {issue.key}: {issue.summary}
                    </div>
                  )
                  : null
              }
              <div
                className="truncate ... shrink"
              >
                {commitSubject}
              </div>

            </div>
          </div>
          <div
            className="text-slate-500 mx-2 whitespace-nowrap flex-none w-20"
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
