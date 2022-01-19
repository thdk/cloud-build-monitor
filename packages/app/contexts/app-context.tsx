import { createContext, PropsWithChildren, useContext } from "react";

export interface IAppContext {
    issueTrackerUrl: string,
}
export const AppContext = createContext<IAppContext>({} as IAppContext);

export function AppContextProvider({ children, context }: PropsWithChildren<{ context: IAppContext }>) {
    return (
        <AppContext.Provider value={context}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AppContext);
}
