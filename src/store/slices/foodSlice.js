import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getFoodDetailWithKitchenAndReviews,
  getFoodById,
  getAllFoods,
} from "../../services/foodService";
import { addLike, removeLike, checkUserLike } from "../../services/likeService";
import { serializeFirestoreData } from "../../utils/firestoreSerializer";

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

// Async thunk for checking if user has liked a food
export const checkFoodLikeStatus = createAsyncThunk(
  "food/checkLikeStatus",
  async ({ foodId, kitchenId }, { getState }) => {
    const { auth } = getState();
    const userId = auth.user?.id;

    console.log("🔍 Checking like status:", { foodId, kitchenId, userId });

    if (!userId || !kitchenId) {
      console.log("❌ Missing userId or kitchenId for like status check");
      return { foodId, liked: false };
    }

    try {
      const isLiked = await checkUserLike(kitchenId, foodId, userId);
      console.log("✅ Like status check result:", { foodId, isLiked });
      return { foodId, liked: isLiked };
    } catch (error) {
      console.error("❌ Error checking like status:", error);
      return { foodId, liked: false };
    }
  }
);

// Async thunk for toggling food like
export const toggleFoodLike = createAsyncThunk(
  "food/toggleLike",
  async (foodId, { getState }) => {
    const { auth, food } = getState();
    const userId = auth.user?.id;
    const kitchenId = food.currentKitchen?.id;

    console.log("🔄 Toggle like action:", {
      foodId,
      userId,
      kitchenId,
      currentLikedFoods: food.likedFoods,
    });

    if (!userId) {
      throw new Error("User not authenticated");
    }

    if (!kitchenId) {
      throw new Error("Kitchen information not available");
    }

    const isCurrentlyLiked = food.likedFoods.includes(foodId);
    console.log("🔍 Current like state from Redux:", {
      foodId,
      isCurrentlyLiked,
    });

    // Check actual Firestore state to avoid optimistic update conflicts
    console.log("🔍 Checking actual Firestore like state before toggle");
    const actualFirestoreState = await checkUserLike(kitchenId, foodId, userId);
    console.log("🔍 Actual Firestore like state:", {
      foodId,
      actualFirestoreState,
    });

    try {
      if (actualFirestoreState) {
        // Remove like from Firestore
        console.log("🔥 Attempting to remove like from Firestore");
        await removeLike(kitchenId, foodId, userId);
        console.log("✅ Like removed from Firestore");
      } else {
        // Add like to Firestore
        console.log("🔥 Attempting to add like to Firestore");
        await addLike(kitchenId, foodId, userId);
        console.log("✅ Like added to Firestore");
      }

      return {
        foodId,
        userId,
        kitchenId,
        liked: !actualFirestoreState,
      };
    } catch (error) {
      console.error("❌ Error toggling like in Firestore:", error);
      throw error;
    }
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

      console.log("🔄 toggleLikeLocally called:", {
        foodId,
        currentlyLiked: isLiked,
        likedFoods: state.likedFoods,
      });

      if (isLiked) {
        state.likedFoods = state.likedFoods.filter((id) => id !== foodId);
        console.log("➖ Locally removed like for:", foodId);
      } else {
        state.likedFoods.push(foodId);
        console.log("➕ Locally added like for:", foodId);
      }

      console.log("🔍 Updated likedFoods locally:", state.likedFoods);
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

        // Serialize Firestore data to prevent Redux non-serializable warnings
        state.currentFood = serializeFirestoreData(food);
        state.currentKitchen = serializeFirestoreData(kitchen);
        state.currentReviews = reviews
          ? reviews.map((review) => serializeFirestoreData(review))
          : [];
        state.currentReviewStats = serializeFirestoreData(reviewStats);
        state.currentLikes = likes
          ? likes.map((like) => serializeFirestoreData(like))
          : [];
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
      })

      // Check like status
      .addCase(checkFoodLikeStatus.fulfilled, (state, action) => {
        const { foodId, liked } = action.payload;

        console.log("✅ Like status check fulfilled:", {
          foodId,
          liked,
          currentLikedFoods: state.likedFoods,
        });

        if (liked && !state.likedFoods.includes(foodId)) {
          state.likedFoods.push(foodId);
          console.log("➕ Added foodId to likedFoods:", foodId);
        } else if (!liked) {
          state.likedFoods = state.likedFoods.filter((id) => id !== foodId);
          console.log("➖ Removed foodId from likedFoods:", foodId);
        }

        console.log("🔍 Updated likedFoods:", state.likedFoods);
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
