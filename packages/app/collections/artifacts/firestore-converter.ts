import { QueryDocumentSnapshot } from "firebase/firestore";
import { BuildArtifact } from "./types";

export const artifactConverter = {
    toFirestore: (appData: BuildArtifact) => {
        delete (appData as any).id;

        return appData;
    },
    fromFirestore: (docData: QueryDocumentSnapshot<BuildArtifact>) => {
        return {
            ...docData.data(),
            id: docData.id,
        } as unknown as BuildArtifact;
    },
};
