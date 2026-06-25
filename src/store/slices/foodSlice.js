import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getFoodById,
  getKitchenById,
  getFoodReviews,
  calculateReviewStats,
  getAllFoods,
} from "../../services/foodService";
import { addLike, removeLike, checkUserLike } from "../../services/likeService";
import { serializeFirestoreData } from "../../utils/firestoreSerializer";

// Async thunk for the LOAD-TIME CRITICAL PATH. The food-detail spinner is
// gated on this thunk, so it now fetches ONLY what the above-the-fold UI needs:
// the food doc + the kitchen doc. Reviews load separately and non-blocking via
// fetchFoodReviewsOnly; likes are no longer fetched here because they are never
// rendered on this page (the heart count comes from food.numOfLike, and the
// filled/empty state comes from checkFoodLikeStatus). When kitchenId is known
// up front (always true on the detail page) we fetch food + kitchen in parallel
// since getKitchenById does not depend on the food doc — collapsing the
// previous 3–5 serial Firestore round trips down to ~1.
export const fetchFoodDetail = createAsyncThunk(
  "food/fetchDetail",
  async ({ foodId, kitchenId }) => {
    try {
      let food;
      let kitchen;
      if (kitchenId) {
        [food, kitchen] = await Promise.all([
          getFoodById(foodId, kitchenId),
          getKitchenById(kitchenId),
        ]);
      } else {
        // No kitchenId provided → must read the food doc first to learn it.
        food = await getFoodById(foodId);
        const targetKitchenId = food?.kitchenId;
        kitchen = targetKitchenId ? await getKitchenById(targetKitchenId) : null;
      }
      return {
        food,
        kitchen,
        likes: [],
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
        foodId,
        kitchenId,
      };
    }
  }
);

// Async thunk for loading reviews OFF the critical path. It writes the same
// currentReviews / currentReviewStats fields the page already renders, but
// WITHOUT touching `loading`, so the spinner is gated only on food + kitchen.
// Uses the real getFoodReviews service (NOT the mock reviewsSlice stub).
export const fetchFoodReviewsOnly = createAsyncThunk(
  "food/fetchReviewsOnly",
  async ({ foodId, kitchenId }) => {
    const reviews = await getFoodReviews(foodId, kitchenId);
    const reviewStats = calculateReviewStats(reviews);
    return { reviews, reviewStats };
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
    // alert("auth Obj:" + JSON.stringify(auth));
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
    // Allows non-FoodDetailPage flows (e.g. ListingPage direct landing) to seed
    // currentKitchen so downstream pages like PaymentPage have what they need.
    setCurrentKitchen: (state, action) => {
      state.currentKitchen = action.payload
        ? serializeFirestoreData(action.payload)
        : null;
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
        const { food, kitchen, likes } = action.payload;

        // Serialize Firestore data to prevent Redux non-serializable warnings
        state.currentFood = serializeFirestoreData(food);
        state.currentKitchen = serializeFirestoreData(kitchen);
        state.currentLikes = likes
          ? likes.map((like) => serializeFirestoreData(like))
          : [];
        state.lastUpdated = new Date().toISOString();
        // NOTE: currentReviews / currentReviewStats are intentionally NOT set
        // here. They are owned by fetchFoodReviewsOnly (non-blocking) so that a
        // reviews response landing before this one is never overwritten with
        // empty values. clearCurrentFood resets them on food/kitchen change.
      })
      .addCase(fetchFoodDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Reviews loaded off the critical path — does NOT affect the load spinner
      .addCase(fetchFoodReviewsOnly.fulfilled, (state, action) => {
        const { reviews, reviewStats } = action.payload;
        state.currentReviews = reviews
          ? reviews.map((review) => serializeFirestoreData(review))
          : [];
        state.currentReviewStats = serializeFirestoreData(reviewStats);
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
  setCurrentKitchen,
} = foodSlice.actions;

export default foodSlice.reducer;
