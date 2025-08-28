import { showToast } from "./toast";

/**
 * Generic cart utility functions that can be used across all components
 */

/**
 * Finds an existing cart item that matches the given criteria
 * @param {Array} cartItems - Array of cart items from Redux store
 * @param {Object} itemCriteria - Object containing foodId, selectedDate, specialInstructions
 * @returns {Object|null} - Existing cart item or null if not found
 */
export const findExistingCartItem = (
  cartItems,
  { foodId, selectedDate, specialInstructions = "" }
) => {
  return cartItems.find(
    (item) =>
      item.foodId === foodId &&
      item.selectedDate === selectedDate &&
      (item.specialInstructions || "").trim() === specialInstructions.trim()
  );
};

/**
 * Gets the total quantity for a specific food item in the cart
 * @param {Array} cartItems - Array of cart items from Redux store
 * @param {string} foodId - Food item ID
 * @param {string|null} selectedDate - Selected date (null for Go&Grab items)
 * @returns {number} - Total quantity of the item in cart
 */
export const getCartQuantity = (cartItems, foodId, selectedDate = null) => {
  return cartItems
    .filter(
      (item) =>
        item.foodId === foodId &&
        (!selectedDate || item.selectedDate === selectedDate)
    )
    .reduce((total, item) => total + item.quantity, 0);
};

/**
 * Generic add to cart handler that can be used by any component
 * @param {Object} params - Parameters for adding to cart
 * @param {Function} dispatch - Redux dispatch function
 * @param {Function} addToCartAction - Redux action for adding to cart
 * @param {Array} cartItems - Current cart items from Redux store
 * @param {Function} updateCartItemAction - Redux action for updating cart items (optional)
 * @returns {Object} - Result object with success status and message
 */
export const handleGenericAddToCart = async (
  {
    food,
    kitchen,
    quantity = 1,
    selectedDate = null,
    selectedTime = null,
    specialInstructions = "",
    isPreOrder = false,
    pickupDetails = null,
  },
  dispatch,
  addToCartAction,
  cartItems,
  updateCartItemAction = null
) => {
  try {
    // Check if item already exists in cart
    const existingItem = findExistingCartItem(cartItems, {
      foodId: food.id,
      selectedDate,
      specialInstructions,
    });

    if (existingItem) {
      // Item already exists - update quantity and special instructions
      const newQuantity = existingItem.quantity + quantity;
      const message = `Updated ${food.name} in cart (quantity: ${existingItem.quantity} → ${newQuantity})`;

      // Update the existing item's quantity and special instructions
      try {
        if (updateCartItemAction) {
          // Use provided update action
          await dispatch(
            updateCartItemAction({
              cartItemId: existingItem.id,
              quantity: newQuantity,
              specialInstructions: specialInstructions.trim(),
            })
          );
        } else {
          // Import updateCartItem action dynamically as fallback
          const { updateCartItem } = await import("../store/slices/cartSlice");

          await dispatch(
            updateCartItem({
              cartItemId: existingItem.id,
              quantity: newQuantity,
              specialInstructions: specialInstructions.trim(),
            })
          );
        }

        return {
          success: true,
          isExisting: true,
          existingQuantity: existingItem.quantity,
          newQuantity: newQuantity,
          message,
        };
      } catch (error) {
        // If update fails, fall back to adding as new item
        console.warn(
          "Failed to update existing item, adding as new item:",
          error
        );
      }
    }

    // Generate pickup details if not provided
    const finalPickupDetails =
      pickupDetails ||
      generatePickupDetails(selectedDate, isPreOrder, selectedTime);

    // Prepare cart item data
    const cartItemData = {
      foodId: food.id,
      kitchenId: food.kitchenId || kitchen?.id,
      quantity,
      selectedDate,
      specialInstructions: specialInstructions.trim(),
      orderType: isPreOrder ? "PRE_ORDER" : "GO_GRAB",
      food: {
        id: food.id,
        name: food.name,
        cost: food.cost,
        price: food.price || food.cost,
        imageUrl: food.imageUrl,
        description:
          food.description || "This dish features tender, juicy flavors",
        // Include any other relevant food fields
        ...food,
      },
      kitchen: {
        id: kitchen?.id || food.kitchenId,
        name: kitchen?.name || food.kitchenName || "Unknown Kitchen",
        address: kitchen?.address,
        // Include any other relevant kitchen fields
        ...kitchen,
      },
      pickupDetails: finalPickupDetails,
    };

    // Add to cart using the provided action
    const result = await dispatch(addToCartAction(cartItemData));

    return {
      success: true,
      isExisting: false,
      message: `Added ${food.name} to cart!`,
      result,
    };
  } catch (error) {
    console.error("Error adding to cart:", error);
    const errorMessage = error.message || "Failed to add item to cart";
    showToast.error(errorMessage);

    return {
      success: false,
      isExisting: false,
      message: errorMessage,
      error,
    };
  }
};

