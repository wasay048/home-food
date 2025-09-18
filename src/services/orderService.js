import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
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
          console.log("🏃 [ORDER SERVICE] Processing Go&Grab item...");
          console.log("🏃 [ORDER SERVICE] Item details:", {
            foodItemId: item.foodItemId,
            quantity: item.quantity,
            quantityType: typeof item.quantity,
          });

          // 🆕 Try to find the food document using the same pattern as foodService.js
          let foodRef = null;
          let currentDoc = null;

          // First, try to find it in the kitchen's subcollection
          if (orderData.kitchenId) {
            foodRef = doc(
              db,
              "kitchens",
              orderData.kitchenId,
              "foodItems",
              item.foodItemId
            );

            try {
              currentDoc = await getDoc(foodRef);
            } catch (error) {
              currentDoc = null;
            }
          }

          // If not found in kitchen subcollection, try top-level foodItems collection
          if (!currentDoc || !currentDoc.exists()) {
            foodRef = doc(db, "foodItems", item.foodItemId);

            try {
              currentDoc = await getDoc(foodRef);
            } catch (error) {
              console.log("error", error);
            }
          }

          // Continue with the existing logic if document is found
          if (currentDoc && currentDoc.exists()) {
            const currentData = currentDoc.data();

            console.log("📄 [ORDER SERVICE] Current food item data:", {
              documentId: item.foodItemId,
              exists: true,
              foundIn: foodRef.path, // This will show the actual path used
              currentData: {
                numAvailable: currentData.numAvailable,
                numOfSoldItem: currentData.numOfSoldItem,
                name: currentData.name,
                allFields: Object.keys(currentData),
              },
            });

            // Continue with your existing calculation logic...
            const currentSold = currentData.numOfSoldItem || 0;
            const currentAvailable = currentData.numAvailable || 0;
            const orderQuantity = parseInt(item.quantity);

            const newSoldItems = currentSold + orderQuantity;
            const newAvailableItems = Math.max(
              0,
              currentAvailable - orderQuantity
            );

            // ... rest of your existing update logic
            console.log("📊 [ORDER SERVICE] Inventory calculation:", {
              currentSold,
              currentAvailable,
              orderQuantity,
              newSoldItems,
              newAvailableItems,
              calculation: `Sold: ${currentSold} + ${orderQuantity} = ${newSoldItems}, Available: ${currentAvailable} - ${orderQuantity} = ${newAvailableItems}`,
            });

            // Validate the calculation
            if (isNaN(newSoldItems) || isNaN(newAvailableItems)) {
              const errorMsg = `Invalid calculation: newSoldItems=${newSoldItems}, newAvailableItems=${newAvailableItems}`;
              throw new Error(errorMsg);
            }

            // Update with absolute values
            console.log(
              "🔄 [ORDER SERVICE] Updating document with new values..."
            );

            await updateDoc(foodRef, {
              numOfSoldItem: newSoldItems,
              numAvailable: newAvailableItems,
            });
          } else {
            const errorMsg = `Food item document not found: ${item.foodItemId}`;
            console.error(`❌ [ORDER SERVICE] ${errorMsg}`);
            console.error("❌ [ORDER SERVICE] Tried both paths:", [
              `kitchens/${orderData.kitchenId}/foodItems/${item.foodItemId}`,
              `foodItems/${item.foodItemId}`,
            ]);
          }
        } else if (item.orderType === "preorder") {
          console.log("📅 [ORDER SERVICE] Processing PreOrder item...");

          // For PreOrder: Update the kitchen's preorderSchedule
          const kitchenRef = doc(db, "kitchens", orderData.kitchenId);

          // Get the pickup date for this item
          const pickupDate =
            item.pickupDate instanceof Date
              ? dayjs(item.pickupDate).format("YYYY-MM-DD")
              : dayjs(item.pickupDate).format("YYYY-MM-DD");

          console.log("📅 [ORDER SERVICE] PreOrder details:", {
            kitchenId: orderData.kitchenId,
            pickupDate: pickupDate,
            originalPickupDate: item.pickupDate,
            foodItemId: item.foodItemId,
            quantity: item.quantity,
          });

          // First, get the current kitchen data to find the correct array index
          const kitchenDoc = await getDoc(kitchenRef);
          if (kitchenDoc.exists()) {
            const kitchenData = kitchenDoc.data();
            console.log("🏪 [ORDER SERVICE] Kitchen data retrieved");
            console.log("🏪 [ORDER SERVICE] PreorderSchedule structure:", {
              hasPreorderSchedule: !!kitchenData.preorderSchedule,
              hasDates: !!kitchenData.preorderSchedule?.dates,
              availableDates: kitchenData.preorderSchedule?.dates
                ? Object.keys(kitchenData.preorderSchedule.dates)
                : [],
            });

            const dateSchedule =
              kitchenData.preorderSchedule?.dates?.[pickupDate];

            console.log(
              "📅 [ORDER SERVICE] Date schedule for",
              pickupDate,
              ":",
              {
                exists: !!dateSchedule,
                isArray: Array.isArray(dateSchedule),
                length: dateSchedule?.length || 0,
                items:
                  dateSchedule?.map((item) => ({
                    foodItemId: item.foodItemId,
                    numOfAvailableItems: item.numOfAvailableItems,
                    nameOfFood: item.nameOfFood,
                  })) || [],
              }
            );

            if (dateSchedule && Array.isArray(dateSchedule)) {
              // Find the index of the food item in the schedule
              const foodIndex = dateSchedule.findIndex(
                (scheduleItem) => scheduleItem.foodItemId === item.foodItemId
              );

              console.log("🔍 [ORDER SERVICE] Food item search:", {
                searchingForFoodId: item.foodItemId,
                foundAtIndex: foodIndex,
                totalItemsInSchedule: dateSchedule.length,
              });

              if (foodIndex !== -1) {
                // Get the current food item data to preserve all attributes
                const currentFoodItem = dateSchedule[foodIndex];
                const currentAvailable =
                  currentFoodItem.numOfAvailableItems || 0;
                const newAvailable = Math.max(
                  0,
                  currentAvailable - item.quantity
                );

                console.log("📊 [ORDER SERVICE] Availability calculation:", {
                  currentFoodItem: currentFoodItem,
                  currentAvailable: currentAvailable,
                  orderedQuantity: item.quantity,
                  newAvailable: newAvailable,
                  calculation: `${currentAvailable} - ${item.quantity} = ${newAvailable}`,
                });

                // Create updated food item object preserving all attributes
                const updatedFoodItem = {
                  ...currentFoodItem,
                  numOfAvailableItems: !currentFoodItem?.isLimitedOrder
                    ? currentAvailable
                    : newAvailable,
                };

                console.log(
                  "🔄 [ORDER SERVICE] Updated food item object:",
                  updatedFoodItem
                );

                // Create new array with updated item
                const updatedDateSchedule = [...dateSchedule];
                updatedDateSchedule[foodIndex] = updatedFoodItem;

                console.log("📋 [ORDER SERVICE] Updated schedule array:", {
                  originalLength: dateSchedule.length,
                  updatedLength: updatedDateSchedule.length,
                  updatedIndex: foodIndex,
                  updatedItem: updatedDateSchedule[foodIndex],
                });

                // Update the entire date schedule array
                const updatePath = `preorderSchedule.dates.${pickupDate}`;

                console.log("🔄 [ORDER SERVICE] Updating Firestore:", {
                  updatePath: updatePath,
                  dataToUpdate: updatedDateSchedule,
                });

                await updateDoc(kitchenRef, {
                  [updatePath]: updatedDateSchedule,
                });

                console.log(
                  `✅ [ORDER SERVICE] Updated PreOrder for food ${item.foodItemId} on ${pickupDate}: available ${currentAvailable} -> ${newAvailable} (ordered: ${item.quantity})`
                );
              } else {
                const errorMsg = `Food item ${item.foodItemId} not found in preorder schedule for ${pickupDate}`;
                console.warn(`⚠️ [ORDER SERVICE] ${errorMsg}`);

                // const availableItems = dateSchedule
                //   .map((scheduleItem) => scheduleItem.nameOfFood)
                //   .join(", ");

                console.warn(
                  "⚠️ [ORDER SERVICE] Available food items in schedule:",
                  dateSchedule.map((scheduleItem) => ({
                    foodItemId: scheduleItem.foodItemId,
                    nameOfFood: scheduleItem.nameOfFood,
                  }))
                );
              }
            } else {
              const errorMsg = `No preorder schedule found for date ${pickupDate}`;
              console.warn(`⚠️ [ORDER SERVICE] ${errorMsg}`);

              console.warn(
                "⚠️ [ORDER SERVICE] Available dates:",
                kitchenData.preorderSchedule?.dates
                  ? Object.keys(kitchenData.preorderSchedule.dates)
                  : "No dates object"
              );
            }
          } else {
            const errorMsg = `Kitchen document not found: ${orderData.kitchenId}`;
            console.error(`❌ [ORDER SERVICE] ${errorMsg}`);
          }
        } else {
          const errorMsg = `Unknown order type: ${item.orderType}`;
          console.warn(`⚠️ [ORDER SERVICE] ${errorMsg}`);
        }
      } catch (error) {
        const errorMsg = `Could not update item ${item.foodItemId} (${item.orderType}): ${error.message}`;
        console.error(errorMsg, error);
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
    orderType = "preorder";
  } else if (hasPreOrder && hasGrabAndGo) {
    orderType = "preorder";
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
      item.pickupDetails.orderType === "PRE_ORDER" ? "preorder" : "grabAndGo",
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
