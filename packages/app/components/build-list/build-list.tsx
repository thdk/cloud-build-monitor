import { collection, orderBy, query } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { firestore } from '../../firebase/init-firebase';
import { CICCDBuild, CICCDBuildConverter } from '../../interfaces/build';

export function BuildList() {
  const [value, loading, error] = useCollection<CICCDBuild>(
    query(
      collection(firestore, 'builds')
        .withConverter(CICCDBuildConverter),
      orderBy("created", "desc")
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
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th>
                Trigger
              </th>

              <th>
                Branch
              </th>

              <th>
                Build origin
              </th>

              <th>
                Commit sha
              </th>

              <th>
                Build status
              </th>

            </tr>
          </thead>

          <tbody>
            {value.docs.map((doc) => (
              <tr
                key={doc.id}
                className='odd:bg-white even:bg-gray-200'
              >
                <td>
                  {doc.data().name}
                </td>

                <td>
                  {doc.data().branchName}
                </td>

                <td>
                  {doc.data().origin}
                </td>

                <td>
                  {doc.data().commitSha.substring(0, 7)}...
                </td>

                <td>
                  {doc.data().status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
