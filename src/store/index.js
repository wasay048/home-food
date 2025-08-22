import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import foodReducer from "./slices/foodSlice";
import cartReducer from "./slices/cartSlice";
import kitchenReducer from "./slices/kitchenSlice";
import reviewsReducer from "./slices/reviewsSlice";

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cart"], // Only persist auth and cart data
  blacklist: ["food", "kitchen", "reviews"], // Don't persist temporary data
};

// Auth-specific persist config
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "isAuthenticated", "isDevelopmentMode"], // Persist user data
  blacklist: ["loading", "error", "wechatAuthUrl"], // Don't persist loading states
};

// Cart-specific persist config
const cartPersistConfig = {
  key: "cart",
  storage,
  whitelist: ["items", "totalItems", "totalAmount"], // Persist cart data
  blacklist: ["loading", "error"], // Don't persist loading states
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  food: foodReducer,
  cart: persistReducer(cartPersistConfig, cartReducer),
  kitchen: kitchenReducer,
  reviews: reviewsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
