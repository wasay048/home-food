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
import twilio from "twilio";

if (getApps().length === 0) {
  initializeApp();
}
const db = getFirestore();

const OPTIN_CONFIRMATION_MSG =
  "HomeFresh: You're now subscribed to order confirmation and status SMS " +
  "updates. Msg frequency varies per order. Msg & Data rates may apply. " +
  "Reply STOP to unsubscribe, HELP for help.";

export const smsOptinConfirmation = onCall(
  {region: "us-central1"},
  async (request) => {
    const {phone} = request.data || {};

    if (!phone || typeof phone !== "string") {
      throw new HttpsError("invalid-argument", "A valid phone number is required.");
    }

    const accountSid = process.env.TWILIO_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE;

    if (!accountSid || !authToken || !fromPhone) {
      logger.error("sms_optin.missing_env", {
        hasSid: !!accountSid,
        hasToken: !!authToken,
        hasPhone: !!fromPhone,
      });
      throw new HttpsError("internal", "SMS service is not configured.");
    }

    // Ensure phone has country code (default to +1 for US)
    const formatted = phone.startsWith("+") ?
      phone :
      `+1${phone.replace(/\D/g, "")}`;

    try {
      const client = twilio(accountSid, authToken);

      const message = await client.messages.create({
        body: OPTIN_CONFIRMATION_MSG,
        from: fromPhone,
        to: formatted,
      });

      logger.info("sms_optin.sent", {
        sid: message.sid,
        to: formatted.substring(0, 6) + "****",
      });

      // Log to Firestore for tracking
      await db.collection("sms_logs").add({
        to: formatted,
        messageSid: message.sid,
        status: message.status,
        type: "optin_confirmation",
        bodyLength: OPTIN_CONFIRMATION_MSG.length,
        createdAt: new Date(),
      });

      return {success: true, messageSid: message.sid};
    } catch (error) {
      logger.error("sms_optin.failed", {
        error: error?.message,
        code: error?.code,
      });
      throw new HttpsError("internal", "Failed to send SMS. Please try again.");
    }
  },
);
