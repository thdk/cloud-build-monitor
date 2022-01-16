import { collection, CollectionReference } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { firebaseFirestore } from '../../firebase/init-firebase';
import { CICCDBuild, CICCDBuildConverter } from '../../interfaces/build';

export function BuildList() {
  const [value, loading, error] = useCollection<CICCDBuild>(

    collection(firebaseFirestore, 'builds')
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
    <div>
      <p>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Collection: Loading...</span>}
        {value && (
          <div
            style={{
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div
              style={rowStyle}
            >
              <div style={columnStyle}>
                Trigger
              </div>

              <div style={columnStyle}>
                Branch
              </div>

              <div style={columnStyle}>
                Build origin
              </div>

              <div style={columnStyle}>
                Commit sha
              </div>

              <div style={columnStyle}>
                Build status
              </div>
            </div>

            <hr
              style={{
                width: "100vw"
              }}
            />
            {value.docs.map((doc) => (
              <div
                key={doc.id}
                style={rowStyle}
              >
                <div style={columnStyle}>
                  {doc.data().name}
                </div>

                <div style={columnStyle}>
                  {doc.data().branchName}
                </div>

                <div style={columnStyle}>
                  {doc.data().origin}
                </div>

                <div style={columnStyle}>
                  {doc.data().commitSha.substring(0, 7)}...
                </div>

                <div style={columnStyle}>
                  {doc.data().status}
                </div>
              </div>
            ))}
          </div>
        )}
      </p>
    </div>
  );
}
