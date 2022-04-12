import { QueryDocumentSnapshot } from "firebase/firestore";
import { BuildArtifact } from "./types";

export const artifactConverter = {
    toFirestore: (appData: BuildArtifact) => {
        delete (appData as any).key;

        return appData;
    },
    fromFirestore: (docData: QueryDocumentSnapshot<BuildArtifact>) => {
        return {
            ...docData.data(),
            key: docData.id,
        } as unknown as BuildArtifact;
    },
};
