import { initializeApp } from "firebase-admin/app";
import { applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp(
    {
        credential: applicationDefault(),
        projectId: process.env.GCP_PROJECT,
    }
);

export const db = getFirestore();
