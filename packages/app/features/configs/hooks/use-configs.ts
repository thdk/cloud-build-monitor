import { useCollectionData } from "react-firebase-hooks/firestore";
import { configConverter, createFindConfigsBySectionQuery } from "../firestore";
import { Config, ConfigSection } from "../types";

export const useConfigs = (section?: ConfigSection) => {
    
    return useCollectionData(
        createFindConfigsBySectionQuery(section)
            .withConverter<Config>(configConverter),
    );
};
