import { useConfig } from "./use-config"

export const useIssueTracker = () => {
    const config = useConfig();

    return config.isSuccess 
        ? {
            url: config.data?.issueTrackerUrl,
        }
        : undefined;
};
