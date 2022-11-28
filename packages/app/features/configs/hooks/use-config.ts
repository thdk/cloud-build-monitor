import { useQuery, UseQueryResult } from "react-query";
import { getConfigById } from "../firestore";

export interface IConfigData {
    value: string,
}

export function useConfig(id: string): UseQueryResult<IConfigData>;
export function useConfig(id: string, throwOnError: false): UseQueryResult<IConfigData | undefined>;
export function useConfig(id: string, throwOnError = true): UseQueryResult<IConfigData | undefined>  {
    const configQuery = useQuery<typeof throwOnError extends true ? IConfigData : IConfigData | undefined >(
        [
            'config',
            id,
        ],
        async () => {
            const snapshot = await getConfigById(id);
            const data = snapshot.data();
            if (!data && throwOnError) {
                throw new Error(`Config with key ${id} does not exist`);
            } else {
                return data as unknown as IConfigData;
            }
        },
        {},
    );

    return configQuery;
};
