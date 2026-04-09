// ============================================================
// SMS Opt-in Confirmation — standalone, independent module
//
// Callable Cloud Function invoked from the /sms-optin page.
// Sends a confirmation SMS to the user after they opt in.
//
// Uses Twilio SDK directly — credentials loaded from functions/.env
// ============================================================

import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {initializeApp, getApps} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {sendSMS, SMSTemplates} from "./smsService.js";

if (getApps().length === 0) {
  initializeApp();
}
const db = getFirestore();


export const smsOptinConfirmation = onCall(
  {region: "us-central1"},
  async (request) => {
    const {phone} = request.data || {};

    if (!phone || typeof phone !== "string") {
      throw new HttpsError("invalid-argument", "A valid phone number is required.");
    }

    const formatted = phone.startsWith("+") ?
      phone :
      `+1${phone.replace(/\D/g, "")}`;

    try {
        // Save or update the consent record directly on backend rather than frontend doing it
        // We will default to looking up user by phone if uid is absent
        const uid = request.auth ? request.auth.uid : null;
        
        let matchingUser = null;
        
        if (uid) {
            matchingUser = await db.collection("users").doc(uid).get();
        } else {
             // Find by phone
             const userPhoneQuery = await db.collection("users")
                .where("phone", "==", formatted)
                .limit(1)
                .get();
                
             if (!userPhoneQuery.empty) {
                 matchingUser = userPhoneQuery.docs[0];
             }
        }
        
        const ipAddress = request.rawRequest ? request.rawRequest.ip : 'unknown';

        if (matchingUser && matchingUser.exists) {
            // Update the existing user array
            await db.collection("users").doc(matchingUser.id).update({
                smsConsent: true,
                smsConsentTimestamp: new Date().toISOString(),
                smsConsentSource: "sms-optin-page",
                phone: formatted
            });
        }

        // We also create an audit trail generic record like the frontend used to do
        await db.collection("sms_optin_consents").add({
            phone: formatted,
            consentTimestamp: new Date().toISOString(),
            consentSource: "sms-optin-page",
            ipAddress,
            smsConsent: true
        });

      const body = SMSTemplates.optInConfirmation();

      const result = await sendSMS({
          to: formatted,
          body: body,
          smsConsent: true, // We just verified they opted in!
          eventType: 'opt_in_confirmation',
          userId: matchingUser ? matchingUser.id : null
      });

      if (!result.sent) {
          throw new Error("sendSMS returned failure: " + result.error);
      }

      // Log to Firestore for tracking
      await db.collection("sms_logs").add({
        to: formatted,
        messageSid: result.sid,
        status: "sent",
        type: "optin_confirmation",
        bodyLength: body.length,
        createdAt: new Date(),
      });

      return {success: true, messageSid: result.sid};
    } catch (error) {
      logger.error("sms_optin.failed", {
        error: error?.message,
        code: error?.code,
      });
      throw new HttpsError("internal", "Failed to send SMS. Please try again.");
    }
  },
);
