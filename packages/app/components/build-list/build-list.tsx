import { collection, limit, orderBy, query } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
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

  return (
    <>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Loading...</span>}
      {value && (
        <table className="table-fixed w-full text-left">
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
                    {name}
                  </td>


                  <td
                    className='px-8 py-2'
                  >
                    {origin}
                  </td>

                  <td
                    className='px-8 py-2'
                  >
                    <a href={`https://github.com/${githubRepoOwner}/${repo}/commit/${commitSha}`}>
                      {commitSha.substring(0, 7)} <span>🔗</span>
                    </a>
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
