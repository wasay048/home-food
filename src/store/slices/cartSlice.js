import { createSlice } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalItems: 0,
    totalAmount: 0,
    loading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    // Add item to cart (synchronous since no backend)
    addToCart: (state, action) => {
      console.log("🛒 Adding to cart:", action.payload);

      const newItem = action.payload;

      // Find existing item with same foodId, selectedDate, specialInstructions, and orderType
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.foodId === newItem.foodId &&
          item.selectedDate === newItem.selectedDate &&
          (item.specialInstructions || "") ===
            (newItem.specialInstructions || "") &&
          item.orderType === newItem.orderType
      );

      if (existingItemIndex !== -1) {
        // Update existing item quantity
        const oldQuantity = state.items[existingItemIndex].quantity;
        state.items[existingItemIndex].quantity += newItem.quantity || 1;
        state.items[existingItemIndex].updatedAt = new Date().toISOString();

        console.log("📦 Updated existing cart item quantity:", {
          foodId: newItem.foodId,
          selectedDate: newItem.selectedDate,
          oldQuantity,
          newQuantity: state.items[existingItemIndex].quantity,
          addedQuantity: newItem.quantity || 1,
        });
      } else {
        // Add new item with proper structure
        const itemToAdd = {
          id: `cart-item-${Date.now()}-${Math.random()}`,
          foodId: newItem.foodId,
          kitchenId: newItem.kitchenId,
          userId: newItem.userId || "local_user",
          quantity: newItem.quantity || 1,
          selectedDate: newItem.selectedDate || null,
          selectedTime: newItem.selectedTime || null,
          orderType: newItem.orderType || "GO_GRAB",
          specialInstructions: newItem.specialInstructions || "",
          food: newItem.food || null,
          kitchen: newItem.kitchen || null,
          pickupDetails: newItem.pickupDetails || {
            date: newItem.selectedDate,
            time: newItem.selectedTime,
            display:
              newItem.orderType === "GO_GRAB"
                ? "Pick up today"
                : `Pick up ${newItem.selectedDate}`,
            orderType: newItem.orderType || "GO_GRAB",
          },
          isPreOrder: newItem.isPreOrder || false,
          addedAt: new Date().toISOString(),
        };

        state.items.push(itemToAdd);
        console.log("📦 Added new cart item:", itemToAdd);
      }

      cartSlice.caseReducers.calculateTotals(state);
    },

    // Remove item from cart (synchronous)
    removeFromCart: (state, action) => {
      const cartItemId = action.payload;
      console.log("🗑️ Removing from cart:", cartItemId);

      const initialLength = state.items.length;
      state.items = state.items.filter((item) => item.id !== cartItemId);

      console.log("🗑️ Removed cart item:", {
        itemId: cartItemId,
        itemsRemoved: initialLength - state.items.length,
        remainingItems: state.items.length,
      });

      cartSlice.caseReducers.calculateTotals(state);
    },

    // Update cart item (quantity and special instructions)
    updateCartItem: (state, action) => {
      const { cartItemId, quantity, specialInstructions } = action.payload;
      console.log("📝 Updating cart item:", action.payload);

      const itemIndex = state.items.findIndex((item) => item.id === cartItemId);

      if (itemIndex !== -1) {
        if (quantity !== undefined) {
          state.items[itemIndex].quantity = quantity;
        }
        if (specialInstructions !== undefined) {
          state.items[itemIndex].specialInstructions = specialInstructions;
        }
        state.items[itemIndex].updatedAt = new Date().toISOString();

        console.log("📝 Updated cart item:", {
          itemId: cartItemId,
          newQuantity: quantity,
          specialInstructions,
        });

        cartSlice.caseReducers.calculateTotals(state);
      } else {
        console.error("❌ Cart item not found for update:", cartItemId);
      }
    },

    // Update pickup details (date and time)
    updatePickupDetails: (state, action) => {
      const { cartItemId, pickupDate, pickupTime, orderType } = action.payload;
      console.log("📅 Updating pickup details:", action.payload);

      const item = state.items.find((item) => item.id === cartItemId);

      if (item) {
        // Update selected date and order type
        if (pickupDate !== undefined) {
          item.selectedDate = pickupDate;
        }
        if (pickupTime !== undefined) {
          item.selectedTime = pickupTime;
        }
        if (orderType !== undefined) {
          item.orderType = orderType;
        }

        // Update pickup details object
        if (!item.pickupDetails) {
          item.pickupDetails = {};
        }

        if (pickupDate !== undefined) {
          item.pickupDetails.date = pickupDate;
          item.pickupDetails.display =
            orderType === "GO_GRAB" ? "Pick up today" : `Pick up ${pickupDate}`;
        }

        if (pickupTime !== undefined) {
          item.pickupDetails.time = pickupTime;
        }

        if (orderType !== undefined) {
          item.pickupDetails.orderType = orderType;
        }

        item.updatedAt = new Date().toISOString();
        console.log("📅 Updated pickup details for item:", cartItemId);
      } else {
        console.error(
          "❌ Cart item not found for pickup details update:",
          cartItemId
        );
      }
    },

    // Clear entire cart
    clearCart: (state) => {
      console.log("🗑️ Clearing entire cart");
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      state.lastUpdated = new Date().toISOString();
    },

    // Clear errors
    clearError: (state) => {
      state.error = null;
    },

    // Calculate totals helper
    calculateTotals: (state) => {
      state.totalItems = state.items.reduce(
        (total, item) => total + (item.quantity || 1),
        0
      );

      // Calculate total amount if food data is available
      state.totalAmount = state.items.reduce((total, item) => {
        const itemCost = item.food?.cost || 0;
        const cost =
          typeof itemCost === "string" ? parseFloat(itemCost) : itemCost;
        return total + cost * (item.quantity || 1);
      }, 0);

      state.lastUpdated = new Date().toISOString();

      console.log("🧮 Calculated totals:", {
        totalItems: state.totalItems,
        totalAmount: state.totalAmount,
        itemCount: state.items.length,
      });
    },

    // Set loading state manually if needed
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // Set error manually if needed
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle rehydration from persistence
      .addCase(REHYDRATE, (state, action) => {
        if (action.payload?.cart) {
          console.log(
            "💾 Rehydrating cart from persistence:",
            action.payload.cart
          );

          // Merge persisted cart state
          const rehydratedState = {
            ...state,
            ...action.payload.cart,
            loading: false,
            error: null,
          };

          // Recalculate totals after rehydration
          cartSlice.caseReducers.calculateTotals(rehydratedState);

          return rehydratedState;
        }
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartItem,
  updatePickupDetails,
  clearCart,
  clearError,
  calculateTotals,
  setLoading,
  setError,
} = cartSlice.actions;

export default cartSlice.reducer;
