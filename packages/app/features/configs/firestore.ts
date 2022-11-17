import { QueryDocumentSnapshot } from "firebase/firestore";
import { Config } from "./types";

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
