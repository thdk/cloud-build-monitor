import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRepo } from '../../github/repo-context';
import { CICCDBuild } from '../../interfaces/build';
import { BuildStatusIcon } from '../build-status-icon/build-status-icon';
import { CommitLinks } from '../commit-links';
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
  const {
    pathname,
    query,
    push,
    replace,
  } = useRouter();

  const {
    repo: contextRepo,
    owner: contextOwner,
  } = useRepo();

  const options = {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false,
  } as const;

  return (
    <div
      className='flex border justify-between hover:bg-blue-100'
      onClick={() => push(`/builds/${id}`)}
      style={{
        cursor: "pointer"
      }}
    >
      <div
        className='flex'
      >
        <div
          className='flex items-center m-4 ml-8'
        >
          <BuildStatusIcon
            status={status}
          />
        </div>
        <div
          key={id}
          className='flex flex-col m-4'
        >
          <div
            className='first-row'
          >
            <div
              className=''
            >
              <a
                className='underline'
                onClick={e => {
                  e.stopPropagation();

                  replace({
                    pathname,
                    query: {
                      ...query,
                      trigger: name,
                    }
                  });
                }}
              >
                {name}
              </a>
              <span
                className='px-2 text-slate-600'>
                for
              </span>
              <a
                className='underline'
                onClick={e => {
                  e.stopPropagation();

                  replace({
                    pathname,
                    query: {
                      ...query,
                      commit: commitSha,
                    }
                  });
                }}
              >
                {commitSha.substring(0, 7)}
              </a>
              <span
                className='px-2 text-slate-600'>
                on
              </span>
              <a
                className='underline'
                onClick={e => {
                  e.stopPropagation();

                  replace({
                    pathname,
                    query: {
                      ...query,
                      branch: branchName,
                    }
                  });
                }}
              >
                {branchName}
              </a>
              {
                (contextRepo !== repo && contextOwner != githubRepoOwner) && (

                  <>
                    <span
                      className='px-2 text-slate-600'>
                      in
                    </span>
                    <Link
                      href={`repos/${githubRepoOwner}/${repo}/builds`}
                      className='underline'
                      onClick={e => {
                        e.stopPropagation();

                        replace({
                          pathname,
                          query: {
                            ...query,
                            repo,
                            owner: githubRepoOwner,
                          }
                        });
                      }}>

                      {`${githubRepoOwner}/${repo}`}

                    </Link>
                  </>
                )
              }
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
        className='flex m-4'
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
          className='flex items-center align-center w-32 justify-center mr-8'
        >
          <CommitLinks
            commitSha={commitSha}
            githubRepoOwner={githubRepoOwner}
            issueNr={issueNr}
            logUrl={logUrl}
            repo={repo}
            origin={origin}
            size={"small"}
          />
        </div>
      </div>
    </div>
  );
}
