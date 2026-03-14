import { collection, addDoc, doc, updateDoc, getDoc, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "./firebase";
import dayjs from "../lib/dayjs";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Validate Go&Grab item availability
 * Uses the same pattern as orderService.js
 */
const validateGrabAndGoAvailability = async (item, kitchenId) => {
  try {
    const foodItemId = item.foodId || item.id;
    const requestedQuantity = item.quantity || 1;

    console.log("🏃 [Validation] Checking Go&Grab item:", {
      foodItemId,
      kitchenId,
      requestedQuantity,
    });

    // Try to find the food document using the same pattern as orderService.js
    let foodRef = null;
    let currentDoc = null;

    // First, try to find it in the kitchen's subcollection
    if (kitchenId) {
      foodRef = doc(db, "kitchens", kitchenId, "foodItems", foodItemId);

      try {
        currentDoc = await getDoc(foodRef);
      } catch (error) {
        console.log("⚠️ [Validation] Not found in kitchen subcollection");
        currentDoc = null;
      }
    }

    // If not found in kitchen subcollection, try top-level foodItems collection
    if (!currentDoc || !currentDoc.exists()) {
      foodRef = doc(db, "foodItems", foodItemId);

      try {
        currentDoc = await getDoc(foodRef);
      } catch (error) {
        console.error("❌ [Validation] Error fetching from foodItems:", error);
      }
    }

    // Check if document exists and validate availability
    if (currentDoc && currentDoc.exists()) {
      const currentData = currentDoc.data();
      const availableQuantity = currentData.numAvailable || 0;

      console.log("📊 [Validation] Go&Grab availability:", {
        name: item.food?.name,
        path: foodRef.path,
        requested: requestedQuantity,
        available: availableQuantity,
        numOfSoldItem: currentData.numOfSoldItem,
      });

      if (availableQuantity < requestedQuantity) {
        return {
          isAvailable: false,
          name: item.food?.name || "Unknown Item",
          reason:
            availableQuantity === 0
              ? "Out of stock"
              : `Only ${availableQuantity} available`,
          requestedQuantity,
          availableQuantity,
          itemData: item,
          orderType: "GO_GRAB",
        };
      }

      return { isAvailable: true };
    } else {
      console.error("❌ [Validation] Food item not found:", {
        foodItemId,
        triedPaths: [
          `kitchens/${kitchenId}/foodItems/${foodItemId}`,
          `foodItems/${foodItemId}`,
        ],
      });

      return {
        isAvailable: false,
        name: item.food?.name || "Unknown Item",
        reason: "Item no longer available",
        requestedQuantity,
        availableQuantity: 0,
        itemData: item,
        orderType: "GO_GRAB",
      };
    }
  } catch (error) {
    console.error("❌ [Validation] Error validating Go&Grab item:", error);
    return {
      isAvailable: false,
      name: item.food?.name || "Unknown Item",
      reason: "Error checking availability",
      requestedQuantity: item.quantity || 1,
      availableQuantity: 0,
      itemData: item,
      orderType: "GO_GRAB",
    };
  }
};

/**
 * Validate PreOrder item availability
 * Considers isLimitedOrder flag - if true (unlimited), skip quantity check
 */
const validatePreOrderAvailability = async (item, kitchenId) => {
  try {
    const foodItemId = item.foodId || item.id;
    const requestedQuantity = item.quantity || 1;
    const pickupDate = item.selectedDate;

    console.log("📅 [Validation] Checking PreOrder item:", {
      foodItemId,
      kitchenId,
      pickupDate,
      requestedQuantity,
    });

    if (!pickupDate) {
      console.error("❌ [Validation] No pickup date for preorder item");
      return {
        isAvailable: false,
        name: item.food?.name || "Unknown Item",
        reason: "Missing pickup date",
        requestedQuantity,
        availableQuantity: 0,
        itemData: item,
        orderType: "PRE_ORDER",
      };
    }

    // Get kitchen document
    const kitchenRef = doc(db, "kitchens", kitchenId);
    const kitchenDoc = await getDoc(kitchenRef);

    if (!kitchenDoc.exists()) {
      console.error("❌ [Validation] Kitchen not found:", kitchenId);
      return {
        isAvailable: false,
        name: item.food?.name || "Unknown Item",
        reason: "Kitchen not found",
        requestedQuantity,
        availableQuantity: 0,
        itemData: item,
        orderType: "PRE_ORDER",
      };
    }

    const kitchenData = kitchenDoc.data();

    console.log("🏪 [Validation] Kitchen preorder structure:", {
      hasPreorderSchedule: !!kitchenData.preorderSchedule,
      hasDates: !!kitchenData.preorderSchedule?.dates,
      availableDates: kitchenData.preorderSchedule?.dates
        ? Object.keys(kitchenData.preorderSchedule.dates)
        : [],
    });

    const dateSchedule = kitchenData.preorderSchedule?.dates?.[pickupDate];

    if (!dateSchedule || !Array.isArray(dateSchedule)) {
      console.warn("⚠️ [Validation] No schedule for date:", pickupDate);
      return {
        isAvailable: false,
        name: item.food?.name || "Unknown Item",
        reason: `Not available on ${dayjs(pickupDate).format("MMM D")}`,
        requestedQuantity,
        availableQuantity: 0,
        itemData: item,
        orderType: "PRE_ORDER",
        pickupDate,
      };
    }

    // Find the food item in the schedule
    const foodIndex = dateSchedule.findIndex(
      (scheduleItem) => scheduleItem.foodItemId === foodItemId
    );

    console.log("🔍 [Validation] Food item search:", {
      searchingForFoodId: foodItemId,
      foundAtIndex: foodIndex,
      totalItemsInSchedule: dateSchedule.length,
    });

    if (foodIndex === -1) {
      console.warn("⚠️ [Validation] Food item not in schedule for date");
      return {
        isAvailable: false,
        name: item.food?.name || "Unknown Item",
        reason: `Not available on ${dayjs(pickupDate).format("MMM D")}`,
        requestedQuantity,
        availableQuantity: 0,
        itemData: item,
        orderType: "PRE_ORDER",
        pickupDate,
      };
    }

    const scheduleItem = dateSchedule[foodIndex];
    const isLimitedOrder = scheduleItem.isLimitedOrder || false;
    const availableQuantity = scheduleItem.numOfAvailableItems || 0;

    console.log("📊 [Validation] PreOrder availability:", {
      name: item.food?.name,
      date: pickupDate,
      requested: requestedQuantity,
      available: availableQuantity,
      isLimitedOrder: isLimitedOrder,
      checkQuantity: !isLimitedOrder, // Only check quantity if NOT unlimited
    });

    // ✅ If isLimitedOrder is true, item is unlimited - skip quantity check
    if (isLimitedOrder) {
      console.log(
        "✅ [Validation] Item is unlimited (isLimitedOrder=true), skipping quantity check"
      );
      return { isAvailable: true };
    }

    // ✅ If isLimitedOrder is false, check available quantity
    if (availableQuantity < requestedQuantity) {
      return {
        isAvailable: false,
        name: item.food?.name || "Unknown Item",
        reason:
          availableQuantity === 0
            ? `Sold out for ${dayjs(pickupDate).format("MMM D")}`
            : `Only ${availableQuantity} available on ${dayjs(
                pickupDate
              ).format("MMM D")}`,
        requestedQuantity,
        availableQuantity,
        itemData: item,
        orderType: "PRE_ORDER",
        pickupDate,
      };
    }

    return { isAvailable: true };
  } catch (error) {
    console.error("❌ [Validation] Error validating PreOrder item:", error);
    return {
      isAvailable: false,
      name: item.food?.name || "Unknown Item",
      reason: "Error checking availability",
      requestedQuantity: item.quantity || 1,
      availableQuantity: 0,
      itemData: item,
      orderType: "PRE_ORDER",
    };
  }
};

/**
 * Main validation function that checks all cart items
 * Reusable across different components
 */
export const validateItemAvailability = async (cartItems, kitchenId) => {
  const unavailableItems = [];
  console.log(
    "🚦 [Availability Check] Starting validation process...",
    kitchenId
  );
  console.log(
    "📦 [Availability Check] Starting validation for",
    cartItems.length,
    "items"
  );

  for (const item of cartItems) {
    const orderType =
      item.orderType || (item.isPreOrder ? "PRE_ORDER" : "GO_GRAB");

    console.log("🔍 [Availability Check] Processing:", {
      name: item.food?.name,
      orderType,
      foodId: item.foodId || item.id,
    });

    let result;

    if (orderType === "GO_GRAB") {
      result = await validateGrabAndGoAvailability(item, kitchenId);
    } else if (orderType === "PRE_ORDER") {
      result = await validatePreOrderAvailability(item, kitchenId);
    } else {
      console.warn("⚠️ [Validation] Unknown order type:", orderType);
      continue;
    }

    if (!result.isAvailable) {
      unavailableItems.push(result);
    }
  }

  console.log("📦 [Availability Check] Validation complete:", {
    totalItems: cartItems.length,
    unavailableCount: unavailableItems.length,
    unavailableItems: unavailableItems.map((i) => ({
      name: i.name,
      reason: i.reason,
    })),
  });

  return unavailableItems;
};

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
            const currentAvailable = currentData.numAvailable || 0;
            const orderQuantity = parseInt(item.quantity);

            const newAvailableItems = Math.max(
              0,
              currentAvailable - orderQuantity
            );

            // ... rest of your existing update logic
            console.log("📊 [ORDER SERVICE] Inventory calculation:", {
              currentAvailable,
              orderQuantity,
              newAvailableItems,
              calculation: `Available: ${currentAvailable} - ${orderQuantity} = ${newAvailableItems}`,
            });

            // Validate the calculation
            if (isNaN(newAvailableItems)) {
              const errorMsg = `Invalid calculation: newAvailableItems=${newAvailableItems}`;
              throw new Error(errorMsg);
            }

            // Update with absolute values
            console.log(
              "🔄 [ORDER SERVICE] Updating document with new values..."
            );

            await updateDoc(foodRef, {
              // ✅ Only update numAvailable - do NOT update numOfSoldItem
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
          let pickupDate;
          if (item.pickupDateString) {
            // Parse pickupDateString (format: "MM,DD,YYYY") and convert to "YYYY-MM-DD"
            pickupDate = dayjs(item.pickupDateString, "MM,DD,YYYY").format(
              "YYYY-MM-DD"
            );
          } else if (item.pickupDate) {
            // Fallback to pickupDate if pickupDateString is not available
            pickupDate =
              item.pickupDate instanceof Date
                ? dayjs(item.pickupDate).format("YYYY-MM-DD")
                : dayjs(item.pickupDate).format("YYYY-MM-DD");
          } else {
            console.error(
              "❌ [ORDER SERVICE] No pickup date found for item:",
              item
            );
            throw new Error(`No pickup date found for item ${item.foodItemId}`);
          }

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
                  numOfAvailableItems: currentFoodItem?.isLimitedOrder
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
  paymentType,
  deliveryAddress,
  isDelivery,
  deliveryPhone,
  balanceToUse = 0, // Amount to deduct from user's account balance
}) => {
  const now = new Date();
  const orderID = generateOrderID();

  // ✅ Handle both old structure (grabAndGo, preOrders) and new structure (pickup/delivery with nested grabAndGo, preOrders)
  let allGrabAndGo = [];
  let allPreOrders = {};

  if (groupedCartItems?.pickup || groupedCartItems?.delivery) {
    // New structure: { pickup: { grabAndGo, preOrders }, delivery: { grabAndGo, preOrders } }
    allGrabAndGo = [
      ...(groupedCartItems.pickup?.grabAndGo || []),
      ...(groupedCartItems.delivery?.grabAndGo || []),
    ];

    // Merge preOrders from both pickup and delivery
    const pickupPreOrders = groupedCartItems.pickup?.preOrders || {};
    const deliveryPreOrders = groupedCartItems.delivery?.preOrders || {};

    // Combine preOrders by date
    allPreOrders = { ...pickupPreOrders };
    Object.keys(deliveryPreOrders).forEach((date) => {
      if (allPreOrders[date]) {
        allPreOrders[date] = [
          ...allPreOrders[date],
          ...deliveryPreOrders[date],
        ];
      } else {
        allPreOrders[date] = deliveryPreOrders[date];
      }
    });
  } else {
    // Old structure: { grabAndGo, preOrders }
    allGrabAndGo = groupedCartItems?.grabAndGo || [];
    allPreOrders = groupedCartItems?.preOrders || {};
  }

  // Determine order type based on cart items
  const hasPreOrder = Object.keys(allPreOrders).length > 0;
  const hasGrabAndGo = allGrabAndGo.length > 0;

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
    const preOrderDates = Object.keys(allPreOrders);
    if (preOrderDates.length > 0) {
      const earliestDate = preOrderDates.sort()[0];
      datePickedUp = new Date(earliestDate);
    }
  }
  // ✅ Helper to get max category ID from comma-separated string
  const getMaxCategoryId = (foodCategory) => {
    if (!foodCategory) return 0;
    const categories = foodCategory.split(",").map((c) => parseInt(c.trim(), 10));
    return Math.max(...categories.filter((c) => !isNaN(c)), 0);
  };

  // Transform cart items to order format
  const orderedFoodItems = cartItems.map((item) => {
    const foodCategory = item.foodCategory || item.food?.foodCategory || "";
    const isCategory8 = getMaxCategoryId(foodCategory) === 8;
    
    // Default date/time for category 8 items
    const defaultCategory8Date = new Date("2000-01-01T00:00:00");
    
    return {
      countRating: 0,
      foodItemId: item.foodId || item.id,
      foodCategory: foodCategory,
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
        item.pickupDetails?.orderType === "PRE_ORDER" ? "preorder" : "grabAndGo",
      orderType1: item.fulfillmentType || 2,
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
      // ✅ Use default date for category 8 items
      pickupDate: isCategory8 ? defaultCategory8Date : new Date(item.selectedDate),
      pickupDateString: isCategory8 ? "01,01,2000" : dayjs(item.selectedDate).format("MM,DD,YYYY"),
      pickupTime: isCategory8 ? "12:00 AM" : (item.selectedTime || "4:30 PM"),
      paymentType: paymentType || "online",
    };
  });
  let paymentVia = { other: {} };
  if (paymentType === "cash") {
    paymentVia = { cash: {} };
  }
  // Create the order object
  const orderObject = {
    appOrderStatus: "Web App Order",
    datePickedUp: datePickedUp,
    deliveryAddress: isDelivery ? deliveryAddress : "",
    deliveryPhone: deliveryPhone || "",  // Always save phone (required for SMS notifications)
    isDeliverydSelected: isDelivery || false,
    datePlaced: now,
    kitchenId:
      kitchenInfo?.id || kitchenInfo?.kitchenId || cartItems[0]?.kitchenId,
    kitchenName: kitchenInfo?.name,
    kitchenImageURL: kitchenInfo?.kitchenImageURL || "",
    orderID: orderID,
    orderIDKey: "", // Will be set after document creation
    orderPaymentImage: firebaseImageUrl || "",
    orderStatus: "pendingApproval",
    orderTotalCoast: parseFloat(paymentCalculation.totalPayment),
    orderType: orderType,
    orderedFoodItems: orderedFoodItems,
    paymentVia: paymentVia,
    pickUpAddress: kitchenInfo?.address,
    userId: currentUser?.id,
    // Additional metadata
    subtotal: parseFloat(paymentCalculation.subtotal),
    salesTax: parseFloat(paymentCalculation.salesTax),
    taxRate: 0.0725,
    paymentType: paymentType || "online",
    // Payment breakdown fields
    paidFromBalance: parseFloat(balanceToUse.toFixed(2)),
    paidFromOnline: parseFloat(Math.max(0, parseFloat(paymentCalculation.totalPayment) - balanceToUse).toFixed(2)),
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

/**
 * Fetch all orders for a specific user
 * @param {string} userId - The user ID to fetch orders for
 * @returns {Promise<Array>} - Array of order objects sorted by date placed (newest first)
 */
export const getUserOrders = async (userId) => {
  try {
    console.log("📋 [ORDER SERVICE] Fetching orders for user:", userId);
    
    if (!userId) {
      console.warn("⚠️ [ORDER SERVICE] No userId provided to getUserOrders");
      return [];
    }

    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("userId", "==", userId),
      orderBy("datePlaced", "desc")
    );
    
    const snapshot = await getDocs(q);
    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`✅ [ORDER SERVICE] Found ${orders.length} orders for user`);
    return orders;
  } catch (error) {
    console.error("❌ [ORDER SERVICE] Error fetching user orders:", error);
    throw error;
  }
};

