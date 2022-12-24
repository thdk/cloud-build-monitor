export type BuildStatus = "success" | "failure" | "working" | "queued" | "cancelled" | "timeout";

export type ChatNotification = {
    description?: string;
    branchFilterRegex?: string;
    webhookUrl: string;
    message: string;
    buildTrigger: string;
    id: string;
    statuses: BuildStatus[];
}
