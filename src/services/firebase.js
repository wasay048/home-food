import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  getAnalytics,
  isSupported as analyticsIsSupported,
} from "firebase/analytics";
import {
  getRemoteConfig,
  fetchAndActivate,
  getValue,
} from "firebase/remote-config";

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

let firebaseApp, auth, db, storage, analytics, analyticsPromise, remoteConfig;
if (!firebaseDisabled) {
  firebaseApp = getApps().length ? getApps()[0] : initializeApp(config);
  auth = getAuth(firebaseApp);
  db = getFirestore(firebaseApp);
  storage = getStorage(firebaseApp);

  // Initialize Remote Config
  remoteConfig = getRemoteConfig(firebaseApp);
  // Set minimum fetch interval (in production, use longer intervals)
  remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hour

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

// Helper function to fetch and get remote config values
export const fetchRemoteConfig = async () => {
  if (firebaseDisabled || !remoteConfig) {
    console.log(
      "🔧 [RemoteConfig] Firebase disabled, no remote config available"
    );
    return null;
  }

  try {
    await fetchAndActivate(remoteConfig);
    console.log("🔧 [RemoteConfig] Fetched and activated successfully");
    return true;
  } catch (error) {
    console.error("🔧 [RemoteConfig] Error fetching:", error);
    return false;
  }
};

// Helper function to get delivery fees from remote config
export const getDeliveryFees = () => {
  if (firebaseDisabled || !remoteConfig) {
    console.log(
      "🔧 [RemoteConfig] Firebase disabled, cannot get delivery fees"
    );
    return null;
  }

  try {
    const deliveryFeesValue = getValue(remoteConfig, "deliveryFees");
    const feesString = deliveryFeesValue.asString();
    console.log("🔧 [RemoteConfig] Raw deliveryFees value:", feesString);

    if (feesString) {
      const parsed = JSON.parse(feesString);
      console.log("🔧 [RemoteConfig] Parsed deliveryFees:", parsed);
      return parsed;
    }
    console.warn(
      "🔧 [RemoteConfig] No deliveryFees value found in Remote Config"
    );
    return null;
  } catch (error) {
    console.error("🔧 [RemoteConfig] Error parsing delivery fees:", error);
    return null;
  }
};

export {
  firebaseApp,
  auth,
  db,
  storage,
  analytics,
  analyticsPromise,
  remoteConfig,
};
