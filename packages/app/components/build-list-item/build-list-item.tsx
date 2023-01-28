import Link from 'next/link';
import { useRouter } from 'next/router';
import { useRepo } from '../../github/repo-context';
import { CICCDBuild } from '../../interfaces/build';
import { BuildStatusIcon } from '../build-status-icon/build-status-icon';
import { CommitLinks } from '../commit-links';
import { Timer } from '../timer';

import styles from './build-list-item.module.css';

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
    <div className={styles.root}
      onClick={() => push(`/builds/${id}`)}
    >
      <div
        className={styles.left}
      >
        <div
          className={styles.status}
        >
          <BuildStatusIcon
            status={status}
          />
        </div>
        <div
          key={id}
          className={styles.main}
        >
          <div
            className={styles.firstRow}
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
                {name}{' '}
              </a>
              <span
                className='px-2 text-slate-600'>
                for{' '}
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
                {' '}on{' '}
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
                    <span>
                      {' '}in{' '}
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
            className={styles.secondRow}
          >
            <div
              className=''
            >
              {commitAuthor}
              <span>
              {' '}committed{' '}
              </span>
              {commitSubject}
            </div>
          </div>
        </div>
      </div>
      <div
        className={styles.right}
      >
        <div
          className={styles.meta}
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
          className={styles.actions}
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
