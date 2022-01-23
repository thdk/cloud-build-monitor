import { query, collection, orderBy, limit } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { firestore } from '../../firebase/init-firebase';
import { CICCDBuild, CICCDBuildConverter } from '../../interfaces/build';
import { BuildListHeader } from '../build-list-header';
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
    <table className="table-auto w-full text-left">
      <thead
        className='bg-gray-100 text-slate-500'
      >
        <BuildListHeader />
      </thead>
      <tbody>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Loading...</span>}
        {value && (
          <>
            <BuildListItems
              builds={value.docs.map((doc) => ({ id: doc.id, ...doc.data() }))}
            />
          </>
        )}
      </tbody>
    </table>
  );
}
