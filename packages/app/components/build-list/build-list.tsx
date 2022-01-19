import { collection, limit, orderBy, query } from 'firebase/firestore';
import { useContext } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAppContext } from '../../contexts/app-context';
import { firestore } from '../../firebase/init-firebase';
import { CICCDBuild, CICCDBuildConverter } from '../../interfaces/build';
import { BuildStatusIcon } from '../build-status-icon/build-status-icon';

export function BuildList() {
  const [value, loading, error] = useCollection<CICCDBuild>(
    query(
      collection(firestore, 'builds')
        .withConverter(CICCDBuildConverter),
      orderBy("created", "desc"),
      limit(15),
    ),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    },
  );

  const config = useAppContext();

  const options = {
    year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric',
    hour12: false,
  } as const;

  return (
    <>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Loading...</span>}
      {value && (
        <table className="table-auto w-full text-left">
          <thead
            className='bg-gray-100 text-slate-500'
          >
            <tr>
              <th
                className='px-8 py-2'
              >
                Status
              </th>

              <th
                className='px-8 py-2'
              >
                Branch
              </th>      

              <th
                className='px-8 py-2'
              >
                Author
              </th>

              <th
                className='px-8 py-2'
              >
                Commit subject
              </th>

              <th
                className='px-8 py-2'
              >
                Trigger
              </th>

              <th
                className='px-8 py-2'
              >
                Build origin
              </th>

              <th
                className='px-8 py-2'
              >
                Commit
              </th>

              <th
                className='px-8 py-2'
              >
                Started
              </th>

              <th
                className='px-8 py-2'
              >
                Duration
              </th>

              <th
                className='px-8 py-2'
              >
                Details
              </th>


            </tr>
          </thead>

          <tbody>
            {value.docs.map((doc) => {
              const {
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
              } = doc.data();

              let duration = "";

              if (finishTime && startTime) {
                const durationTotal = (finishTime.getTime() - startTime.getTime()) / 1000;
                const minutes = Math.floor(durationTotal / 60);
                const seconds = durationTotal - minutes * 60;
                duration = `${minutes} min ${seconds} sec`;
              }

              return (
                <tr
                  key={doc.id}
                  className='border'
                >
                  <td
                    className='px-8 py-2'
                  >
                    <BuildStatusIcon
                      status={status}
                    />
                  </td>

                  <td
                    className='px-8 py-2'
                  >
                    {branchName}
                  </td>

                  <td
                    className='px-8 py-2'
                  >
                    {commitAuthor}
                  </td>

                  <td
                    className='px-8 py-2'
                  >
                    {commitSubject}
                  </td>

                  <td
                    className='px-8 py-2'
                  >
                    {name}
                  </td>


                  <td
                    className='px-8 py-2'
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
                  </td>

                  <td
                    className='px-8 py-2'
                  >
                    <a href={`https://github.com/${githubRepoOwner}/${repo}/commit/${commitSha}`}>
                      {commitSha.substring(0, 7)} <span>🔗</span>
                    </a>
                  </td>

                  <td
                    className='px-8 py-2 text-slate-500'
                  >
                    {new Intl.DateTimeFormat('default', options).format(created)}
                  </td>

                  <td
                    className='px-8 py-2 text-slate-500'
                  >
                    {duration}
                  </td>

                  <td
                    className='px-8 py-2 flex'
                  >
                    <a
                      href={logUrl}
                      title='logs'
                    >
                      📄
                    </a>

                    {
                      issueNr && <a href={config.issueTrackerUrl
                        .replace("{0}", issueNr)
                        .replace("{1}", githubRepoOwner)
                        .replace("{2}", repo)
                      }>
                        🐛
                      </a>
                    }
                  </td>
                </tr>
              );
            }
            )}
          </tbody>
        </table>
      )}
    </>
  );
}
