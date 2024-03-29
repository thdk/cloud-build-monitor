export interface CICCDBuild {
    readonly name: string;
    // todo: add more valid status to status type
    readonly status: "success" | "failure";
    readonly origin: string;
    readonly commitSha: string;
    readonly commitAuthor: string;
    readonly commitSubject: string;
    readonly repo: string;
    readonly branchName: string;
    readonly id: string;
    readonly githubRepoOwner: string;
    readonly logUrl: string | null;
    readonly issueNr: string | null;
    readonly startTime: Date | null;
    readonly finishTime: Date | null;
}

export interface ChatNotification {
    readonly message: string;
    readonly buildTrigger: string;
    readonly webhooks?: string[];
    readonly threadKey?: ThreadKey;
    readonly branchFilterRegex?: string;
    readonly description?: string;
}

export interface ChatNotificationFirestoreData {
    readonly message: string;
    readonly buildTrigger: string;
    readonly webhooks?: string[];
    readonly threadKey?: ThreadKey | null;
    readonly branchFilterRegex?: string;
    readonly description?: string;
}

export type ThreadKey = "author" | "branch" | "sha" | "status" | "trigger";

export interface ChatWebhook {
    readonly url: string;
    readonly name: string;
    readonly description?: string;
}
