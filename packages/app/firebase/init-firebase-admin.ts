import {
  applicationDefault,
  cert,
  getApp,
  getApps,
  initializeApp,
} from "firebase-admin/app";


async function getFirebaseAdminApp() {


  return initializeApp(
    {
      credential: applicationDefault(),
    }
  );
}

export async function createFirebaseAdminApp() {
  if (getApps().length === 0) {
    const firebaseApp = await getFirebaseAdminApp();
    return firebaseApp;
  } else {
    return getApp();
  }
}
