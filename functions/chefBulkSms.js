// ============================================================
// Chef Bulk SMS — callable cloud function
//
// Called from the iOS app (chef mode) to send a custom SMS
// message to multiple customers for selected orders.
//
// Payload:
//   {
//     orderIds: ["orderId1", "orderId2", ...],  // for logging/tracking
//     message: "Your biryani is ready for pickup!",
//     recipients: [
//       { phone: "+15551234567", orderId: "orderId1" },
//       { phone: "+15559876543", orderId: "orderId2" },
//       ...
//     ]
//   }
//
// Returns:
//   {
//     success: true,
//     totalSent: 3,
//     totalFailed: 0,
//     results: [
//       { phone: "+1555***", orderId: "...", status: "sent", sid: "SM..." },
//       { phone: "+1555***", orderId: "...", status: "failed", error: "..." },
//     ]
//   }
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

// Max recipients per call (prevent abuse)
const MAX_RECIPIENTS = 50;

// ============================================================
// Send a single SMS via Twilio
// ============================================================
async function sendOneSms(toPhone, messageBody) {
  const accountSid = process.env.TWILIO_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_PHONE;

  if (!accountSid || !authToken || !fromPhone) {
    throw new Error("Twilio credentials not configured");
  }

  // Ensure phone has country code
  const formatted = toPhone.startsWith("+") ?
    toPhone :
    `+1${toPhone.replace(/\D/g, "")}`;

  const client = twilio(accountSid, authToken);

  const message = await client.messages.create({
    body: messageBody,
    from: fromPhone,
    to: formatted,
  });

  return {sid: message.sid, status: message.status, to: formatted};
}

// ============================================================
// Mask phone for logging (show first 5 chars + ****)
// ============================================================
function maskPhone(phone) {
  if (!phone || phone.length < 6) return "****";
  return phone.substring(0, 5) + "****";
}

// ============================================================
// Main callable function
// ============================================================
export const chefSendBulkSms = onCall(
  {region: "us-central1"},
  async (request) => {
    // ── Validate caller is authenticated ──
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "You must be signed in to send SMS.",
      );
    }

    const {message, recipients, orderIds} = request.data || {};

    // ── Validate inputs ──
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      throw new HttpsError(
        "invalid-argument",
        "A non-empty message is required.",
      );
    }

    if (!Array.isArray(recipients) || recipients.length === 0) {
      throw new HttpsError(
        "invalid-argument",
        "At least one recipient is required.",
      );
    }

    if (recipients.length > MAX_RECIPIENTS) {
      throw new HttpsError(
        "invalid-argument",
        `Too many recipients. Maximum is ${MAX_RECIPIENTS}.`,
      );
    }

    // Validate each recipient has a phone
    for (const r of recipients) {
      if (!r.phone || typeof r.phone !== "string") {
        throw new HttpsError(
          "invalid-argument",
          "Each recipient must have a valid phone number.",
        );
      }
    }

    const chefUid = request.auth.uid;
    const trimmedMessage = message.trim();

    logger.info("chef.bulk_sms.start", {
      chefUid,
      recipientCount: recipients.length,
      orderIds: orderIds || [],
      messageLength: trimmedMessage.length,
    });

    // ── Send to all recipients (parallel) ──
    // Each recipient gets their own order ID in the SMS
    const sendPromises = recipients.map(async (recipient) => {
      try {
        const recipientOrderId = recipient.orderId || "N/A";

        // Build per-recipient SMS with their specific order ID
        const smsBody = [
          `Home Fresh`,
          `Order #${recipientOrderId}`,
          ``,
          trimmedMessage,
          ``,
          `For help visit homefreshfoods.ai or reply HELP.`,
          `Reply STOP to unsubscribe.`,
        ].join("\n");

        const result = await sendOneSms(recipient.phone, smsBody);

        return {
          phone: maskPhone(recipient.phone),
          orderId: recipientOrderId,
          status: "sent",
          sid: result.sid,
        };
      } catch (error) {
        logger.error("chef.bulk_sms.send_failed", {
          chefUid,
          orderId: recipient.orderId || null,
          phone: maskPhone(recipient.phone),
          error: error?.message,
        });

        return {
          phone: maskPhone(recipient.phone),
          orderId: recipient.orderId || null,
          status: "failed",
          error: error?.message || "Unknown error",
        };
      }
    });

    const results = await Promise.all(sendPromises);

    const totalSent = results.filter((r) => r.status === "sent").length;
    const totalFailed = results.filter((r) => r.status === "failed").length;

    // ── Log to Firestore for audit trail ──
    try {
      await db.collection("chef_sms_logs").add({
        chefUid,
        message: trimmedMessage,
        orderIds: orderIds || [],
        recipientCount: recipients.length,
        totalSent,
        totalFailed,
        results,
        createdAt: new Date(),
      });
    } catch (logErr) {
      logger.error("chef.bulk_sms.log_failed", {
        chefUid,
        error: logErr?.message,
      });
    }

    logger.info("chef.bulk_sms.complete", {
      chefUid,
      totalSent,
      totalFailed,
    });

    return {
      success: totalFailed === 0,
      totalSent,
      totalFailed,
      results,
    };
  },
);
