import { createContext, useContext } from "react";
import { TagsDictionary } from "../../github/tags";

export const RepoContext = createContext<{
    repo?: string;
    owner?: string;
    ref?: string;
    tagDictionary: TagsDictionary;
}>({
    tagDictionary: {},
} as any);

export const useRepoContext = () => useContext(RepoContext);
