import { getDocs, collection, getFirestore } from "firebase/firestore";
import { useQuery } from "react-query";
import { CONFIG_COLLECTION } from "../firestore";

export interface IConfigData {
    issueTrackerUrl?: string,
}

export const useConfig = () => {
    const configQuery = useQuery<IConfigData>(
        ['config'],
        async () => {
            const snapshot = await getDocs(collection(getFirestore(), CONFIG_COLLECTION));

            return snapshot.docs.reduce<IConfigData>((p, c) => {
                p[c.id as keyof IConfigData] = c.data().value;
                return p;
            }, {});
        },
        {},
    );

    return configQuery;
};
