import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import foodReducer from "./slices/foodSlice";
import cartReducer from "./slices/cartSlice";
import kitchenReducer from "./slices/kitchenSlice";
import reviewsReducer from "./slices/reviewsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    food: foodReducer,
    cart: cartReducer,
    kitchen: kitchenReducer,
    reviews: reviewsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export default store;
