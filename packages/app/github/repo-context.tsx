import { useRouter } from "next/router";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";

const RepoContext = createContext<{
    repo: string | undefined,
    owner: string | undefined,
    repoRef: string | undefined,
    setRepoRef: (ref: string) => void,
    defaultBranch: string | undefined,
}>({} as any);

export const RepoProvider = ({
    children,
}: PropsWithChildren<unknown>) => {
    const { query: {
        repo,
        owner,
        ref: refFromParam,
    } } = useRouter();

    const [repoRef, setRepoRef] = useState<string | undefined | null>(null);

    useEffect(
        () => {
            setRepoRef(
                Array.isArray(refFromParam)
                    ? refFromParam.join('/')
                    : refFromParam || null
            )
        },
        [refFromParam]
    );

    const repoQuery = useQuery([
        "repo",
        owner,
        repo,
    ],
        () => fetch(
            `/api/github/repos/${owner}/${repo}`,
        ).then((response) => {
            return response.json();
        }),
        {
            enabled: !!(owner && repo),
        },
    );

    return (
        <RepoContext.Provider value={{
            defaultBranch: repoQuery.data?.data.default_branch,
            repo: repo as string | undefined,
            owner: owner as string | undefined,
            repoRef: Array.isArray(repoRef) ? repoRef[0] : repoRef,
            setRepoRef,
        }}>
            {children}
        </RepoContext.Provider>
    );
}

export const useRepo = () => {

    const context = useContext(RepoContext);

    return context;
};
