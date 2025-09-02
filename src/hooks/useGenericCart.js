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

  // Function to get cart quantity for a specific food item
  const getCartQuantity = useCallback(
    (foodId, selectedDate = null) => {
      console.log("🔍 getCartQuantity called with:", {
        foodId,
        selectedDate,
        cartItemsCount: cartItems.length,
      });

      if (!foodId || !cartItems || cartItems.length === 0) {
        console.log("🔍 Early return: no foodId or empty cart");
        return 0;
      }

      // ✅ NEW: Check if selectedDate is in the past
      const today = dayjs().startOf("day");
      const isPastDate =
        selectedDate && dayjs(selectedDate).startOf("day").isBefore(today);

      if (isPastDate) {
        console.log(
          "🔍 Past date detected, treating as Go&Grab for cart matching:",
          {
            selectedDate,
            today: today.format("YYYY-MM-DD"),
          }
        );
        // For past dates, treat as Go&Grab (ignore date in matching)
        selectedDate = null;
      }

      const matchingItems = cartItems.filter((item) => {
        console.log("🔍 Checking item:", {
          itemFoodId: item.foodId,
          itemSelectedDate: item.selectedDate,
          itemOrderType: item.orderType,
          itemQuantity: item.quantity,
        });

        const matchesFood = String(item.foodId) === String(foodId);

        let matchesDate;
        if (selectedDate && !isPastDate) {
          // For pre-order items with future dates, match exact date
          matchesDate = item.selectedDate === selectedDate;
        } else {
          // For Go&Grab items OR past dates, match items with flexible date logic
          const isGoGrabOrderType =
            item.orderType === "GO_GRAB" ||
            item.orderType === "Go&Grab" ||
            item.orderType === "Go & Grab" ||
            !item.orderType; // Legacy items without orderType

          // ✅ IMPROVED: More flexible matching for Go&Grab
          matchesDate =
            !item.selectedDate || // Items without specific date
            isGoGrabOrderType || // Any Go&Grab order type
            (!selectedDate && !item.selectedDate); // Both are null/undefined
        }

        const matches = matchesFood && matchesDate;
        console.log("🔍 Item match result:", {
          matchesFood,
          matchesDate,
          matches,
          isPastDate,
          effectiveSelectedDate: selectedDate,
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
        originalSelectedDate: arguments[1], // Original selectedDate passed
        effectiveSelectedDate: selectedDate, // After past date processing
        isPastDate,
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
        // ✅ NEW: Check if selectedDate is in the past
        const today = dayjs().startOf("day");
        const isPastDate =
          selectedDate && dayjs(selectedDate).startOf("day").isBefore(today);

        // ✅ IMPROVED: Determine order type based on availability priority
        let orderType;
        let effectiveSelectedDate;

        if (isPastDate) {
          // Past dates always become Go&Grab
          orderType = "GO_GRAB";
          effectiveSelectedDate = null; // Ignore date for matching
          console.log("🔍 Past date detected, forcing Go&Grab:", {
            originalDate: selectedDate,
            isPastDate: true,
          });
        } else if (isPreOrder) {
          // Explicitly set as Pre-Order
          orderType = "PRE_ORDER";
          effectiveSelectedDate = selectedDate;
        } else {
          // Default to Go&Grab
          orderType = "GO_GRAB";
          effectiveSelectedDate = null; // For Go&Grab, don't use date for matching
        }

        console.log("🔍 Cart item matching criteria:", {
          orderType,
          effectiveSelectedDate,
          originalSelectedDate: selectedDate,
          isPastDate,
          isPreOrder,
        });

        // Find the exact matching cart item
        const matchingItem = cartItems.find((item) => {
          const matchesFood = String(item.foodId) === String(food.id);

          let matchesDate;
          if (orderType === "PRE_ORDER" && !isPastDate) {
            // For pre-orders with future dates, match exact date
            matchesDate = item.selectedDate === selectedDate;
          } else {
            // For Go&Grab or past dates, match any item regardless of date
            const isGoGrabItem =
              item.orderType === "GO_GRAB" ||
              item.orderType === "Go&Grab" ||
              item.orderType === "Go & Grab" ||
              !item.orderType ||
              !item.selectedDate;

            matchesDate = isGoGrabItem;
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
            isPastDate,
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

          // For Go&Grab items, update date if provided (but don't require it for matching)
          if (orderType === "GO_GRAB" && selectedDate && !isPastDate) {
            updateData.selectedDate = selectedDate;
            updateData.selectedTime = selectedTime;
          } else if (orderType === "PRE_ORDER" && selectedDate && !isPastDate) {
            updateData.selectedDate = selectedDate;
            updateData.selectedTime = selectedTime;
          }

          dispatch(updateCartItem(updateData));
        } else {
          // Add new item
          console.log("➕ Adding new item to cart with quantity:", newQuantity);

          // ✅ IMPROVED: Handle date storage properly
          let cartItemDate = null;
          if (!isPastDate && selectedDate) {
            cartItemDate = selectedDate; // Store date if it's not in the past
          }

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
            selectedDate: cartItemDate, // Use processed date
            selectedTime: !isPastDate ? selectedTime : null, // Only store time if date is valid
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
    [dispatch, cartItems]
  );

  return {
    cartItems,
    getCartQuantity,
    handleQuantityChange,
  };
};
