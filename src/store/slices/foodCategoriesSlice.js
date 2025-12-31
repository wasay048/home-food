import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [], // Array of { id, name } objects
  isLoading: false,
  lastUpdated: null,
};

const foodCategoriesSlice = createSlice({
  name: "foodCategories",
  initialState,
  reducers: {
    setFoodCategoriesLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setFoodCategories: (state, action) => {
      state.categories = action.payload;
      state.isLoading = false;
      state.lastUpdated = Date.now();
    },
    clearFoodCategories: () => {
      return initialState;
    },
  },
});

export const {
  setFoodCategoriesLoading,
  setFoodCategories,
  clearFoodCategories,
} = foodCategoriesSlice.actions;

export default foodCategoriesSlice.reducer;
