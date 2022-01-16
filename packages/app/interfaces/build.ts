import { DocumentData, QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

export interface CICCDBuild {
    readonly name: string;
    readonly status: string;
    readonly origin: string;
    readonly commitSha: string;
    readonly repo: string;
    readonly branchName: string;
}

export const CICCDBuildConverter = {
    toFirestore(build: CICCDBuild): DocumentData {
        return build;
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): CICCDBuild {
        return snapshot.data(options)! as CICCDBuild;
    }
};