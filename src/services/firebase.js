import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// Build config from env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

function looksPopulated(value) {
  return (
    typeof value === "string" &&
    value.trim() !== "" &&
    !value.startsWith("your_") &&
    !/^1:000000|xxxxxxxx|your_project/.test(value)
  );
}

const configValid = ["apiKey", "authDomain", "projectId", "appId"].every((k) =>
  looksPopulated(firebaseConfig[k])
);

export const firebaseDisabled = !configValid;

let firebaseApp = null;
let db = null;
let analyticsPromise = Promise.resolve(null);

if (!firebaseDisabled) {
  try {
    firebaseApp = initializeApp(firebaseConfig);
    db = getFirestore(firebaseApp);
    analyticsPromise = isSupported().then((y) =>
      y ? getAnalytics(firebaseApp) : null
    );
  } catch (err) {
    console.warn("Firebase disabled due to initialization error:", err.message);
    firebaseApp = null;
    db = null;
    analyticsPromise = Promise.resolve(null);
  }
} else {
  console.info(
    "Firebase not initialized: incomplete or placeholder config (expected; running in disabled mode)"
  );
}

export { firebaseApp, db, analyticsPromise };
