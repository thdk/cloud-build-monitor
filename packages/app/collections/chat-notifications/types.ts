export type BuildStatus = "success" | "failure" | "working" | "queued" | "cancelled" | "timeout";

export type ChatNotification = {
    description?: string;
    branchFilterRegex?: string;
    webhooks: string[];
    message: string;
    buildTrigger: string;
    id: string;
    statuses: BuildStatus[];
    /**
     * add: will also send this notification if build.status = success if the previous build failed
     * only: (not implemented yet) only send notification for given statuses if the previous build failed
     */
    notifyFix?: "add" | "only";
    threadKey?: string;
    name?: string;
}
