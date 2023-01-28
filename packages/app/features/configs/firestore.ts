import { collection, doc, getDoc, getFirestore, query, QueryDocumentSnapshot, where } from "firebase/firestore";
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

export const createGetAllConfigsQuery = () => collection(getFirestore(), CONFIG_COLLECTION);

export const getConfigById = (id: string) => getDoc(doc(getFirestore(), `${CONFIG_COLLECTION}/${id}`))

export const createFindConfigsBySectionQuery = (section?: ConfigSection) => {
    let baseQuery = query(createGetAllConfigsQuery());
    
    if (section) {
        baseQuery = query(baseQuery, where("section", "==", section));
    }

    return baseQuery;
};
