// All SMS sending in the entire application must go through this service
// Direct Twilio client.messages.create calls outside this file are forbidden

import twilio from "twilio";
import * as logger from "firebase-functions/logger";

let twilioClient = null;

function getClient() {
  if (!twilioClient) {
    // Support both env var naming conventions
    const sid = process.env.TWILIO_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    if (!sid || !token) {
      logger.warn("[SMS] Twilio credentials missing in environment!");
    } else {
      twilioClient = twilio(sid, token);
    }
  }
  return twilioClient;
}

/**
 * @param {Object} options
 * @param {string} options.to - recipient phone number
 * @param {string} options.body - message content
 * @param {boolean} options.smsConsent - from user record in DB
 * @param {string} [options.userId] - for logging purposes
 * @param {string} options.eventType - e.g. 'order_confirmed', 'order_ready', 'order_delivered'
 * @param {boolean} [options.isTestOrder] - if true, skip sending real SMS (dev/test mode)
 * @returns {Promise<{sent: boolean, sid?: string, skippedReason?: string, error?: string}>}
 */
export const sendSMS = async (options) => {
  const {to, body, userId, eventType, isTestOrder} = options;

  // ✅ SERVER-LEVEL KILL SWITCH: SMS_ENABLED env var (defaults to "true" if not set)
  const smsEnabled = (process.env.SMS_ENABLED || "true").toLowerCase();
  if (smsEnabled === "false") {
    const msg = `[SMS] Skipped (SMS_ENABLED=false) | userId: ${userId || "unknown"} | event: ${eventType}`;
    logger.info(msg);
    console.log(msg);
    return {sent: false, skippedReason: "SMS disabled via SMS_ENABLED env var"};
  }

  // ✅ TEST ORDER CHECK: Skip SMS for orders placed from dev/test environment
  if (isTestOrder) {
    const msg = `[SMS] Skipped (test order) | userId: ${userId || "unknown"} | event: ${eventType} | to: ${to || "none"}`;
    logger.info(msg);
    console.log(msg);
    return {sent: false, skippedReason: "Test order — SMS not sent"};
  }

  // PHONE VALIDATION
  if (!to || to.trim() === "") {
    const msg = `[SMS] Skipped | userId: ${userId || "unknown"} | event: ${eventType} | reason: no phone number`;
    logger.info(msg);
    console.log(msg);
    return {sent: false, skippedReason: "No phone number provided"};
  }

  try {
    const client = getClient();
    if (!client) {
      throw new Error(
        "Twilio client failed to initialize (missing credentials)",
      );
    }

    const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
    if (!messagingServiceSid) {
      throw new Error("TWILIO_MESSAGING_SERVICE_SID is missing in environment");
    }

    // ALWAYS use MessagingServiceSid — never use 'from' with a hardcoded number
    const message = await client.messages.create({
      body,
      messagingServiceSid: messagingServiceSid,
      to: to.startsWith("+") ? to : `+1${to.replace(/\D/g, "")}`,
    });

    const msg = `[SMS] Sent | userId: ${userId || "unknown"} | event: ${eventType} | sid: ${message.sid} | status: ${message.status}`;
    logger.info(msg);
    console.log(msg);
    return {sent: true, sid: message.sid};
  } catch (error) {
    const msg = `[SMS] Failed | userId: ${userId || "unknown"} | event: ${eventType} | error: ${error.message}`;
    logger.error(msg);
    console.error(msg);
    return {sent: false, error: error.message};
  }
};

// Message template builders — one per SMS event type
export const SMSTemplates = {
  orderConfirmed: (
    orderId,
    restaurantName,
    itemList,
    pickupDate,
    pickupTime,
    total,
  ) =>
    `HomeFresh: Order #${orderId} confirmed from ${restaurantName}. Items: ${itemList}. Pickup: ${pickupDate} at ${pickupTime}. Total: $${total}. Reply STOP to unsubscribe.`,

  orderReady: (orderId) =>
    `HomeFresh: Your order #${orderId} is ready for pickup! Please come to the kitchen at your scheduled time. Reply STOP to unsubscribe.`,

  orderDelivered: (orderId, total) =>
    `HomeFresh: Order #${orderId} has been delivered. Total: $${total}. Thank you for ordering with HomeFresh! Reply STOP to unsubscribe.`,

  orderDelayed: (orderId, delayMinutes) =>
    `HomeFresh: Slight delay on order #${orderId}. Ready in ${delayMinutes} minutes. Sorry for the inconvenience. Reply STOP to unsubscribe.`,

  orderStatusUpdate: (orderId, status) =>
    `HomeFresh: Order #${orderId} status update: ${status}. For help visit homefreshfoods.ai or reply HELP. Reply STOP to unsubscribe.`,

  optInConfirmation: () =>
    `HomeFresh: You're now subscribed to order confirmation and status SMS updates. Msg frequency varies per order. Msg & Data rates may apply. Reply STOP to unsubscribe, HELP for help.`,
};