/**
 * Fetch and aggregate ordered quantities for all active orders globally
 * @returns {Promise<Object>} - Dictionary mapping item names to their total aggregated quantity
 */
export const getAggregatedOrderQuantities = async () => {
  try {
    console.log("📊 [ORDER SERVICE] Aggregating all global order quantities based on item-level status");

    const ordersRef = collection(db, "orders");
    // We fetch all non-canceled orders to check item-level statuses
    const q = query(
      ordersRef,
      where("orderStatus", "!=", "canceled")
    );
    
    const snapshot = await getDocs(q);
    const quantitiesByItemName = {};

    snapshot.docs.forEach((doc) => {
      const orderData = doc.data();
      if (orderData.orderedFoodItems && Array.isArray(orderData.orderedFoodItems)) {
        orderData.orderedFoodItems.forEach((item) => {
          // ✅ Check orderStatus at the ITEM level
          const itemStatus = item.orderStatus || orderData.orderStatus; // Fallback to root if missing
          const isActive = ["inProgress", "pending"].includes(itemStatus);

          if (isActive && item.name && item.quantity) {
            const qty = parseInt(item.quantity, 10) || 0;
            quantitiesByItemName[item.name] = (quantitiesByItemName[item.name] || 0) + qty;
          }
        });
      }
    });

    console.log("✅ [ORDER SERVICE] Aggregated quantities:", quantitiesByItemName);
    return quantitiesByItemName;
  } catch (error) {
    console.error("❌ [ORDER SERVICE] Error aggregating order quantities:", error);
    return {};
  }
};
