import { query, collection, orderBy, limit, where, getDocs, getFirestore } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRepo } from '../../github/repo-context';
import { CICCDBuild, CICCDBuildConverter } from '../../interfaces/build';
import { BuildListItems } from '../build-list-items';
import { RefInput } from '../ref-input';

export function BuildList() {
  const {
    pathname,
    query: routerQuery,
    replace,
  } = useRouter();

  let baseQuery = query(collection(getFirestore(), 'builds')
    .withConverter(CICCDBuildConverter),
    orderBy("created", "desc"),
    limit(30));

  const {
    repo,
    owner,
  } = useRepo();

  const {
    commit,
    branch,
  } = routerQuery;

  if (commit) {
    baseQuery = query(baseQuery, where("commitSha", "==", commit));
  }

  if (branch) {
    baseQuery = query(baseQuery, where("branchName", "==", decodeURIComponent(branch as string)));
  }

  if (repo && owner) {
    baseQuery = query(
      baseQuery,
      where("githubRepoOwner", "==", owner),
      where("repo", "==", repo),
    );
  }

  const [value, loading, error] = useCollection<CICCDBuild>(
    query(baseQuery),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    },
  );

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="flex -pl-32 flex-col">
      <div
        className='mb-4 flex space-x-4'
      >
        <RefInput
          value={commit as string | undefined}
          onChange={(value) => replace({
            pathname,
            query: {
              ...routerQuery,
              commit: value,
            },
          })}
          label="Commit"
          className="mr-4"
        />

        <RefInput
          value={branch as string | undefined}
          onChange={(value) => replace({
            pathname,
            query: {
              ...routerQuery,
              branch: value,
            },
          })}
          label="Branch"
          className="mr-4"
        />
      </div>
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
