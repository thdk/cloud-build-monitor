import { getDocs, collection } from "firebase/firestore";
import { useQuery } from "react-query";
import { firestore } from "../firebase/init-firebase";

export interface IConfigData {
    issueTrackerUrl: string,
}

export const useConfig = () => {
    const configQuery = useQuery(
        ['config'],
        async () => {
            const snapshot = await getDocs(collection(firestore, "config"));

            return snapshot.docs.reduce((p, c) => {
                p[c.id as keyof IConfigData] = c.data().value;
                return p;
            }, {} as IConfigData);
        },
        {},
    );

    return configQuery;
};
