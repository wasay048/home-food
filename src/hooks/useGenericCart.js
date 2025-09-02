import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
  updateCartItem,
} from "../store/slices/cartSlice";
import { showToast } from "../utils/toast";
import dayjs from "dayjs"; // Add this import for date validation

export const useGenericCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  // ✅ CONSOLIDATED: Single function to calculate availability (moved from QuantitySelector)
  const calculateAvailability = useCallback(
    (food, kitchen, selectedDate = null, maxQuantity = 99) => {
      console.log("🔍 AVAILABILITY CALCULATION START");
      console.log("DEBUG - Availability calculation:", {
        foodId: food?.id,
        foodName: food?.name,
        kitchenId: kitchen?.id,
        kitchenName: kitchen?.name,
        selectedDate,
        hasFood: !!food,
        hasKitchen: !!kitchen,
        hasPreorderSchedule: !!kitchen?.preorderSchedule?.dates,
        maxQuantity,
      });

      // CASE 1: No food object provided
      if (!food) {
        console.log("DEBUG - CASE 1: No food object");
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
      console.log("DEBUG - Go&Grab availability check:", { numAvailable });

      // CASE 2: Go&Grab items with availability > 0 (HIGHEST PRIORITY)
      // This case ignores date completely - if items are available, it's Go&Grab
      if (numAvailable > 0) {
        console.log(
          "DEBUG - CASE 2: Items available for Go&Grab, ignoring date validation"
        );
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
      if (selectedDate) {
        const orderDate = dayjs(selectedDate).startOf("day");

        // CASE 3A: Past date selected - ignore Pre-Order, fall back to current availability
        if (orderDate.isBefore(today)) {
          console.log(
            "DEBUG - CASE 3A: Selected date is in the past, ignoring Pre-Order check:",
            {
              selectedDate,
              today: today.format("YYYY-MM-DD"),
              isPast: true,
            }
          );

          // Check if we have current availability for Go&Grab
          if (numAvailable > 0) {
            console.log(
              "DEBUG - CASE 3A: Has current availability, allowing Go&Grab"
            );
            return {
              isAvailable: true,
              maxAvailable: Math.min(numAvailable, maxQuantity),
              orderType: "GO_GRAB",
              message: null,
              warning: numAvailable < 5 ? `Only ${numAvailable} left` : null,
              actualCheckingDate: null,
            };
          } else {
            console.log("DEBUG - CASE 3A: No current availability, sold out");
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
        console.log(
          "DEBUG - CASE 3B: Checking Pre-Order for future date:",
          selectedDate
        );

        const orderType = "PRE_ORDER";

        // CASE 3B-1: No preorder schedule exists
        if (!kitchen?.preorderSchedule?.dates) {
          console.log("DEBUG - CASE 3B-1: No preorder schedule");
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
          console.log("DEBUG - CASE 3B-2: No schedule found for date");
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
          console.log("DEBUG - CASE 3B-3: Food not found in schedule");
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
          console.log("DEBUG - CASE 3B-4A: Limited pre-order", {
            availableItems,
          });

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
          console.log("DEBUG - CASE 3B-4B: Unlimited pre-order");
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
      console.log("DEBUG - CASE 4: No availability anywhere, item sold out");
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
    (foodId, selectedDate = null) => {
      const originalSelectedDate = selectedDate;

      console.log("🔍 getCartQuantity called with:", {
        foodId,
        selectedDate: originalSelectedDate,
        cartItemsCount: cartItems.length,
      });

      if (!foodId || !cartItems || cartItems.length === 0) {
        console.log("🔍 Early return: no foodId or empty cart");
        return 0;
      }

      // ✅ CRITICAL FIX: For Go&Grab items, always match regardless of date
      const matchingItems = cartItems.filter((item) => {
        console.log("🔍 Checking item:", {
          itemFoodId: item.foodId,
          itemSelectedDate: item.selectedDate,
          itemOrderType: item.orderType,
          itemQuantity: item.quantity,
        });

        const matchesFood = String(item.foodId) === String(foodId);

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
          console.log("🔍 Go&Grab item found, ignoring date matching");
        } else if (selectedDate) {
          // For pre-order items, match exact date
          matchesDate = item.selectedDate === selectedDate;
        } else {
          // For items without selectedDate, match items without specific date
          matchesDate = !item.selectedDate;
        }

        const matches = matchesFood && matchesDate;
        console.log("🔍 Item match result:", {
          matchesFood,
          matchesDate,
          matches,
          isGoGrabOrderType,
          selectedDate: originalSelectedDate,
        });

        return matches;
      });

      // Sum up quantities from all matching items
      const totalQuantity = matchingItems.reduce((total, item) => {
        const itemQuantity = item.quantity || 1;
        console.log("🔍 Adding quantity:", itemQuantity, "to total:", total);
        return total + itemQuantity;
      }, 0);

      console.log("🔍 getCartQuantity result:", {
        foodId,
        originalSelectedDate,
        matchingItemsCount: matchingItems.length,
        matchingItems: matchingItems.map((item) => ({
          id: item.id,
          foodId: item.foodId,
          quantity: item.quantity,
          selectedDate: item.selectedDate,
          orderType: item.orderType,
        })),
        totalQuantity,
      });

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
      currentQuantity,
      selectedDate = null,
      selectedTime = null,
      specialInstructions = "",
      isPreOrder = false,
    }) => {
      console.log("🛒 useGenericCart - handleQuantityChange called:", {
        foodId: food?.id,
        foodName: food?.name,
        newQuantity,
        currentQuantity,
        selectedDate,
        selectedTime,
        isPreOrder,
      });

      try {
        // ✅ NEW: Use calculateAvailability to determine proper order type
        const availability = calculateAvailability(food, kitchen, selectedDate);

        console.log("🔍 Availability result:", availability);

        // ✅ IMPROVED: Determine order type based on availability
        const orderType = availability.orderType;
        const isGoGrab = orderType === "GO_GRAB";

        console.log("🔍 Cart item matching criteria:", {
          orderType,
          isGoGrab,
          selectedDate,
          isPreOrder,
        });

        // ✅ CRITICAL FIX: Find matching cart item with proper Go&Grab logic
        const matchingItem = cartItems.find((item) => {
          const matchesFood = String(item.foodId) === String(food.id);

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

          const matches = matchesFood && matchesDate && matchesInstructions;

          console.log("🔍 Item matching details:", {
            itemId: item.id,
            matchesFood,
            matchesDate,
            matchesInstructions,
            matches,
            itemOrderType: item.orderType,
            itemSelectedDate: item.selectedDate,
            isGoGrab,
            itemIsGoGrab,
          });

          return matches;
        });

        if (newQuantity === 0) {
          // Remove the item completely
          if (matchingItem) {
            console.log("🗑️ Removing item from cart (quantity = 0)");
            dispatch(removeFromCart(matchingItem.id));
          }
          return;
        }

        if (matchingItem) {
          // Update existing item's quantity
          console.log("📝 Updating existing item quantity:", {
            itemId: matchingItem.id,
            oldQuantity: matchingItem.quantity,
            newQuantity: newQuantity,
          });

          // ✅ IMPROVED: Update cart item with proper date handling
          const updateData = {
            cartItemId: matchingItem.id,
            quantity: newQuantity,
            specialInstructions: specialInstructions,
          };

          // ✅ CRITICAL: For Go&Grab items, update the selectedDate but keep orderType as GO_GRAB
          if (isGoGrab) {
            updateData.selectedDate = selectedDate; // Allow date update for pickup preference
            updateData.selectedTime = selectedTime;
            updateData.orderType = "GO_GRAB"; // Ensure it stays Go&Grab
          } else {
            // For Pre-Order, keep exact date and time
            updateData.selectedDate = selectedDate;
            updateData.selectedTime = selectedTime;
            updateData.orderType = "PRE_ORDER";
          }

          dispatch(updateCartItem(updateData));
        } else {
          // Add new item
          console.log("➕ Adding new item to cart with quantity:", newQuantity);

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

          dispatch(addToCart(cartItem));
        }

        console.log("✅ Cart update completed");
      } catch (error) {
        console.error("❌ Error updating cart:", error);
        showToast.error("Failed to update cart");
      }
    },
    [dispatch, cartItems, calculateAvailability]
  );

  return {
    cartItems,
    getCartQuantity,
    handleQuantityChange,
    calculateAvailability,
  };
};
