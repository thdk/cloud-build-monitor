import { StopOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { query, collection, orderBy, limit, where, getFirestore } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useRepo } from '../../github/repo-context';
import { CICCDBuild, CICCDBuildConverter } from '../../interfaces/build';
import { BuildListItem } from '../build-list-item';
import { FilterInput } from '../filter-input';
import { RefInput } from '../ref-input';

import styles from "./build-list.module.css";

const { Item: FormItem } = Form;

type Filters = {
  commit?: string;
  branch?: string;
  trigger?: string;
};

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

  const onFilterFormSubmit = useCallback(
    (filterData: Filters) => {
      replace({
        pathname,
        query: {
          ...routerQuery,
          ...filterData,
        },
      })
    },
    [
      replace,
      pathname,
      routerQuery,
    ],
  );

  const [form] = useForm<Filters>();

  useEffect(
    () => {
      form.setFieldsValue({
        branch: branch as string,
        commit: commit as string,
        trigger: trigger as string,
      })
    },
    [
      branch,
      commit,
      form,
      trigger,
    ],
  );

  return (
    <div
      className={styles.root}
    >
      <Form
        form={form}
        onFinish={onFilterFormSubmit}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            form.submit();
          }
        }
        }
        initialValues={{
          trigger,
          commit,
          branch,
        }}
      >


        <Row
          className={styles.filters}
          justify="start"
          gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 10]}
        >
          <Col>
            <FormItem
              name="commit"
              label="Commit"
            >
              <Input
                placeholder="Commit"
                allowClear
              />
            </FormItem>
          </Col>
          <Col>

            <FormItem
              name="branch"
              label="Branch"
            >
              <RefInput
                placeholder="Branch"
                onSelect={() => form.submit()}
                onClear={() => form.submit()}
              />
            </FormItem>
          </Col>
          <Col>
            <FormItem
              name="trigger"
              label="Trigger"
            >
              <FilterInput
                placeholder="Trigger"
                options={trigger ? [] : triggers}
                onSelect={() => form.submit()}
                onClear={() => form.submit()}
              />
            </FormItem>
          </Col>
          <Col>

            {
              (branch || commit || trigger)
                ? <Button
                  type="default"
                  icon={<StopOutlined />}
                  style={{
                    "display": "flex",
                    "justifyContent": "center",
                    "alignItems": "center",
                  }}
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
                  }} />
                : null
            }
          </Col>
        </Row>
      </Form>
      <div
        className={styles.buildList}
      >
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Loading...</span>}
        {value && (
          value.docs.map((doc) => (
            <BuildListItem key={doc.id} id={doc.id} {...doc.data()} />
          ))
        )}
      </div>
    </div>
  );
}
