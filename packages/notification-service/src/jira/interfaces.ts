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

export interface JiraUpdate {
    readonly name: string;
    readonly message: string;
    readonly issueRegex: string;
    readonly branchFilterRegex?: string;
    readonly transition?: string;
}

export interface JiraUpdateFirestoreData extends Omit<JiraUpdate, "issueRegex"> {
    readonly issueRegex?: string;
 }