import { BuildStatus } from "../chat-notifications/types";

export interface JiraUpdate {
    description?: string;
    branchFilterRegex?: string;
    message: string;
    buildTrigger: string;
    id: string;
    statuses: BuildStatus[];
    name?: string;
}