import { StopOutlined } from '@ant-design/icons';
import { IconButton } from '@mui/material';
import { query, collection, orderBy, limit, where, getFirestore } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRepo } from '../../github/repo-context';
import { CICCDBuild, CICCDBuildConverter } from '../../interfaces/build';
import { BuildListItems } from '../build-list-items';
import { FilterInput } from '../filter-input';
import { RefInput } from '../ref-input';

export function BuildList() {
  const {
    pathname,
    query: routerQuery,
    replace,
  } = useRouter();

  const {
    repo,
    owner,
  } = useRepo();

  const {
    commit,
    branch,
    trigger,
  } = routerQuery;

  const baseQuery = useMemo(() => {
    let baseQuery = query(collection(getFirestore(), 'builds')
      .withConverter(CICCDBuildConverter),
      orderBy("created", "desc"),
      limit(30));

    if (commit) {
      baseQuery = query(baseQuery, where("commitSha", "==", commit));
    }

    if (branch) {
      baseQuery = query(baseQuery, where("branchName", "==", decodeURIComponent(branch as string)));
    }

    if (trigger) {
      baseQuery = query(baseQuery, where("name", "==", decodeURIComponent(trigger as string)));
    }

    if (repo && owner) {
      baseQuery = query(
        baseQuery,
        where("githubRepoOwner", "==", owner),
        where("repo", "==", repo),
      );
    }

    return baseQuery;
  },
    [
      owner,
      repo,
      commit,
      branch,
      trigger,
    ],
  );

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

  const triggers = useMemo(() => {
    const triggerSet = value?.docs.reduce((p, c) => {
      const doc = c.data();
      if (doc) {
        p.add(doc.name);
      }
      return p;
    },
      new Set<string>()
    ) || [];

    return [...triggerSet];
  },
    [
      value,
    ],
  );

  const branches = useMemo(() => {
    const branchSet = value?.docs.reduce((p, c) => {
      const doc = c.data();
      if (doc) {
        p.add(doc.branchName);
      }
      return p;
    },
      new Set<string>()
    ) || [];

    return [...branchSet];
  },
    [
      value,
    ],
  );

  return (
    <div className="flex -pl-32 flex-col">
      <div
        className='mb-4 flex space-x-16'
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
        />

        <FilterInput
          value={trigger as string | undefined}
          onChange={(value) => replace({
            pathname,
            query: {
              ...routerQuery,
              trigger: value,
            },
          })}
          label="Trigger"
          options={trigger ? [] : triggers}
        />
        {
          (branch || commit || trigger)
            ? <IconButton color="primary" aria-label="upload picture" component="label"
              onClick={() => {
                replace({
                  pathname,
                  query: {
                    ...routerQuery,
                    trigger: null,
                    branch: null,
                    commit: null,
                  },
                });
              }}>
              <StopOutlined />
            </IconButton>
            : null
        }
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
