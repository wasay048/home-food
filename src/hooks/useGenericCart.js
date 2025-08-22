import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
  updateCartItem,
} from "../store/slices/cartSlice";
import {
  handleGenericAddToCart,
  handleGenericRemoveFromCart,
  getCartQuantity as getCartQuantityUtil,
  handleGenericQuantityChange,
} from "../utils/cartUtils";

/**
 * Custom hook for generic cart operations
 * This can be used in any component that needs cart functionality
 *
 * @returns {Object} Cart operations and state
 */
export const useGenericCart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  /**
   * Get cart quantity for a specific food item
   * @param {string} foodId - Food item ID
   * @param {string|null} selectedDate - Selected date (null for Go&Grab)
   * @returns {number} Total quantity in cart
   */
  const getCartQuantity = (foodId, selectedDate = null) => {
    return getCartQuantityUtil(cartItems, foodId, selectedDate);
  };

  /**
   * Add item to cart with duplicate checking
   * @param {Object} params - Cart item parameters
   * @returns {Promise<Object>} Result object
   */
  const addToCartWithCheck = async (params) => {
    if (!isAuthenticated) {
      return {
        success: false,
        message: "Please log in to add items to cart",
      };
    }

    return await handleGenericAddToCart(
      params,
      dispatch,
      addToCart,
      cartItems,
      updateCartItem
    );
  };

  /**
   * Remove item from cart
   * @param {Object} params - Remove parameters
   * @returns {Promise<Object>} Result object
   */
  const removeFromCartGeneric = async (params) => {
    return await handleGenericRemoveFromCart(
      params,
      dispatch,
      removeFromCart,
      cartItems
    );
  };

  /**
   * Handle quantity changes with smart cart operations
   * @param {Object} params - Quantity change parameters
   * @returns {Promise<Object>} Result object
   */
  const handleQuantityChange = async (params) => {
    if (!isAuthenticated) {
      return {
        success: false,
        message: "Please log in to modify cart",
      };
    }

    return await handleGenericQuantityChange(
      params,
      dispatch,
      addToCart,
      removeFromCart,
      cartItems,
      updateCartItem
    );
  };

  return {
    // State
    cartItems,
    isAuthenticated,

    // Actions
    getCartQuantity,
    addToCartWithCheck,
    removeFromCartGeneric,
    handleQuantityChange,

    // Raw actions (for advanced usage)
    dispatch,
    addToCart,
    removeFromCart,
  };
};

export default useGenericCart;
