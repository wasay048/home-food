import { createAsyncThunk } from "@reduxjs/toolkit";
import { persistor } from "../index";
import { clearAllData } from "../slices/authSlice";
import { clearCart } from "../slices/cartSlice";

// Comprehensive logout action that clears all persisted data
export const performCompleteLogout = createAsyncThunk(
  "app/performCompleteLogout",
  async (_, { dispatch }) => {
    try {
      console.log("🚪 Starting complete logout process...");

      // 1. Clear Redux state
      dispatch(clearAllData());
      dispatch(clearCart());

      // 2. Clear all persisted data
      await persistor.purge();

      // 3. Clear localStorage (in case there's any manual storage)
      localStorage.removeItem("persist:root");
      localStorage.removeItem("persist:auth");
      localStorage.removeItem("persist:cart");

      // 4. Clear sessionStorage
      sessionStorage.clear();

      console.log("✅ Complete logout successful");

      return { success: true };
    } catch (error) {
      console.error("❌ Logout error:", error);
      throw error;
    }
  }
);

export default performCompleteLogout;
