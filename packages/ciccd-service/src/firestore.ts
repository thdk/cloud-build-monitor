import { initializeApp, applicationDefault,  } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { CICCDBuild } from './interfaces';

initializeApp(
    {
        credential: applicationDefault(),
    }
);

const db = getFirestore();

export async function addOrUpdateCICCDBuild(data: CICCDBuild) {
    
    const buildsCollectionRef = db.collection('builds');
    const document = await buildsCollectionRef.doc(data.id).get();

    await document.exists
        ? document.ref.update({
            updated: FieldValue.serverTimestamp(),
            ...data,
        })
        : document.ref.set({
            ...data,
            created: FieldValue.serverTimestamp(),
            updated: FieldValue.serverTimestamp(),
        });
}