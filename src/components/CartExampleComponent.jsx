import React from "react";
import { useGenericCart } from "../hooks/useGenericCart";
import { showToast } from "../utils/toast";

/**
 * Example component showing how to use the generic cart functionality
 * This can be used as a reference for implementing cart features in any component
 */
const CartExampleComponent = ({
  food,
  kitchen,
  selectedDate = null,
  isPreOrder = false,
}) => {
  // Use the generic cart hook - works anywhere!
  const { getCartQuantity, addToCartWithCheck, handleQuantityChange } =
    useGenericCart();

  // Get current quantity in cart for this specific item
  const cartQuantity = getCartQuantity(food.id, selectedDate);

  // Handle adding single item to cart
  const handleAddToCart = async () => {
    const result = await addToCartWithCheck({
      food,
      kitchen,
      quantity: 1,
      selectedDate,
      specialInstructions: "",
      isPreOrder,
    });

    if (result.isExisting) {
      // Item already exists in cart - show message
      showToast.info(
        `${food.name} is already in cart with ${result.existingQuantity} items`
      );
    } else if (result.success) {
      // Successfully added
      showToast.success(result.message);
    } else {
      // Error occurred
      showToast.error(result.message);
    }
  };

  // Handle quantity changes (works with QuantitySelector or any input)
  const handleQuantityChangeLocal = async (newQuantity) => {
    const result = await handleQuantityChange({
      food,
      kitchen,
      newQuantity,
      currentQuantity: cartQuantity,
      selectedDate,
      specialInstructions: "",
      isPreOrder,
    });

    if (result.isExisting && !result.success) {
      // Item already exists with same specs - just show info
      showToast.info(result.message);
    }
  };

  return (
    <div className="cart-example">
      <h3>{food.name}</h3>
      <p>Current in cart: {cartQuantity}</p>

      <button onClick={handleAddToCart}>Add to Cart</button>

      <div>
        <label>Quantity: </label>
        <input
          type="number"
          min="0"
          max="99"
          value={cartQuantity}
          onChange={(e) =>
            handleQuantityChangeLocal(parseInt(e.target.value) || 0)
          }
        />
      </div>

      {/* Example with QuantitySelector */}
      {/* 
      <QuantitySelector
        food={food}
        kitchen={kitchen}
        selectedDate={selectedDate}
        initialQuantity={cartQuantity}
        onQuantityChange={handleQuantityChangeLocal}
        size="medium"
      />
      */}
    </div>
  );
};

export default CartExampleComponent;

/**
 * Usage Examples:
 *
 * // Basic usage in any component:
 * const { getCartQuantity, addToCartWithCheck, handleQuantityChange } = useGenericCart();
 *
 * // Check if item exists in cart:
 * const quantity = getCartQuantity(foodId, selectedDate);
 *
 * // Add item with duplicate checking:
 * const result = await addToCartWithCheck({
 *   food: { id: 'food-1', name: 'Pizza', cost: '12.99' },
 *   kitchen: { id: 'kitchen-1', name: 'Mario\'s Kitchen' },
 *   quantity: 1,
 *   selectedDate: null, // for Go&Grab
 *   specialInstructions: "",
 *   isPreOrder: false,
 * });
 *
 * // Handle quantity changes:
 * await handleQuantityChange({
 *   food,
 *   kitchen,
 *   newQuantity: 3,
 *   currentQuantity: 1,
 *   selectedDate: '2025-08-23',
 *   specialInstructions: "",
 *   isPreOrder: true,
 * });
 */
