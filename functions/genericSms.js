// ============================================================
// Generic SMS — callable cloud function
//
// Generic single-recipient SMS sender. The iOS app (or any
// authenticated client) builds the full message body and calls
// this function with the recipient's phone number.
//
// Use cases (per spec 4.5 / 4.6):
//   - Purchase summary SMS after a transaction
//   - Credit-added confirmation SMS after admin approves credit
//   - Any other one-off transactional SMS the iOS app needs
//
// Payload (only phone + message are required):
//   {
//     phone:     "+15551234567",        // required, E.164 preferred
//     message:   "Your full SMS body",  // required, <= 1000 chars
//     eventType: "purchase_summary",    // optional, defaults to "generic"
//     userId:    "abc123",              // optional, recipient uid for audit
//     metadata:  { ... },               // optional, stored on audit row
//   }
//
// Returns:
//   { success: true,  sid: "SM..." }                  // on success
//   { success: false, error: "reason" }               // on skipped/failure
//
// Auth: caller must be signed in (request.auth required).
// ============================================================

import {onCall, HttpsError} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {initializeApp, getApps} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import {sendSMS} from "./smsService.js";

if (getApps().length === 0) {
  initializeApp();
}
const db = getFirestore();

const MAX_MESSAGE_LENGTH = 1000;

function maskPhone(phone) {
  if (!phone || phone.length < 6) return "****";
  return phone.substring(0, 5) + "****";
}

export const sendGenericSms = onCall(
  {region: "us-central1"},
  async (request) => {
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "You must be signed in to send SMS.",
      );
    }

    const {phone, message, eventType, userId, metadata} = request.data || {};

    if (!phone || typeof phone !== "string" || phone.trim().length === 0) {
      throw new HttpsError(
        "invalid-argument",
        "A valid phone number is required.",
      );
    }

    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      throw new HttpsError(
        "invalid-argument",
        "A non-empty message is required.",
      );
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      throw new HttpsError(
        "invalid-argument",
        `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters.`,
      );
    }

    const resolvedEventType =
      eventType && typeof eventType === "string" ? eventType : "generic";

    const callerUid = request.auth.uid;
    const trimmedMessage = message.trim();
    const formattedPhone = phone.startsWith("+") ?
      phone :
      `+1${phone.replace(/\D/g, "")}`;

    logger.info("generic_sms.start", {
      callerUid,
      eventType: resolvedEventType,
      targetUserId: userId || null,
      phone: maskPhone(formattedPhone),
      messageLength: trimmedMessage.length,
    });

    const result = await sendSMS({
      to: formattedPhone,
      body: trimmedMessage,
      eventType: resolvedEventType,
      userId: userId || callerUid,
    });

    try {
      await db.collection("sms_logs").add({
        callerUid,
        targetUserId: userId || null,
        phone: maskPhone(formattedPhone),
        eventType: resolvedEventType,
        type: "generic",
        bodyLength: trimmedMessage.length,
        status: result.sent ? "sent" : "failed",
        sid: result.sid || null,
        error: result.error || result.skippedReason || null,
        metadata: metadata || null,
        createdAt: new Date(),
      });
    } catch (logErr) {
      logger.error("generic_sms.log_failed", {
        callerUid,
        error: logErr?.message,
      });
    }

    if (!result.sent) {
      logger.warn("generic_sms.not_sent", {
        callerUid,
        eventType: resolvedEventType,
        reason: result.error || result.skippedReason,
      });
      return {
        success: false,
        error: result.error || result.skippedReason || "SMS not sent",
      };
    }

    logger.info("generic_sms.complete", {
      callerUid,
      eventType: resolvedEventType,
      sid: result.sid,
    });

    return {success: true, sid: result.sid};
  },
);
