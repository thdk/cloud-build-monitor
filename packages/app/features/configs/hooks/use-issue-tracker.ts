import { useConfig } from "./use-config"

export const useIssueTracker = () => {
    const config = useConfig("issueTrackerUrl");

    return config.isSuccess 
        ? {
            url: config.data.value,
        }
        : undefined;
};
