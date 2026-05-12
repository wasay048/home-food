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
      const { selectedDate, selectedTime, updateFlag } = action.payload;
      console.log("newItem redux item:", newItem);
      console.log("state item length redux items:", state?.items?.length);

      // Find existing item with same foodId, selectedDate, specialInstructions, and orderType
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.foodId === newItem.foodId && item.orderType === newItem.orderType
      );
      console.log("existingItemIndex", existingItemIndex);

      if (existingItemIndex !== -1) {
        // Update existing item quantity
        const oldQuantity = state.items[existingItemIndex].quantity;
        if (updateFlag !== "date") {
          state.items[existingItemIndex].quantity += newItem.quantity || 1;
        }
        state.items[existingItemIndex].updatedAt = new Date().toISOString();
        state.items[existingItemIndex].selectedDate = selectedDate;
        state.items[existingItemIndex].selectedTime = selectedTime;
        console.log("📦 Updated existing cart item quantity:", {
          foodId: newItem.foodId,
          selectedDate: newItem.selectedDate,
          oldQuantity,
          newQuantity: state.items[existingItemIndex].quantity,
          addedQuantity: newItem.quantity || 1,
        });
      } else {
        const itemToAdd = {
          id: `cart-item-${Date.now()}-${Math.random()}`,
          foodId: newItem.foodId,
          kitchenId: newItem.kitchenId,
          userId: newItem.userId || "local_user",
          quantity: newItem.quantity || 1,
          selectedDate: newItem.selectedDate || null,
          selectedTime: newItem.selectedTime || null,
          orderType: newItem.orderType || "GO_GRAB",
          // fulfillmentType: 1 = delivery, 2 = pickup, undefined/null = pickup (default)
          fulfillmentType: newItem.fulfillmentType || null,
          specialInstructions: newItem.specialInstructions || "",
          foodCategory: newItem.food?.foodCategory || newItem.foodCategory || null,
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
          // ✅ Persist the Pickup Now flag onto the new cart line. Without
          // this, the addToCart whitelist strips it and downstream pages
          // (OrderPage / PaymentPage) see `item.pickupNow === undefined`,
          // which collapses cat-8 lines into the no-date/no-time branch.
          pickupNow: !!newItem.pickupNow,
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
      const {
        cartItemId,
        quantity,
        specialInstructions,
        orderType,
        selectedDate,
        selectedTime,
        fulfillmentType,
        pickupNow,
        foodStock,
      } = action.payload;

      console.log("📝 Updating cart item:", action.payload);
      console.log("state item length redux items:", state?.items?.length);
      const itemIndex = state.items.findIndex(
        (item) => item.id === cartItemId && item.orderType === orderType
      );
      console.log("itemIndex redux items:", itemIndex);
      if (itemIndex !== -1) {
        if (quantity !== undefined) {
          state.items[itemIndex].quantity = quantity;
        }
        if (specialInstructions && specialInstructions !== undefined) {
          state.items[itemIndex].specialInstructions = specialInstructions;
        }
        if (selectedDate !== undefined) {
          state.items[itemIndex].selectedDate = selectedDate;
        }
        if (selectedTime !== undefined) {
          state.items[itemIndex].selectedTime = selectedTime;
        }
        if (fulfillmentType !== undefined) {
          state.items[itemIndex].fulfillmentType = fulfillmentType;
        }
        // ✅ Carry through the Pickup Now flag and the latest stock snapshot
        // so OrderPage / PaymentPage keep validating quantity against
        // food.stock for Pickup Now items, even when the cart line was
        // created before this flag existed.
        if (pickupNow !== undefined) {
          state.items[itemIndex].pickupNow = !!pickupNow;
        }
        if (foodStock !== undefined && state.items[itemIndex].food) {
          state.items[itemIndex].food.stock = foodStock;
        }
        state.items[itemIndex].updatedAt = new Date().toISOString();
        console.log("Updated cart redux items:", state.items);
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

    // Remove all cart items that do NOT belong to the given kitchenId.
    // Called when the user navigates to a kitchen listing so stale
    // items from a previously-viewed kitchen are pruned automatically.
    removeItemsFromOtherKitchens: (state, action) => {
      const activeKitchenId = action.payload;
      if (!activeKitchenId) return;

      const before = state.items.length;
      const removed = state.items.filter(
        (item) => item.kitchenId && item.kitchenId !== activeKitchenId
      );

      if (removed.length === 0) return;

      console.log(
        `🧹 [Cart] Removing ${removed.length} item(s) from other kitchens (active: ${activeKitchenId}):`,
        removed.map((i) => ({ name: i.food?.name, kitchenId: i.kitchenId }))
      );

      state.items = state.items.filter(
        (item) => !item.kitchenId || item.kitchenId === activeKitchenId
      );

      console.log(
        `🧹 [Cart] Cart pruned: ${before} → ${state.items.length} item(s)`
      );

      cartSlice.caseReducers.calculateTotals(state);
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
  removeItemsFromOtherKitchens,
} = cartSlice.actions;

export default cartSlice.reducer;
