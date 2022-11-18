import { useQuery } from "react-query";
import { getAllConfigs } from "../firestore";

export interface IConfigData {
    issueTrackerUrl?: string,
}

export const useConfig = () => {
    const configQuery = useQuery<IConfigData>(
        ['config'],
        async () => {
            const snapshot = await getAllConfigs();

            return snapshot.docs.reduce<IConfigData>((p, c) => {
                p[c.id as keyof IConfigData] = c.data().value;
                return p;
            }, {});
        },
        {},
    );

    return configQuery;
};
