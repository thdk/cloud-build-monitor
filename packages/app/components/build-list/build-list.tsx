import { collection } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { firestore } from '../../firebase/init-firebase';
import { CICCDBuild, CICCDBuildConverter } from '../../interfaces/build';

export function BuildList() {
  const [value, loading, error] = useCollection<CICCDBuild>(

    collection(firestore, 'builds')
      .withConverter(CICCDBuildConverter),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    },
  );

  const rowStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  } as const;

  const columnStyle = {
    width: "calc(100vw/6)"
  }
  return (
    <>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Loading...</span>}
      {value && (
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th style={columnStyle}>
                Trigger
              </th>

              <th style={columnStyle}>
                Branch
              </th>

              <th style={columnStyle}>
                Build origin
              </th>

              <th style={columnStyle}>
                Commit sha
              </th>

              <th style={columnStyle}>
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
                <td style={columnStyle}>
                  {doc.data().name}
                </td>

                <td style={columnStyle}>
                  {doc.data().branchName}
                </td>

                <td style={columnStyle}>
                  {doc.data().origin}
                </td>

                <td style={columnStyle}>
                  {doc.data().commitSha.substring(0, 7)}...
                </td>

                <td style={columnStyle}>
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
