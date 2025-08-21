import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getFoodDetailWithKitchenAndReviews,
  getFoodById,
  getAllFoods,
} from "../../services/foodService";

// Async thunk for fetching food details with all related data
export const fetchFoodDetail = createAsyncThunk(
  "food/fetchDetail",
  async ({ foodId, kitchenId }) => {
    try {
      // Use the existing optimized function
      const result = await getFoodDetailWithKitchenAndReviews(
        foodId,
        kitchenId
      );
      return {
        ...result,
        foodId,
        kitchenId,
      };
    } catch (error) {
      // Fallback to basic food fetch
      const food = await getFoodById(foodId);
      return {
        food,
        kitchen: null,
        likes: [],
        reviews: [],
        reviewStats: null,
        foodId,
        kitchenId,
      };
    }
  }
);

// Async thunk for fetching all foods
export const fetchAllFoods = createAsyncThunk(
  "food/fetchAll",
  async (limitCount = 20) => {
    const foods = await getAllFoods(limitCount);
    return foods;
  }
);

// Async thunk for toggling food like
export const toggleFoodLike = createAsyncThunk(
  "food/toggleLike",
  async (foodId, { getState }) => {
    const { auth, food } = getState();
    const userId = auth.user?.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const isCurrentlyLiked = food.likedFoods.includes(foodId);

    // TODO: Implement actual like API call
    console.log(`${isCurrentlyLiked ? "Unliking" : "Liking"} food:`, {
      foodId,
      userId,
    });

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return { foodId, userId, liked: !isCurrentlyLiked };
  }
);

// Async thunk for refreshing food data
export const refreshFoodData = createAsyncThunk(
  "food/refresh",
  async ({ foodId, kitchenId }, { dispatch }) => {
    // Re-fetch food detail
    return dispatch(fetchFoodDetail({ foodId, kitchenId }));
  }
);

const foodSlice = createSlice({
  name: "food",
  initialState: {
    // Current food being viewed
    currentFood: null,
    currentKitchen: null,
    currentReviews: [],
    currentReviewStats: null,
    currentLikes: [],

    // All foods list
    allFoods: [],

    // User's liked foods
    likedFoods: [], // Array of foodIds liked by current user

    // Loading states
    loading: false,
    allFoodsLoading: false,

    // Error states
    error: null,
    allFoodsError: null,

    // Last updated timestamps
    lastUpdated: null,
    allFoodsLastUpdated: null,
  },
  reducers: {
    clearCurrentFood: (state) => {
      state.currentFood = null;
      state.currentKitchen = null;
      state.currentReviews = [];
      state.currentReviewStats = null;
      state.currentLikes = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearAllFoodsError: (state) => {
      state.allFoodsError = null;
    },
    updateFoodInList: (state, action) => {
      const { foodId, updates } = action.payload;
      const foodIndex = state.allFoods.findIndex((food) => food.id === foodId);
      if (foodIndex !== -1) {
        state.allFoods[foodIndex] = {
          ...state.allFoods[foodIndex],
          ...updates,
        };
      }

      // Also update current food if it matches
      if (state.currentFood?.id === foodId) {
        state.currentFood = { ...state.currentFood, ...updates };
      }
    },
    // Local like toggle for immediate UI feedback
    toggleLikeLocally: (state, action) => {
      const foodId = action.payload;
      const isLiked = state.likedFoods.includes(foodId);

      if (isLiked) {
        state.likedFoods = state.likedFoods.filter((id) => id !== foodId);
      } else {
        state.likedFoods.push(foodId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch food detail
      .addCase(fetchFoodDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFoodDetail.fulfilled, (state, action) => {
        state.loading = false;
        const { food, kitchen, likes, reviews, reviewStats } = action.payload;

        state.currentFood = food;
        state.currentKitchen = kitchen;
        state.currentReviews = reviews || [];
        state.currentReviewStats = reviewStats;
        state.currentLikes = likes || [];
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchFoodDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch all foods
      .addCase(fetchAllFoods.pending, (state) => {
        state.allFoodsLoading = true;
        state.allFoodsError = null;
      })
      .addCase(fetchAllFoods.fulfilled, (state, action) => {
        state.allFoodsLoading = false;
        state.allFoods = action.payload;
        state.allFoodsLastUpdated = new Date().toISOString();
      })
      .addCase(fetchAllFoods.rejected, (state, action) => {
        state.allFoodsLoading = false;
        state.allFoodsError = action.error.message;
      })

      // Toggle like
      .addCase(toggleFoodLike.fulfilled, (state, action) => {
        const { foodId, liked } = action.payload;

        if (liked && !state.likedFoods.includes(foodId)) {
          state.likedFoods.push(foodId);
        } else if (!liked) {
          state.likedFoods = state.likedFoods.filter((id) => id !== foodId);
        }
      })
      .addCase(toggleFoodLike.rejected, (state, action) => {
        // Revert local like state on API failure
        const foodId = action.meta.arg;
        const isLiked = state.likedFoods.includes(foodId);

        if (isLiked) {
          state.likedFoods = state.likedFoods.filter((id) => id !== foodId);
        } else {
          state.likedFoods.push(foodId);
        }
      });
  },
});

export const {
  clearCurrentFood,
  clearError,
  clearAllFoodsError,
  updateFoodInList,
  toggleLikeLocally,
} = foodSlice.actions;

export default foodSlice.reducer;
