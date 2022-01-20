import { collection, limit, orderBy, query } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useAppContext } from '../../contexts/app-context';
import { firestore } from '../../firebase/init-firebase';
import { CICCDBuild, CICCDBuildConverter } from '../../interfaces/build';
import { BuildStatusIcon } from '../build-status-icon/build-status-icon';
import { Timer } from '../timer';

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
                className='px-8 py-2 max-w-24'
              >
                Status
              </th>

              <th
                className='px-8 py-2 max-w-64'
              >
                Branch
              </th>      

              <th
                className='px-8 py-2 max-w-48'
              >
                Author
              </th>

              <th
                className='px-8 py-2 min-w-96'
              >
                Commit subject
              </th>

              <th
                className='px-8 py-2 max-w-32'
              >
                Trigger
              </th>

              <th
                className='px-8 py-2 max-w-24'
              >
                Origin
              </th>

              <th
                className='px-8 py-2 max-w-32'
              >
                Commit
              </th>

              <th
                className='px-8 py-2 max-w-64'
              >
                Started
              </th>

              <th
                className='px-8 py-2 max-w-40'
              >
                Duration
              </th>

              <th
                className='px-8 py-2 max-w-32'
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
                    <Timer
                     finishTime={finishTime}
                     startTime={startTime}
                    />
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
                      config.issueTrackerUrl && issueNr && <a href={config.issueTrackerUrl
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
