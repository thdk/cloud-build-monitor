import { collection, getFirestore, query, where } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { configConverter, CONFIG_COLLECTION } from "../firestore";
import { Config, ConfigSection } from "../types";

export const useConfigs = (section?: ConfigSection) => {
    let baseQuery = query(collection(getFirestore(), CONFIG_COLLECTION));
    
    if (section) {
        baseQuery = query(baseQuery, where("section", "==", section));
    }

    return useCollectionData(
        baseQuery
            .withConverter<Config>(configConverter),
    );
};