/**
 * Generic remove from cart handler
 * @param {Object} params - Parameters for removing from cart
 * @param {Function} dispatch - Redux dispatch function
 * @param {Function} removeFromCartAction - Redux action for removing from cart
 * @param {Array} cartItems - Current cart items from Redux store
 * @returns {Object} - Result object with success status and message
 */
export const handleGenericRemoveFromCart = async (
  { food, selectedDate = null, specialInstructions = "", quantity = 1 },
  dispatch,
  removeFromCartAction,
  cartItems
) => {
  try {
    // Find the cart item to remove
    const cartItem = findExistingCartItem(cartItems, {
      foodId: food.id,
      selectedDate,
      specialInstructions,
    });

    if (!cartItem) {
      throw new Error("Item not found in cart");
    }

    // If we need to remove fewer items than the current quantity, update the quantity
    if (quantity > 0 && cartItem.quantity > quantity) {
      // Import updateCartItem action dynamically
      const { updateCartItem } = await import("../store/slices/cartSlice");

      const newQuantity = cartItem.quantity - quantity;
      await dispatch(
        updateCartItem({
          cartItemId: cartItem.id,
          quantity: newQuantity,
          specialInstructions: cartItem.specialInstructions,
        })
      );

      return {
        success: true,
        message: `Removed ${quantity} ${food.name} from cart`,
      };
    } else {
      // Remove the entire item from cart
      await dispatch(removeFromCartAction(cartItem.id));

      return {
        success: true,
        message: `Removed ${food.name} from cart`,
      };
    }
  } catch (error) {
    console.error("Error removing from cart:", error);
    const errorMessage = error.message || "Failed to remove item from cart";
    showToast.error(errorMessage);

    return {
      success: false,
      message: errorMessage,
      error,
    };
  }
};

/**
 * Helper function to generate pickup details
 * @param {string|null} selectedDate - Selected date
 * @param {boolean} isPreOrder - Whether this is a pre-order
 * @returns {Object} - Pickup details object
 */
const generatePickupDetails = (
  selectedDate = null,
  isPreOrder = false,
  selectedTime = null
) => {
  if (!isPreOrder || !selectedDate) {
    // Go & Grab - pickup today + 30 minutes or use selected time
    const now = new Date();
    const pickupTime =
      selectedTime ||
      new Date(now.getTime() + 30 * 60 * 1000).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

    return {
      date: now.toISOString().split("T")[0], // Standard date format YYYY-MM-DD
      time: pickupTime,
      display: `Today at ${pickupTime}`,
      orderType: "Go&Grab",
    };
  } else {
    // Pre-order - pickup on selected date at selected time or default 6:30 PM
    const pickupDate = new Date(selectedDate);
    const pickupTime = selectedTime || "6:30 PM";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    pickupDate.setHours(0, 0, 0, 0);

    const isToday = pickupDate.getTime() === today.getTime();
    const orderType = isToday ? "Go&Grab" : "Pre-Order";

    return {
      date: selectedDate,
      time: pickupTime,
      display: `${pickupDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })} at ${pickupTime}`,
      orderType: orderType,
    };
  }
};

/**
 * Generic quantity change handler that works with cart state
 * @param {Object} params - Parameters for quantity change
 * @param {Function} dispatch - Redux dispatch function
 * @param {Function} addToCartAction - Add to cart action
 * @param {Function} removeFromCartAction - Remove from cart action
 * @param {Array} cartItems - Current cart items
 * @param {Function} updateCartItemAction - Update cart item action (optional)
 * @returns {Object} - Result object
 */
export const handleGenericQuantityChange = async (
  {
    food,
    kitchen,
    newQuantity,
    currentQuantity,
    selectedDate = null,
    selectedTime = null,
    specialInstructions = "",
    isPreOrder = false,
  },
  dispatch,
  addToCartAction,
  removeFromCartAction,
  cartItems,
  updateCartItemAction = null
) => {
  try {
    if (newQuantity > currentQuantity) {
      // Add items to cart
      const quantityToAdd = newQuantity - currentQuantity;
      return await handleGenericAddToCart(
        {
          food,
          kitchen,
          quantity: quantityToAdd,
          selectedDate,
          selectedTime,
          specialInstructions,
          isPreOrder,
        },
        dispatch,
        addToCartAction,
        cartItems,
        updateCartItemAction
      );
    } else if (newQuantity < currentQuantity) {
      // Remove items from cart
      const quantityToRemove = currentQuantity - newQuantity;
      return await handleGenericRemoveFromCart(
        {
          food,
          selectedDate,
          specialInstructions,
          quantity: quantityToRemove,
        },
        dispatch,
        removeFromCartAction,
        cartItems
      );
    }

    return {
      success: true,
      message: "Quantity unchanged",
    };
  } catch (error) {
    console.error("Error changing quantity:", error);
    return {
      success: false,
      message: error.message || "Failed to update quantity",
      error,
    };
  }
};
