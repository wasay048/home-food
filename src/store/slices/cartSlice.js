import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";

// Async thunk for adding item to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    {
      foodId,
      kitchenId,
      quantity,
      selectedDate,
      orderType,
      food,
      specialInstructions,
      pickupDetails,
    },
    { getState }
  ) => {
    const { auth } = getState();
    const userId = auth.user?.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // TODO: Implement actual cart API calls when backend is ready
    console.log("Adding to cart:", {
      foodId,
      kitchenId,
      quantity,
      selectedDate,
      orderType,
      specialInstructions,
      pickupDetails,
      userId,
    });

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      id: `cart-item-${Date.now()}`,
      foodId,
      kitchenId,
      userId,
      quantity,
      selectedDate,
      orderType,
      specialInstructions: specialInstructions || "", // Store special instructions
      food: food || null, // Store food data for display
      pickupDetails: pickupDetails || {
        date: selectedDate,
        time: null,
        display:
          orderType === "GO_GRAB" ? "Pick up today" : `Pick up ${selectedDate}`,
        orderType: orderType,
      },
      addedAt: new Date().toISOString(),
    };
  }
);

// Async thunk for removing item from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (cartItemId, { getState }) => {
    const { auth } = getState();
    const userId = auth.user?.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // TODO: Implement actual remove API call
    console.log("Removing from cart:", { cartItemId, userId });

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return cartItemId;
  }
);

// Async thunk for updating cart item quantity
export const updateCartQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ cartItemId, quantity }, { getState }) => {
    const { auth } = getState();
    const userId = auth.user?.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // TODO: Implement actual update API call
    console.log("Updating cart quantity:", { cartItemId, quantity, userId });

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return { cartItemId, quantity };
  }
);

// Async thunk for updating cart item (quantity and special instructions)
export const updateCartItem = createAsyncThunk(
  "cart/updateItem",
  async ({ cartItemId, quantity, specialInstructions }, { getState }) => {
    const { auth } = getState();
    const userId = auth.user?.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // TODO: Implement actual update API call
    console.log("Updating cart item:", {
      cartItemId,
      quantity,
      specialInstructions,
      userId,
    });

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return { cartItemId, quantity, specialInstructions };
  }
);

// Async thunk for updating pickup details (date and time)
export const updatePickupDetails = createAsyncThunk(
  "cart/updatePickupDetails",
  async ({ cartItemId, pickupDate, pickupTime, orderType }, { getState }) => {
    const { auth } = getState();
    const userId = auth.user?.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // TODO: Implement actual update API call
    console.log("Updating pickup details:", {
      cartItemId,
      pickupDate,
      pickupTime,
      orderType,
      userId,
    });

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return { cartItemId, pickupDate, pickupTime, orderType };
  }
);

// Async thunk for fetching user's cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState }) => {
    const { auth } = getState();
    const userId = auth.user?.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // TODO: Implement actual fetch cart API call
    console.log("Fetching cart for user:", userId);

    // For now, return empty cart
    return [];
  }
);

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
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      state.lastUpdated = new Date().toISOString();
    },
    clearError: (state) => {
      state.error = null;
    },
    calculateTotals: (state) => {
      state.totalItems = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );

      // Calculate total amount if food data is available
      state.totalAmount = state.items.reduce((total, item) => {
        const itemCost = item.food?.cost || 0;
        return total + parseFloat(itemCost) * item.quantity;
      }, 0);

      state.lastUpdated = new Date().toISOString();
    },
    // Local actions for immediate UI updates
    addItemLocally: (state, action) => {
      const { foodId, quantity, selectedDate } = action.payload;
      const existingItem = state.items.find(
        (item) => item.foodId === foodId && item.selectedDate === selectedDate
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push(action.payload);
      }

      cartSlice.caseReducers.calculateTotals(state);
    },

    // Update pickup details locally for immediate UI feedback
    updatePickupDetailsLocally: (state, action) => {
      const { cartItemId, pickupDate, pickupTime, orderType } = action.payload;
      const item = state.items.find((item) => item.id === cartItemId);

      if (item) {
        // Update selected date and order type
        if (pickupDate !== undefined) {
          item.selectedDate = pickupDate;
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

        state.lastUpdated = new Date().toISOString();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;

        const newItem = action.payload;
        const existingItem = state.items.find(
          (item) =>
            item.foodId === newItem.foodId &&
            item.selectedDate === newItem.selectedDate &&
            item.specialInstructions === newItem.specialInstructions
        );

        if (existingItem) {
          existingItem.quantity += newItem.quantity;
        } else {
          state.items.push(newItem);
        }

        cartSlice.caseReducers.calculateTotals(state);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        cartSlice.caseReducers.calculateTotals(state);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update quantity
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const { cartItemId, quantity } = action.payload;
        const item = state.items.find((item) => item.id === cartItemId);
        if (item) {
          item.quantity = quantity;
        }
        cartSlice.caseReducers.calculateTotals(state);
      })

      // Update cart item (quantity and special instructions)
      .addCase(updateCartItem.fulfilled, (state, action) => {
        const { cartItemId, quantity, specialInstructions } = action.payload;
        const item = state.items.find((item) => item.id === cartItemId);
        if (item) {
          item.quantity = quantity;
          if (specialInstructions !== undefined) {
            item.specialInstructions = specialInstructions;
          }
        }
        cartSlice.caseReducers.calculateTotals(state);
      })

      // Update pickup details (date and time)
      .addCase(updatePickupDetails.fulfilled, (state, action) => {
        const { cartItemId, pickupDate, pickupTime, orderType } =
          action.payload;
        const item = state.items.find((item) => item.id === cartItemId);
        if (item) {
          // Update selected date and order type
          if (pickupDate !== undefined) {
            item.selectedDate = pickupDate;
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
              orderType === "GO_GRAB"
                ? "Pick up today"
                : `Pick up ${pickupDate}`;
          }

          if (pickupTime !== undefined) {
            item.pickupDetails.time = pickupTime;
          }

          if (orderType !== undefined) {
            item.pickupDetails.orderType = orderType;
          }
        }
        cartSlice.caseReducers.calculateTotals(state);
      })

      // Fetch cart
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
        cartSlice.caseReducers.calculateTotals(state);
      })

      // Handle rehydration from persistence
      .addCase(REHYDRATE, (state, action) => {
        if (action.payload?.cart) {
          // Merge persisted cart state
          return {
            ...state,
            ...action.payload.cart,
            loading: false,
            error: null,
          };
        }
      });
  },
});

export const {
  clearCart,
  clearError,
  calculateTotals,
  addItemLocally,
  updatePickupDetailsLocally,
} = cartSlice.actions;

export default cartSlice.reducer;
