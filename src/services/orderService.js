import {
  collection,
  addDoc,
  doc,
  updateDoc,
  increment,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import dayjs from "../lib/dayjs";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Create and place an order in Firestore
 * @param {Object} orderData - The order data object
 * @returns {Promise<string>} - The order document ID
 */
export const placeOrder = async (orderData) => {
  try {
    console.log("Placing order with data:", orderData);

    // Add the order to the 'orders' collection
    const orderRef = await addDoc(collection(db, "orders"), orderData);

    console.log("Order placed successfully with ID:", orderRef.id);

    // Update the order document with the orderIDKey (using the document ID)
    await updateDoc(orderRef, {
      orderIDKey: orderRef.id,
    });

    for (const item of orderData.orderedFoodItems) {
      try {
        if (item.orderType === "grabAndGo") {
          // For Go&Grab: Update the foodItems collection
          const foodRef = doc(db, "foodItems", item.foodItemId);
          await updateDoc(foodRef, {
            numOfSoldItem: increment(item.quantity),
            numberOfAvailableItem: increment(-item.quantity),
          });
          console.log(
            `Updated Go&Grab food item ${item.foodItemId}: sold +${item.quantity}, available -${item.quantity}`
          );
        } else if (item.orderType === "preOrder") {
          // For PreOrder: Update the kitchen's preorderSchedule
          const kitchenRef = doc(db, "kitchens", orderData.kitchenId);

          // Get the pickup date for this item
          const pickupDate =
            item.pickupDate instanceof Date
              ? dayjs(item.pickupDate).format("YYYY-MM-DD")
              : dayjs(item.pickupDate).format("YYYY-MM-DD");

          // First, get the current kitchen data to find the correct array index
          const kitchenDoc = await getDoc(kitchenRef);
          if (kitchenDoc.exists()) {
            const kitchenData = kitchenDoc.data();
            const dateSchedule =
              kitchenData.preorderSchedule?.dates?.[pickupDate];

            if (dateSchedule && Array.isArray(dateSchedule)) {
              // Find the index of the food item in the schedule
              const foodIndex = dateSchedule.findIndex(
                (scheduleItem) => scheduleItem.foodItemId === item.foodItemId
              );

              if (foodIndex !== -1) {
                // Update the specific food item's available count
                const fieldPath = `preorderSchedule.dates.${pickupDate}.${foodIndex}.numOfAvailableItems`;
                await updateDoc(kitchenRef, {
                  [fieldPath]: increment(-item.quantity),
                });

                console.log(
                  `Updated PreOrder for food ${item.foodItemId} on ${pickupDate}: available -${item.quantity}`
                );
              } else {
                console.warn(
                  `Food item ${item.foodItemId} not found in preorder schedule for ${pickupDate}`
                );
              }
            } else {
              console.warn(`No preorder schedule found for date ${pickupDate}`);
            }
          }
        }
      } catch (error) {
        console.error(
          `Could not update item ${item.foodItemId} (${item.orderType}):`,
          error
        );
      }
    }

    return orderRef.id;
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
};

/**
 * Generate a unique order ID (6-digit number)
 * @returns {string} - A unique 6-digit order ID
 */
export const generateOrderID = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate order object from cart data
 * @param {Object} params - Parameters for creating order
 * @returns {Object} - The order object ready for Firestore
 */
export const createOrderObject = ({
  cartItems,
  kitchenInfo,
  firebaseImageUrl,
  currentUser,
  paymentCalculation,
  groupedCartItems,
}) => {
  const now = new Date();
  const orderID = generateOrderID();

  // Determine order type based on cart items
  const hasPreOrder = Object.keys(groupedCartItems.preOrders).length > 0;
  const hasGrabAndGo = groupedCartItems.grabAndGo.length > 0;

  let orderType = "grabAndGo";
  if (hasPreOrder && !hasGrabAndGo) {
    orderType = "preOrder";
  } else if (hasPreOrder && hasGrabAndGo) {
    orderType = "mixed";
  }

  // Calculate pickup date based on order type
  let datePickedUp = now;
  if (hasPreOrder) {
    // Use the earliest preorder date
    const preOrderDates = Object.keys(groupedCartItems.preOrders);
    if (preOrderDates.length > 0) {
      const earliestDate = preOrderDates.sort()[0];
      datePickedUp = new Date(earliestDate);
    }
  }

  // Transform cart items to order format
  const orderedFoodItems = cartItems.map((item) => ({
    countRating: 0,
    foodItemId: item.foodId || item.id,
    id: generateUniqueId(), // Generate a unique ID for the order item
    imageUrl: item.food?.imageUrl || item.food?.image || "",
    isFromPreorder:
      item.pickupDetails?.orderType === "PRE_ORDER" || item.isPreOrder || false,
    name: item.food?.name || "Unknown Item",
    numOfLike: item.food?.numOfLike || 0,
    numOfSoldItem: item.food?.numOfSoldItem || 0,
    numberOfAvailableItem: item.food?.numberOfAvailableItem || 0,
    quantity: parseInt(item.quantity || 1),
    orderStatus: "inProgress",
    orderType:
      item.pickupDetails.orderType === "PRE_ORDER" ? "preOrder" : "grabAndGo",
    rating: 0,
    specialInstructions: item.specialInstructions || "",
    preOrder: {
      availableTimes: [],
      foodItemId: item.foodId || item.id,
      id: generateUniqueId(),
      isLimitedOrder: item?.food?.isLimitedOrder || false,
      nameOfFood: item.food?.name || "Unknown Item",
      numOfAvailableItems: item.food?.numberOfAvailableItem || 0,
      price: parseFloat(item.food?.cost || item.food?.price || 0),
    },
    price: parseFloat(item.food?.cost || item.food?.price || 0),
    pickupDate: new Date(item.selectedDate),
    pickupTime: item.selectedTime || "4:30 PM",
  }));

  // Create the order object
  const orderObject = {
    datePickedUp: datePickedUp,
    datePlaced: now,
    kitchenId: kitchenInfo?.id || kitchenInfo?.kitchenId,
    kitchenName: kitchenInfo?.name,
    orderID: orderID,
    orderIDKey: "", // Will be set after document creation
    orderPaymentImage: firebaseImageUrl || "",
    orderStatus: "inProgress",
    orderTotalCoast: parseFloat(paymentCalculation.totalPayment),
    orderType: orderType,
    orderedFoodItems: orderedFoodItems,
    paymentVia: {
      other: {},
    },
    pickUpAddress: kitchenInfo?.address,
    userId: currentUser?.id,
    // Additional metadata
    subtotal: parseFloat(paymentCalculation.subtotal),
    salesTax: parseFloat(paymentCalculation.salesTax),
    taxRate: 0.0725,
  };

  return orderObject;
};

/**
 * Generate a unique ID (similar to UUID format)
 * @returns {string} - A unique identifier
 */
const generateUniqueId = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16).toUpperCase();
  });
};
