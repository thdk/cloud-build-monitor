import {
  cert,
  getApp,
  getApps,
  initializeApp,
} from "firebase-admin/app";


const serviceAccount = require("../firebase-admin.json");
async function getFirebaseAdminApp() {


  return initializeApp(
    {
      credential: cert(serviceAccount)
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
