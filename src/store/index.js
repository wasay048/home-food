import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import foodReducer from "./slices/foodSlice";
import cartReducer from "./slices/cartSlice";
import kitchenReducer from "./slices/kitchenSlice";
import reviewsReducer from "./slices/reviewsSlice";
import listingSlice from "./slices/listingSlice";
import foodCategoriesReducer from "./slices/foodCategoriesSlice";

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cart", "food", "kitchen", "listing", "foodCategories"], // Only persist auth and cart data
  blacklist: ["reviews"], // Don't persist temporary data
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
const foodPersistConfig = {
  key: "food",
  storage,
  whitelist: ["foodData", "lastUpdated"], // Persist food data and timestamp
  blacklist: ["loading", "error"], // Don't persist loading states
};

// ✅ NEW: Kitchen-specific persist config
const kitchenPersistConfig = {
  key: "kitchen",
  storage,
  whitelist: ["kitchenData", "currentKitchen", "lastUpdated"], // Persist kitchen data
  blacklist: ["loading", "error"], // Don't persist loading states
};

// ✅ NEW: Listing-specific persist config
const listingPersistConfig = {
  key: "listing",
  storage,
  whitelist: [
    "goGrabItems",
    "preOrderItems",
    "availablePreorderDates",
    "kitchen",
    "lastUpdated",
  ], // Persist listing data
  blacklist: ["isLoading", "error"], // Don't persist loading states
};

// ✅ NEW: Food Categories persist config
const foodCategoriesPersistConfig = {
  key: "foodCategories",
  storage,
  whitelist: ["categories", "lastUpdated"], // Persist categories data
  blacklist: ["isLoading"], // Don't persist loading states
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  food: persistReducer(foodPersistConfig, foodReducer),
  cart: persistReducer(cartPersistConfig, cartReducer),
  kitchen: persistReducer(kitchenPersistConfig, kitchenReducer),
  reviews: reviewsReducer,
  listing: persistReducer(listingPersistConfig, listingSlice),
  foodCategories: persistReducer(foodCategoriesPersistConfig, foodCategoriesReducer),
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);

export default store;

