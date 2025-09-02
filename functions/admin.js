import {initializeApp, getApps} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";

if (getApps().length === 0) {
  initializeApp();  // Use default credentials
}

export const admin = {
  auth: () => getAuth(),
};