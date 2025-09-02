import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
  updateCartItem,
} from "../store/slices/cartSlice";
import { showToast } from "../utils/toast";
import dayjs from "dayjs";

export const useGenericCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  // Function to get cart quantity for a specific food item
  const getCartQuantity = useCallback(
    (foodId, selectedDate = null, isPreOrder = false) => {
      console.log("🔍 getCartQuantity called with:", {
        foodId,
        selectedDate,
        isPreOrder,
        cartItemsCount: cartItems.length,
      });

      if (!foodId || !cartItems || cartItems.length === 0) {
        console.log("🔍 Early return: no foodId or empty cart");
        return 0;
      }

      // Store the original selectedDate for logging
      const originalSelectedDate = selectedDate;

      // ✅ NEW: Check if selectedDate is in the past
      const today = dayjs().startOf("day");
      const isPastDate =
        selectedDate && dayjs(selectedDate).startOf("day").isBefore(today);

      // ✅ FIXED: Determine what we're looking for based on parameters
      let targetOrderType;
      let targetDate;

      if (isPastDate) {
        console.log("🔍 Past date detected, looking for Go&Grab items");
        targetOrderType = "GO_GRAB";
        targetDate = null;
      } else if (isPreOrder && selectedDate) {
        console.log("🔍 Looking for Pre-Order items with specific date");
        targetOrderType = "PRE_ORDER";
        targetDate = selectedDate;
      } else if (selectedDate) {
        console.log(
          "🔍 Looking for Pre-Order items with date (inferred from selectedDate)"
        );
        targetOrderType = "PRE_ORDER";
        targetDate = selectedDate;
      } else {
        console.log("🔍 Looking for Go&Grab items");
        targetOrderType = "GO_GRAB";
        targetDate = null;
      }

      const matchingItems = cartItems.filter((item) => {
        console.log("🔍 Checking item:", {
          itemId: item.id,
          itemFoodId: item.foodId,
          itemSelectedDate: item.selectedDate,
          itemOrderType: item.orderType,
          itemIsPreOrder: item.isPreOrder,
          itemQuantity: item.quantity,
        });

        const matchesFood = String(item.foodId) === String(foodId);

        let matchesOrderTypeAndDate = false;

        if (targetOrderType === "PRE_ORDER") {
          // Looking for Pre-Order items
          const isItemPreOrder =
            item.orderType === "PRE_ORDER" || item.isPreOrder === true;
          const matchesDate = item.selectedDate === targetDate;
          matchesOrderTypeAndDate = isItemPreOrder && matchesDate;

          console.log("🔍 Pre-Order matching:", {
            isItemPreOrder,
            matchesDate,
            itemSelectedDate: item.selectedDate,
            targetDate,
            result: matchesOrderTypeAndDate,
          });
        } else {
          // Looking for Go&Grab items
          const isItemGoGrab =
            item.orderType === "GO_GRAB" ||
            item.orderType === "Go&Grab" ||
            item.orderType === "Go & Grab" ||
            (!item.orderType && !item.isPreOrder) ||
            item.isPreOrder === false;

          // For Go&Grab, be flexible with date
          const flexibleDateMatch =
            !targetDate || !item.selectedDate || isPastDate;
          matchesOrderTypeAndDate = isItemGoGrab && flexibleDateMatch;

          console.log("🔍 Go&Grab matching:", {
            isItemGoGrab,
            flexibleDateMatch,
            result: matchesOrderTypeAndDate,
          });
        }

        const matches = matchesFood && matchesOrderTypeAndDate;
        console.log("🔍 Item match result:", {
          matchesFood,
          matchesOrderTypeAndDate,
          matches,
          targetOrderType,
          targetDate,
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
        originalSelectedDate, // ✅ FIXED: Use stored variable instead of arguments[1]
        targetOrderType,
        targetDate,
        isPastDate,
        matchingItemsCount: matchingItems.length,
        matchingItems: matchingItems.map((item) => ({
          id: item.id,
          foodId: item.foodId,
          quantity: item.quantity,
          selectedDate: item.selectedDate,
          orderType: item.orderType,
          isPreOrder: item.isPreOrder,
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
          effectiveSelectedDate = null;
          console.log("🔍 Past date detected, forcing Go&Grab:", {
            originalDate: selectedDate,
            isPastDate: true,
          });
        } else if (isPreOrder || selectedDate) {
          // If explicitly pre-order OR has a selected date, treat as Pre-Order
          orderType = "PRE_ORDER";
          effectiveSelectedDate = selectedDate;
        } else {
          // Default to Go&Grab
          orderType = "GO_GRAB";
          effectiveSelectedDate = null;
        }

        console.log("🔍 Cart item matching criteria:", {
          orderType,
          effectiveSelectedDate,
          originalSelectedDate: selectedDate,
          isPastDate,
          isPreOrder,
        });

        // ✅ FIXED: Find the exact matching cart item with proper order type matching
        const matchingItem = cartItems.find((item) => {
          const matchesFood = String(item.foodId) === String(food.id);

          let matchesOrderType;
          let matchesDate;

          if (orderType === "PRE_ORDER" && !isPastDate) {
            // For pre-orders with future dates, match exact date AND order type
            matchesOrderType =
              item.orderType === "PRE_ORDER" || item.isPreOrder === true;
            matchesDate = item.selectedDate === selectedDate;
          } else {
            // For Go&Grab or past dates, match Go&Grab order types only
            matchesOrderType =
              item.orderType === "GO_GRAB" ||
              item.orderType === "Go&Grab" ||
              item.orderType === "Go & Grab" ||
              (!item.orderType && !item.isPreOrder) ||
              item.isPreOrder === false;

            // For Go&Grab, be flexible with date matching
            matchesDate = !item.selectedDate || !selectedDate || isPastDate;
          }

          const matchesInstructions =
            (item.specialInstructions || "") === (specialInstructions || "");

          const matches =
            matchesFood &&
            matchesOrderType &&
            matchesDate &&
            matchesInstructions;

          console.log("🔍 Item matching details:", {
            itemId: item.id,
            matchesFood,
            matchesOrderType,
            matchesDate,
            matchesInstructions,
            matches,
            itemOrderType: item.orderType,
            itemIsPreOrder: item.isPreOrder,
            itemSelectedDate: item.selectedDate,
            targetOrderType: orderType,
            targetDate: effectiveSelectedDate,
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
            orderType: matchingItem.orderType,
            isPreOrder: matchingItem.isPreOrder,
            selectedDate: matchingItem.selectedDate,
          });

          // ✅ IMPROVED: Update cart item with proper date handling
          const updateData = {
            cartItemId: matchingItem.id,
            quantity: newQuantity,
            specialInstructions: specialInstructions,
          };

          // Update date/time based on order type
          if (orderType === "PRE_ORDER" && selectedDate && !isPastDate) {
            updateData.selectedDate = selectedDate;
            updateData.selectedTime = selectedTime;
          } else if (orderType === "GO_GRAB" && selectedDate && !isPastDate) {
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
            cartItemDate = selectedDate;
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
            selectedDate: cartItemDate,
            selectedTime: !isPastDate ? selectedTime : null,
            specialInstructions,
            isPreOrder: orderType === "PRE_ORDER",
            orderType,
          };

          console.log("🛒 Adding cart item with details:", cartItem);
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
