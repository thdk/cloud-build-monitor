import { getDocs, collection } from "firebase/firestore";
import { PropsWithChildren } from "react";
import { useQuery } from "react-query";
import { IAppContext, AppContext } from "../../contexts/app-context";
import { firestore } from "../../firebase/init-firebase";

export function Layout({
    children,
}: PropsWithChildren<unknown>) {
    const configQuery = useQuery(
        ['config'],
        async () => {
            const snapshot = await getDocs(collection(firestore, "config"));

            return snapshot.docs.reduce((p, c) => {
                p[c.id as keyof IAppContext] = c.data().value;
                return p;
            }, {} as IAppContext);
        },
        {},
    );

    return configQuery.isSuccess
        ? (
            <AppContext.Provider value={configQuery.data}>
                {children}
            </AppContext.Provider>
        ) : null;
}
