import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { validateServerEnvironment, requiredFirebaseAdminConfig } from "./config/server-validation";


// Validate environment variables
validateServerEnvironment(requiredFirebaseAdminConfig, 'Firebase Admin');


const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID!,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
  privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
}

const app = !getApps().length
  ? initializeApp({
    credential: cert(serviceAccount)
  })
  : getApps()[0];

const adminAuth = getAuth(app);
const db = getFirestore(app);

export { adminAuth, db };