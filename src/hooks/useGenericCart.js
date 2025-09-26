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
      // eslint-disable-next-line no-debugger
      debugger;
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
    }) => {
      console.log("🔥 handleQuantityChange called with:", incomingOrderType);
      try {
        debugger;
        // ✅ NEW: Use calculateAvailability to determine proper order type
        console.log("selectedDate", selectedDate);
        console.log("selectedTime", selectedTime);
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
  };
};
