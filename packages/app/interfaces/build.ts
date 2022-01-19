import { DocumentData, QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

export interface CICCDBuild {
    readonly name: string;
    readonly status: string;
    readonly origin: string;
    readonly commitSha: string;
    readonly commitAuthor: string;
    readonly commitSubject: string;
    readonly repo: string;
    readonly branchName: string;
    readonly githubRepoOwner: string;
    readonly logUrl: string;
    readonly issueNr: string;
    readonly created: Date;
    readonly startTime: Date | null;
    readonly finishTime: Date | null;
}

export const CICCDBuildConverter = {
    toFirestore(build: CICCDBuild): DocumentData {
        return build;
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): CICCDBuild {
        const data = snapshot.data(options);
        
        return {
            ...data,
            created: data.created.toDate(),
            finishTime: data.finishTime?.toDate() || null,
            startTime: data.startTime?.toDate() || null,
        }! as CICCDBuild;
    }
};