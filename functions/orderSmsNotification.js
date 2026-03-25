// ============================================================
// Order SMS Notification — standalone, independent module
//
// Triggers when a new order is created in Firestore.
// Sends an SMS order summary to the customer's phone number.
//
// Uses Twilio SDK directly — credentials loaded from functions/.env
// ============================================================

import {onDocumentCreated} from "firebase-functions/v2/firestore";
import * as logger from "firebase-functions/logger";
import {initializeApp, getApps} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import twilio from "twilio";

if (getApps().length === 0) {
  initializeApp();
}
const db = getFirestore();

// ============================================================
// Check if an item is category 8 (skip date/time for these)
// ============================================================
function isCategory8(item) {
  try {
    const raw = item.foodCategory;
    if (!raw) return false;
    // Handle both string ("5, 8") and number (8) formats
    const str = String(raw);
    const maxId = Math.max(
      ...str.split(",").map((c) => parseInt(c.trim(), 10)).filter((c) => !isNaN(c)),
      0,
    );
    return maxId === 8;
  } catch {
    return false;
  }
}

// ============================================================
// Build the order summary (same format as kitchen notification)
// ============================================================
function buildOrderSummary(orderData, kitchenName) {
  const items = Array.isArray(orderData.orderedFoodItems) ?
    orderData.orderedFoodItems :
    [];

  const isDelivery = !!orderData.isDeliverydSelected;
  const deliveryLabel = isDelivery ? "deliver on" : "pickup";

  const foodSummary = items
    .map((item, idx) => {
      const name = item.name ?? "Unnamed";
      const qty = item.quantity ?? 0;

      // Skip date/time for category 8 items
      if (isCategory8(item)) {
        return `${idx + 1}. ${name} x${qty}`;
      }

      const dateStr = item.pickupDateString ?? "";
      const timeStr = item.pickupTime ?? "";
      return `${idx + 1}. ${name} x${qty} (${deliveryLabel}: ${dateStr} ${timeStr})`;
    })
    .join("\n");

  const totalAmount = Number(
    orderData.orderTotalCoast ?? orderData.orderTotalCost ?? 0,
  ) || 0;

  return [
    `Order from ${kitchenName}`,
    "",
    `Order Details:\n${foodSummary || "No items found"}`,
    `Total: $${totalAmount.toFixed(2)}`,
  ].join("\n");
}

// ============================================================
// Send SMS via Twilio
// ============================================================
async function sendSms(toPhone, messageBody, orderId) {
  const accountSid = process.env.TWILIO_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_PHONE;

  if (!accountSid || !authToken || !fromPhone) {
    logger.error("sms.missing_env", {
      orderId,
      hasSid: !!accountSid,
      hasToken: !!authToken,
      hasPhone: !!fromPhone,
    });
    return;
  }

  // Ensure phone has country code (default to +1 for US)
  const formatted = toPhone.startsWith("+") ?
    toPhone :
    `+1${toPhone.replace(/\D/g, "")}`;

  // Truncate SMS body if too long (Twilio max ~1600 chars, keep safe margin)
  const MAX_SMS_LENGTH = 1500;
  const finalBody = messageBody.length > MAX_SMS_LENGTH ?
    messageBody.substring(0, MAX_SMS_LENGTH - 30) + "\n\n...see app for full order" :
    messageBody;

  const client = twilio(accountSid, authToken);

  const message = await client.messages.create({
    body: finalBody,
    from: fromPhone,
    to: formatted,
  });

  logger.info("sms.sent", {
    orderId,
    sid: message.sid,
    to: formatted.substring(0, 6) + "****",
    bodyLength: finalBody.length,
  });

  // Log to Firestore for tracking
  await db.collection("sms_logs").add({
    to: formatted,
    orderId,
    messageSid: message.sid,
    status: message.status,
    type: "order_confirmation",
    bodyLength: finalBody.length,
    createdAt: new Date(),
  });
}

// ============================================================
// Main trigger: fires when a new order document is created
// ============================================================
export const onNewOrderSendSms = onDocumentCreated(
  {document: "orders/{orderId}", region: "us-central1"},
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const orderId = event.params.orderId;
    const orderData = snap.data() || {};

    logger.info("order.created", {
      orderId,
      userId: orderData.userId ?? null,
      kitchenId: orderData.kitchenId ?? null,
      itemsCount: Array.isArray(orderData.orderedFoodItems) ?
        orderData.orderedFoodItems.length :
        0,
    });

    const {kitchenId, deliveryPhone} = orderData;
    const newOrderId = String(orderData.orderID ?? orderId);

    if (!deliveryPhone) {
      logger.warn("sms.no_phone", {orderId, field: "deliveryPhone"});
      return;
    }

    // Fetch kitchen name
    let kitchenName = "Home Fresh";
    try {
      if (kitchenId) {
        const kitchenSnap = await db
          .collection("kitchens")
          .doc(kitchenId)
          .get();
        if (kitchenSnap.exists) {
          const kd = kitchenSnap.data();
          kitchenName = kd.name ?? kd.kitchenName ?? kitchenName;
        }
      }
    } catch (err) {
      logger.error("kitchen.fetch_failed", {
        orderId,
        error: err?.message,
      });
    }

    // Build the order summary — wrapped in try/catch so crashes don't kill SMS
    let orderSummary;
    try {
      orderSummary = buildOrderSummary(orderData, kitchenName);
    } catch (err) {
      logger.error("order.summary_build_failed", {
        orderId,
        error: err?.message,
        stack: err?.stack,
      });
      // Fallback: send a simple confirmation without item details
      orderSummary = `Order from ${kitchenName}\n\nYour order has been received.`;
    }

    // Build the full SMS body
    const smsBody = [
      `Home Fresh - Order Confirmation`,
      `Order #${newOrderId}`,
      ``,
      orderSummary,
      ``,
      `Thank you for your order!`,
      `Reply STOP to unsubscribe.`,
    ].join("\n");

    logger.info("order.sms_body_built", {
      orderId,
      bodyLength: smsBody.length,
      itemsCount: orderData.orderedFoodItems?.length ?? 0,
    });

    // Send SMS to customer
    try {
      await sendSms(deliveryPhone, smsBody, orderId);
      logger.info("order.sms_sent", {orderId, orderID: newOrderId});
    } catch (error) {
      // SMS failure should NEVER block other processes
      logger.error("order.sms_failed", {
        orderId,
        error: error?.message,
      });
    }
  },
);
