import Link from 'next/link';
import { useIssueTracker } from '../../hooks/use-issue-tracker';
import { CICCDBuild } from '../../interfaces/build';
import { BuildStatusIcon } from '../build-status-icon/build-status-icon';
import { Timer } from '../timer';

export function BuildListItem({
  status,
  branchName,
  origin,
  repo,
  name,
  githubRepoOwner,
  commitSha,
  logUrl,
  issueNr = "1",
  commitAuthor,
  commitSubject,
  created,
  startTime,
  finishTime,
  id,
}: CICCDBuild & { id: string }) {


  const { url } = useIssueTracker() || {};

  const options = {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false,
  } as const;

  return (
    <div
      className='flex border justify-between'
    >
      <div
        className='flex'
      >
        <div
          className='flex items-center p-4 pl-8'
        >
          <BuildStatusIcon
            status={status}
          />
        </div>
        <div
          key={id}
          className='flex flex-col p-4'
        >
          <div
            className='first-row'
          >
            <div
              className=''
            >
              {name}
              <span
                className='px-2 text-slate-600'>
                for
              </span>
              {commitSha.substring(0, 7)}
              <span
                className='px-2 text-slate-600'>
                on
              </span>
              <Link href={`/repos/${githubRepoOwner}/${repo}/${encodeURIComponent(branchName)}`} >
                <a className='underline'>
                  {branchName}
                </a>
              </Link>
            </div>
          </div>
          <div
            className='second-row flex align-center'
          >
            <div
              className=''
            >
              {commitAuthor}
              <span
                className='px-2 text-slate-600'>
                committed
              </span>
              {commitSubject}
            </div>
          </div>
        </div>
      </div>
      <div
        className='flex p-4'
      >
        <div
          className='flex flex-col px-4  text-slate-600 pr-16'
        >
          <div>
            {new Intl.DateTimeFormat('default', options).format(created)}

          </div>
          <Timer
            finishTime={finishTime}
            startTime={startTime}
          />
        </div>
        <div
          className='flex items-center align-center w-32 pl-4 justify-center mr-8'
        >
          <a
            target="_blank"
            href={`https://github.com/${githubRepoOwner}/${repo}/commit/${commitSha}`} rel="noreferrer"
            className='underline'
          >
            { /* eslint-disable-next-line  */}
            <img alt={origin} src='icons/github.png' style={{ width: "auto", height: "32px" }} />
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
                ? <img alt={origin} src='icons/cloud_build.png' style={{ width: "auto", height: "32px" }} />
                : null
            }
            {
              (origin === "gocd")
                // eslint-disable-next-line
                ? <img alt={origin} src='icons/gocd.png' style={{ width: "auto", height: "16px" }} />
                : null
            }
          </a>

          {
            url && issueNr && <a target="_blank" href={url
              .replace("{0}", issueNr)
              .replace("{1}", githubRepoOwner)
              .replace("{2}", repo)
            } rel="noreferrer"
            >
              { /* eslint-disable-next-line  */}
              <img alt={origin} src='icons/jira-icon.png' style={{ width: "auto", height: "32px" }} />
            </a>
          }
        </div>
      </div>
    </div>
  );
}
