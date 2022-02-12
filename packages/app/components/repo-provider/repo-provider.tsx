import { createContext, useContext } from "react";

export const RepoContext = createContext<{
    repo?: string;
    owner?: string;
    ref?: string;
}>({} as any);

export const useRepoContext = () => useContext(RepoContext);
