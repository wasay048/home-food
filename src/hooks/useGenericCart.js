import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
  updateCartItem,
} from "../store/slices/cartSlice";
import { showToast } from "../utils/toast";

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

      const matchingItems = cartItems.filter((item) => {
        console.log("🔍 Checking item:", {
          itemFoodId: item.foodId,
          itemSelectedDate: item.selectedDate,
          itemOrderType: item.orderType,
          itemQuantity: item.quantity,
        });

        const matchesFood = String(item.foodId) === String(foodId);

        let matchesDate;
        if (selectedDate) {
          // For pre-order items, match exact date
          matchesDate = item.selectedDate === selectedDate;
        } else {
          // For Go&Grab items, match items with no selectedDate OR items with orderType GO_GRAB
          matchesDate =
            !item.selectedDate ||
            item.orderType === "GO_GRAB" ||
            item.orderType === "Go&Grab";
        }

        const matches = matchesFood && matchesDate;
        console.log("🔍 Item match result:", {
          matchesFood,
          matchesDate,
          matches,
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
        selectedDate,
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
        // Find the exact matching cart item
        const matchingItem = cartItems.find((item) => {
          const matchesFood = String(item.foodId) === String(food.id);
          const matchesDate = selectedDate
            ? item.selectedDate === selectedDate
            : !item.selectedDate ||
              item.orderType === "GO_GRAB" ||
              item.orderType === "Go&Grab";
          const matchesInstructions =
            (item.specialInstructions || "") === (specialInstructions || "");
          return matchesFood && matchesDate && matchesInstructions;
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

          dispatch(
            updateCartItem({
              cartItemId: matchingItem.id,
              quantity: newQuantity,
              specialInstructions: specialInstructions,
            })
          );
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
            selectedDate,
            selectedTime,
            specialInstructions,
            isPreOrder,
            orderType: isPreOrder ? "PRE_ORDER" : "GO_GRAB",
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
