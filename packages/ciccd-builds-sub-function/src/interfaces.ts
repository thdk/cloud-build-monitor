export interface CICCDBuild {
    readonly name: string;
    readonly status: string;
    readonly origin: string;
    readonly commitSha: string;
    readonly repo: string;
    readonly branchName: string;
    readonly id: string;
    readonly githubRepoOwner: string;
    readonly logUrl: string;
}
