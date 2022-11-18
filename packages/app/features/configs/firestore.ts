import { collection, getDocs, getFirestore, query, QueryDocumentSnapshot, where } from "firebase/firestore";
import { Config, ConfigSection } from "./types";

export const CONFIG_COLLECTION = "configs" as const;

export const configConverter = {
    toFirestore: (appData: Config) => {
        delete (appData as any).id;
        return appData;
    },
    fromFirestore: (docData: QueryDocumentSnapshot<Config>) => {
        return {
            ...docData.data(),
            id: docData.id,
        } as unknown as Config;
    },
};

export const getAllConfigsQuery = collection(getFirestore(), CONFIG_COLLECTION);

export const getAllConfigs = () => getDocs(getAllConfigsQuery);

export const createFindConfigsBySectionQuery = (section?: ConfigSection) => {
    let baseQuery = query(getAllConfigsQuery);
    
    if (section) {
        baseQuery = query(baseQuery, where("section", "==", section));
    }

    return baseQuery;
};
