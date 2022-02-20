import { query, collection, orderBy, limit } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { firestore } from '../../firebase/init-firebase';
import { CICCDBuild, CICCDBuildConverter } from '../../interfaces/build';
import { BuildListItems } from '../build-list-items';

export function BuildList() {
  const [value, loading, error] = useCollection<CICCDBuild>(
    query(
      collection(firestore, 'builds')
        .withConverter(CICCDBuildConverter),
      orderBy("created", "desc"),
      limit(30),
    ),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    },
  );

  return (
    <div className="w-full flex -pl-32 flex-col p-10">
      <div>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Loading...</span>}
        {value && (
            <BuildListItems
              builds={value.docs.map((doc) => ({ id: doc.id, ...doc.data() }))}
            />
        )}
      </div>
    </div>
  );
}
