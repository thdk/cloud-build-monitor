import { getDocs, collection, getFirestore } from "firebase/firestore";
import { useQuery } from "react-query";

export interface IConfigData {
    issueTrackerUrl: string,
}

export const useConfig = () => {
    const configQuery = useQuery(
        ['config'],
        async () => {
            const snapshot = await getDocs(collection(getFirestore(), "config"));

            return snapshot.docs.reduce((p, c) => {
                p[c.id as keyof IConfigData] = c.data().value;
                return p;
            }, {} as IConfigData);
        },
        {},
    );

    return configQuery;
};
