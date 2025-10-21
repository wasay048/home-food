import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
  updateCartItem,
} from "../store/slices/cartSlice";
import dayjs from "dayjs";

export const useGenericCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  // ✅ CONSOLIDATED: Single function to calculate availability (moved from QuantitySelector)
  const calculateAvailability = useCallback(
    (
      food,
      kitchen,
      selectedDate = null,
      maxQuantity = 99,
      incomingOrderType = null
    ) => {
      if (!incomingOrderType) {
        return;
      }
      // CASE 1: No food object provided
      if (!food) {
        return {
          isAvailable: false,
          maxAvailable: 0,
          orderType: selectedDate ? "PRE_ORDER" : "GO_GRAB",
          message: "Food item not found",
          warning: null,
          actualCheckingDate: selectedDate,
        };
      }

      const today = dayjs().startOf("day");

      // Get current Go&Grab availability
      const numAvailable =
        food.availability?.numAvailable || food.numAvailable || 0;

      // CASE 2: Go&Grab items with availability > 0 (HIGHEST PRIORITY)
      // This case ignores date completely - if items are available, it's Go&Grab
      if (numAvailable > 0 && incomingOrderType === "GO_GRAB") {
        return {
          isAvailable: true,
          maxAvailable: Math.min(numAvailable, maxQuantity),
          orderType: "GO_GRAB", // Force Go&Grab when items are available
          message: null,
          warning: numAvailable < 5 ? `Only ${numAvailable} left` : null,
          actualCheckingDate: null, // No date restriction for Go&Grab
        };
      }

      // CASE 3: Selected date provided, but need to validate it's not in the past
      if (selectedDate && incomingOrderType === "PRE_ORDER") {
        const orderDate = dayjs(selectedDate).startOf("day");

        // CASE 3A: Past date selected - ignore Pre-Order, fall back to current availability
        if (orderDate.isBefore(today)) {
          // Check if we have current availability for Go&Grab
          if (numAvailable > 0) {
            return {
              isAvailable: true,
              maxAvailable: Math.min(numAvailable, maxQuantity),
              orderType: "GO_GRAB",
              message: null,
              warning: numAvailable < 5 ? `Only ${numAvailable} left` : null,
              actualCheckingDate: null,
            };
          } else {
            return {
              isAvailable: false,
              maxAvailable: 0,
              orderType: "GO_GRAB",
              message: "Sold Out",
              warning: null,
              actualCheckingDate: null,
            };
          }
        }

        // CASE 3B: Future date selected - check Pre-Order
        const orderType = "PRE_ORDER";

        // CASE 3B-1: No preorder schedule exists
        if (!kitchen?.preorderSchedule?.dates) {
          return {
            isAvailable: false,
            maxAvailable: 0,
            orderType,
            message: "Pre-orders not available for this kitchen",
            warning: null,
            actualCheckingDate: selectedDate,
          };
        }

        // Format the date key for schedule lookup
        const dateKey = selectedDate.includes("-")
          ? selectedDate
          : dayjs(selectedDate).format("YYYY-MM-DD");

        const scheduleForDate = kitchen.preorderSchedule.dates[dateKey];

        // CASE 3B-2: No schedule found for this specific date
        if (!scheduleForDate || !Array.isArray(scheduleForDate)) {
          return {
            isAvailable: false,
            maxAvailable: 0,
            orderType,
            message: "Not available for pre-order on selected date",
            warning: null,
            actualCheckingDate: selectedDate,
          };
        }

        // Find this specific food in the schedule
        const foodSchedule = scheduleForDate.find(
          (item) => item.foodItemId === food.id
        );

        // CASE 3B-3: Food not found in the schedule for this date
        if (!foodSchedule) {
          return {
            isAvailable: false,
            maxAvailable: 0,
            orderType,
            message:
              "This item is not available for pre-order on selected date",
            warning: null,
            actualCheckingDate: selectedDate,
          };
        }

        // CASE 3B-4: Food found in schedule - check if it's limited order
        if (foodSchedule.isLimitedOrder === false) {
          // Limited quantity pre-order
          const availableItems = foodSchedule.numOfAvailableItems || 0;

          return {
            isAvailable: availableItems > 0,
            maxAvailable: Math.min(availableItems, maxQuantity),
            orderType,
            message: availableItems <= 0 ? "Sold Out" : null,
            warning:
              availableItems < 5 && availableItems > 0
                ? `Only ${availableItems} left`
                : null,
            actualCheckingDate: selectedDate,
          };
        } else {
          // Unlimited pre-order
          return {
            isAvailable: true,
            maxAvailable: maxQuantity,
            orderType,
            message: null,
            warning: null,
            actualCheckingDate: selectedDate,
          };
        }
      }

      // CASE 4: No selected date and no current availability - completely sold out
      return {
        isAvailable: false,
        maxAvailable: 0,
        orderType: "GO_GRAB",
        message: "Sold Out",
        warning: null,
        actualCheckingDate: null,
      };
    },
    []
  );

  // ✅ FIXED: Function to get cart quantity for a specific food item
  const getCartQuantity = useCallback(
    (foodId, selectedDate = null, orderType = null) => {
      if (!foodId || !cartItems || cartItems.length === 0) {
        return 0;
      }

      console.log("orderType getCartQuantity", orderType);
      // ✅ CRITICAL FIX: For Go&Grab items, always match regardless of date
      const matchingItems = cartItems.filter((item) => {
        console.log("item getCartQuantity", item);
        const matchesFood =
          String(item.foodId) === String(foodId) &&
          item.orderType === orderType;

        // ✅ IMPROVED: Always prioritize Go&Grab matching
        const isGoGrabOrderType =
          item.orderType === "GO_GRAB" ||
          item.orderType === "Go&Grab" ||
          item.orderType === "Go & Grab" ||
          !item.orderType; // Legacy items without orderType

        let matchesDate;

        if (isGoGrabOrderType) {
          // ✅ CRITICAL: For Go&Grab items, ALWAYS match regardless of any date
          matchesDate = true;
        } else if (selectedDate) {
          // For pre-order items, match exact date
          matchesDate = item.selectedDate === selectedDate;
        } else {
          // For items without selectedDate, match items without specific date
          matchesDate = !item.selectedDate;
        }

        return matchesFood && matchesDate;
      });
      // Sum up quantities from all matching items
      const totalQuantity = matchingItems.reduce((total, item) => {
        return total + (item.quantity || 1);
      }, 0);
      console.log("totalQuantity", totalQuantity);
      return totalQuantity;
    },
    [cartItems]
  );

  const parseClockTime = (timeStr) => {
    if (!timeStr || typeof timeStr !== "string") return null;

    const cleanTime = timeStr.trim().toUpperCase();
    const timeRegex = /^(\d{1,2}):?(\d{2})?\s*(AM|PM)?$/i;
    const match = cleanTime.match(timeRegex);

    if (!match) return null;

    let h = parseInt(match[1], 10);
    const min = match[2] ? parseInt(match[2], 10) : 0;
    const period = match[3] ? match[3].toUpperCase() : null;

    if (period === "PM" && h !== 12) h += 12;
    if (period === "AM" && h === 12) h = 0;

    if (h < 0 || h > 23 || min < 0 || min > 59) return null;

    return { h, min };
  };

  /**
   * ✅ STANDALONE FUNCTION: Get the first available time slot
   * @param {Object} params - Parameters
   * @param {Object} params.food - Food item object
   * @param {Object} params.kitchen - Kitchen object with preorder schedule
   * @param {string} params.orderType - "GO_GRAB" or "PRE_ORDER"
   * @param {string} params.selectedDate - Date in YYYY-MM-DD format
   * @returns {string|null} - First available time slot (e.g., "5:30 PM") or null
   */
  const getFirstAvailableTimeSlot = ({
    food,
    kitchen,
    orderType,
    selectedDate,
  }) => {
    console.log("🕐 Getting first available time slot:", {
      foodId: food?.id,
      foodName: food?.name,
      orderType,
      selectedDate,
    });

    if (!selectedDate) {
      console.log("❌ No date provided");
      return null;
    }

    // ✅ GO_GRAB Logic with weekday/weekend time ranges
    if (orderType === "GO_GRAB") {
      const selectedDateObj = dayjs(selectedDate);

      // Determine if selected date is weekend (Saturday = 6, Sunday = 0)
      const dayOfWeek = selectedDateObj.day();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      // Different time ranges based on day type
      let startHour, startMinute;

      if (isWeekend) {
        // Weekend (Saturday-Sunday): 11:00 AM - 7:30 PM
        startHour = 11;
        startMinute = 0;
      } else {
        // Weekday (Monday-Friday): 5:30 PM - 7:30 PM
        startHour = 17; // 5 PM in 24-hour format
        startMinute = 30;
      }

      // ✅ Always start from the allowed start time, regardless of current time
      const startSlot = selectedDateObj
        .hour(startHour)
        .minute(startMinute)
        .second(0);

      const firstTimeSlot = startSlot.format("h:mm A");
      console.log("✅ GO_GRAB first time slot:", {
        time: firstTimeSlot,
        dayType: isWeekend ? "Weekend" : "Weekday",
        date: selectedDateObj.format("MMM D, YYYY"),
      });
      return firstTimeSlot;
    }

    // ✅ PRE_ORDER Logic
    else if (orderType === "PRE_ORDER") {
      if (!kitchen?.preorderSchedule?.dates || !food?.id) {
        console.log("❌ No preorder schedule or food ID");
        return null;
      }

      const scheduleDates = kitchen.preorderSchedule.dates;
      const dateKey = selectedDate.includes("-")
        ? selectedDate
        : dayjs(selectedDate).format("YYYY-MM-DD");

      if (!scheduleDates[dateKey]) {
        console.log("❌ No schedule found for date:", dateKey);
        return null;
      }

      const scheduleItems = scheduleDates[dateKey];

      // Filter for specific food
      const foodScheduleItems = scheduleItems.filter(
        (item) => item.foodItemId === food.id
      );

      if (foodScheduleItems.length === 0) {
        console.log("❌ No schedule items found for this food on this date");
        return null;
      }

      // Collect all time slots
      const allAvailableTimes = [];

      foodScheduleItems.forEach((scheduleItem) => {
        if (
          !scheduleItem.availableTimes ||
          !Array.isArray(scheduleItem.availableTimes) ||
          scheduleItem.availableTimes.length < 2
        ) {
          return;
        }

        // Extract start and end times
        const startTimeStr = scheduleItem.availableTimes[0];
        const endTimeStr =
          scheduleItem.availableTimes[scheduleItem.availableTimes.length - 1];

        try {
          const parsedStart = parseClockTime(startTimeStr);
          const parsedEnd = parseClockTime(endTimeStr);

          if (!parsedStart || !parsedEnd) {
            return;
          }

          const base = dayjs("2000-01-01", "YYYY-MM-DD", true);
          const startTime = base
            .hour(parsedStart.h)
            .minute(parsedStart.min)
            .second(0);
          const endTime = base
            .hour(parsedEnd.h)
            .minute(parsedEnd.min)
            .second(0);

          if (!endTime.isAfter(startTime)) {
            return;
          }

          // Generate 15-minute interval slots
          let currentSlot = startTime;

          while (currentSlot.isBefore(endTime) || currentSlot.isSame(endTime)) {
            const hour = currentSlot.hour();

            if (hour >= 0 && hour <= 23) {
              allAvailableTimes.push({
                time: currentSlot.clone(),
                scheduleItem: scheduleItem,
              });
            }

            currentSlot = currentSlot.add(15, "minutes");
          }
        } catch (err) {
          console.error("❌ Error processing time range:", err);
        }
      });

      if (allAvailableTimes.length === 0) {
        console.log("❌ No valid time slots generated");
        return null;
      }

      // Sort chronologically and get first slot
      allAvailableTimes.sort((a, b) => a.time.diff(b.time));
      const firstTimeSlot = allAvailableTimes[0].time.format("h:mm A");

      console.log("✅ PRE_ORDER first time slot:", {
        time: firstTimeSlot,
        foodName: allAvailableTimes[0].scheduleItem?.nameOfFood,
        originalRange: `${
          allAvailableTimes[0].scheduleItem?.availableTimes[0]
        } - ${
          allAvailableTimes[0].scheduleItem?.availableTimes[
            allAvailableTimes[0].scheduleItem?.availableTimes.length - 1
          ]
        }`,
      });

      return firstTimeSlot;
    }

    return null;
  };
  // ✅ FIXED: Handle quantity changes with proper Go&Grab logic
  const handleQuantityChange = useCallback(
    ({
      food,
      kitchen,
      newQuantity,
      selectedDate = null,
      selectedTime = null,
      specialInstructions = "",
      incomingOrderType,
      calledFrom = "default",
      updateFlag = "combo",
    }) => {
      try {
        // ✅ NEW: Use calculateAvailability to determine proper order type
        console.log("selectedDate", selectedDate);
        console.log("selectedTime updations", selectedTime, calledFrom);
        if (!selectedTime) {
          selectedTime = getFirstAvailableTimeSlot({
            food,
            kitchen,
            orderType: incomingOrderType,
            selectedDate,
          });
        }
        console.log("selectedTime final", selectedTime);
        const availability = calculateAvailability(
          food,
          kitchen,
          selectedDate,
          99,
          incomingOrderType
        );
        if (!availability) {
          console.log("🔥 Missing availability data");
          return;
        }
        const orderType = availability.orderType;
        const isGoGrab =
          orderType === "GO_GRAB" ||
          orderType === "Go&Grab" ||
          orderType === "Go & Grab";

        // ✅ CRITICAL FIX: Find matching cart item with proper Go&Grab logic
        const matchingItem = cartItems.find((item) => {
          const matchesFood =
            String(item.foodId) === String(food.id) &&
            item.orderType === orderType;

          // ✅ IMPROVED: For Go&Grab, match ANY item with this food regardless of date
          const itemIsGoGrab =
            item.orderType === "GO_GRAB" ||
            item.orderType === "Go&Grab" ||
            item.orderType === "Go & Grab" ||
            !item.orderType;

          let matchesDate;
          if (isGoGrab && itemIsGoGrab) {
            // ✅ CRITICAL: For Go&Grab to Go&Grab, always match regardless of date
            matchesDate = true;
          } else if (!isGoGrab && !itemIsGoGrab) {
            // For pre-order to pre-order, match exact date
            matchesDate = item.selectedDate === selectedDate;
          } else {
            // Mixed order types - no match
            matchesDate = false;
          }

          const matchesInstructions =
            (item.specialInstructions || "") === (specialInstructions || "");

          // ✅ NEW: Add missing matchesOrderType variable
          const matchesOrderType = isGoGrab ? itemIsGoGrab : !itemIsGoGrab;

          return (
            matchesFood &&
            matchesOrderType &&
            matchesDate &&
            matchesInstructions
          );
        });

        if (newQuantity === 0) {
          // Remove the item completely
          if (matchingItem) {
            dispatch(removeFromCart(matchingItem.id));
          }
          return;
        }

        if (matchingItem) {
          // Update existing item's quantity
          const updateData = {
            cartItemId: matchingItem.id,
            quantity: newQuantity,
            specialInstructions: specialInstructions,
          };

          // ✅ CRITICAL: For Go&Grab items, update the selectedDate but keep orderType as GO_GRAB
          if (isGoGrab) {
            console.log("updatedData", updateData);
            updateData.selectedDate = selectedDate;
            updateData.selectedTime = selectedTime;
            updateData.orderType = "GO_GRAB";
          } else {
            console.log("updatedData", updateData);
            // For Pre-Order, keep exact date and time
            updateData.selectedDate = selectedDate;
            updateData.selectedTime = selectedTime;
            updateData.orderType = "PRE_ORDER";
          }
          console.log("Updating cart item with data:", updateData);
          dispatch(updateCartItem(updateData));
        } else {
          // Add new item
          const cartItem = {
            foodId: food.id,
            food: {
              id: food.id,
              name: food.name,
              cost: food.cost,
              imageUrl: food.imageUrl,
              description: food.description,
            },
            kitchen: {
              id: kitchen.id,
              name: kitchen.name,
            },
            kitchenId: kitchen.id,
            quantity: newQuantity,
            selectedDate: selectedDate, // Store the selected date for pickup preference
            selectedTime: selectedTime,
            specialInstructions,
            isPreOrder: orderType === "PRE_ORDER",
            orderType,
            updateFlag: updateFlag,
          };
          console.log("Adding new cart item:", cartItem);
          console.log("orderType", orderType);
          dispatch(addToCart(cartItem));
        }
      } catch (error) {
        console.error("❌ Error updating cart:", error);
        // showToast.error("Failed to update cart");
      }
    },
    [dispatch, cartItems, calculateAvailability]
  );

  const validateCartSelections = (cartItems) => {
    console.log("🔍 Validating cart selections for", cartItems.length, "items");
    let hasErrors = false;
    cartItems.forEach((item, index) => {
      const itemName = item.name || item.food?.name || "Unknown Item";
      const orderTypeText =
        item.orderType === "PRE_ORDER" ? "Pre-Order" : "Go & Grab";

      console.log(
        `📦 Checking item ${index + 1}: ${itemName} (${orderTypeText})`
      );

      // For Pre-Order items: Both date and time are required
      if (item.orderType === "PRE_ORDER" || item.isPreOrder) {
        if (!item.selectedDate) {
          const errorMsg = `Please select a pickup date for "${itemName}" (${orderTypeText})`;
          alert(errorMsg);
          hasErrors = true;
          console.warn("⚠️ Missing date:", errorMsg);
        }

        if (!item.selectedTime) {
          const errorMsg = `Please select a pickup time for "${itemName}" (${orderTypeText})`;
          alert(errorMsg);
          hasErrors = true;
          console.warn("⚠️ Missing time:", errorMsg);
        }
      }

      // For Go & Grab items: Only time is required (date is usually today)
      else if (item.orderType === "GO_GRAB" || item.orderType === "Go&Grab") {
        if (!item.selectedDate) {
          const errorMsg = `Please select a pickup date for "${itemName}" (${orderTypeText})`;
          alert(errorMsg);
          hasErrors = true;
          console.warn("⚠️ Missing date:", errorMsg);
        }
        if (!item.selectedTime) {
          const errorMsg = `Please select a pickup time for "${itemName}" (${orderTypeText})`;
          alert(errorMsg);
          hasErrors = true;
          console.warn("⚠️ Missing time:", errorMsg);
        }
      }
    });

    console.log("✅ All cart items validated successfully");
    return {
      isValid: !hasErrors,
      errors: [],
      message: "All selections are valid",
    };
  };

  const getCartItem = useCallback(
    (foodId) => {
      return cartItems.find((item) => item.foodId === foodId) || null;
    },
    [cartItems]
  );
  return {
    cartItems,
    getCartQuantity,
    handleQuantityChange,
    validateCartSelections: () => validateCartSelections(cartItems),
    getCartItem,
    calculateAvailability,
    getFirstAvailableTimeSlot,
  };
};
