import { collection, getDocs, getFirestore, query, QueryDocumentSnapshot, where } from "firebase/firestore";
import { Config, ConfigSection } from "./types";

export const CONFIG_COLLECTION = "configs" as const;

export const configConverter = {
    toFirestore: (appData: Config) => {
        delete (appData as any).id;
        if (appData.section === undefined) delete appData.section;
        return appData;
    },
    fromFirestore: (docData: QueryDocumentSnapshot<Config>) => {
        const {
            section = undefined,
            ...rest
        } = docData.data();

        return {
            section,
            ...rest,
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
