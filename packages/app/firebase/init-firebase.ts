import { FirebaseOptions, getApps, initializeApp } from "firebase/app";

const config: FirebaseOptions = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    // storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    // messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function intitializeFirebase() {

    const apps = getApps();
    if (apps.length) {
        return;
    }

    if (!config.apiKey) {
        console.error("Firebase api key missing: NEXT_PUBLIC_FIREBASE_API_KEY");
    }

    if (!config.authDomain) {
        console.error("Firebase authDomain missing: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
    }

    if (!config.projectId) {
        console.error("Firebase project id missing: NEXT_PUBLIC_FIREBASE_PROJECT_ID");
    }

    if (!config.appId) {
        console.error("Firebase app idd missing: NEXT_PUBLIC_FIREBASE_APP_ID")
    }

    initializeApp(config);
}
