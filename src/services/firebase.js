import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  getAnalytics,
  isSupported as analyticsIsSupported,
} from "firebase/analytics";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Basic required field check
const requiredKeys = ["apiKey", "authDomain", "projectId", "appId"];
export const firebaseDisabled = requiredKeys.some((k) => !config[k]);

let firebaseApp, auth, db, storage, analytics, analyticsPromise;
if (!firebaseDisabled) {
  firebaseApp = getApps().length ? getApps()[0] : initializeApp(config);
  auth = getAuth(firebaseApp);
  db = getFirestore(firebaseApp);
  storage = getStorage(firebaseApp);
  if (config.measurementId) {
    analyticsPromise = analyticsIsSupported().then((ok) => {
      if (ok) {
        analytics = getAnalytics(firebaseApp);
        return analytics;
      }
      return null;
    });
  } else {
    analyticsPromise = Promise.resolve(null);
  }
} else {
  analyticsPromise = Promise.resolve(null);
}

export { firebaseApp, auth, db, storage, analytics, analyticsPromise };
