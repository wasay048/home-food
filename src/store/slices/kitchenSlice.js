import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getKitchenReviewStats,
  getKitchenAllReviews,
} from "../../services/foodService";

// Async thunk for fetching kitchen aggregated reviews
export const fetchKitchenStats = createAsyncThunk(
  "kitchen/fetchStats",
  async (kitchenId) => {
    try {
      const stats = await getKitchenReviewStats(kitchenId);
      return { kitchenId, stats };
    } catch (error) {
      console.error("Error fetching kitchen stats:", error);
      throw error;
    }
  }
);

// Async thunk for fetching all kitchen reviews
export const fetchKitchenReviews = createAsyncThunk(
  "kitchen/fetchReviews",
  async ({ kitchenId, limit = 10 }) => {
    try {
      const reviews = await getKitchenAllReviews(kitchenId, limit);
      return { kitchenId, reviews };
    } catch (error) {
      console.error("Error fetching kitchen reviews:", error);
      throw error;
    }
  }
);

// Async thunk for adding a kitchen review
export const addKitchenReview = createAsyncThunk(
  "kitchen/addReview",
  async ({ kitchenId, reviewData }, { getState }) => {
    const { auth } = getState();
    const userId = auth.user?.id;
    const userName = auth.user?.name || "Anonymous";

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // TODO: Implement actual review API call
    console.log("Adding kitchen review:", {
      kitchenId,
      reviewData,
      userId,
      userName,
    });

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newReview = {
      id: `review-${Date.now()}`,
      userId,
      userName,
      rating: reviewData.rating,
      comment: reviewData.comment,
      timestamp: new Date().toISOString(),
      kitchenId,
    };

    return { kitchenId, review: newReview };
  }
);

// Async thunk for updating a kitchen review
export const updateKitchenReview = createAsyncThunk(
  "kitchen/updateReview",
  async ({ kitchenId, reviewId, updates }, { getState }) => {
    const { auth } = getState();
    const userId = auth.user?.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // TODO: Implement actual review update API call
    console.log("Updating kitchen review:", {
      kitchenId,
      reviewId,
      updates,
      userId,
    });

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return { kitchenId, reviewId, updates };
  }
);

// Async thunk for deleting a kitchen review
export const deleteKitchenReview = createAsyncThunk(
  "kitchen/deleteReview",
  async ({ kitchenId, reviewId }, { getState }) => {
    const { auth } = getState();
    const userId = auth.user?.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // TODO: Implement actual review delete API call
    console.log("Deleting kitchen review:", { kitchenId, reviewId, userId });

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return { kitchenId, reviewId };
  }
);

const kitchenSlice = createSlice({
  name: "kitchen",
  initialState: {
    // Kitchen stats by kitchenId
    kitchenStats: {}, // { [kitchenId]: { averageRating, totalReviews, ratingDistribution, etc. } }

    // Kitchen reviews by kitchenId
    kitchenReviews: {}, // { [kitchenId]: [reviews] }

    // Loading states
    statsLoading: {}, // { [kitchenId]: boolean }
    reviewsLoading: {}, // { [kitchenId]: boolean }

    // Error states
    statsError: {}, // { [kitchenId]: errorMessage }
    reviewsError: {}, // { [kitchenId]: errorMessage }

    // Last updated timestamps
    statsLastUpdated: {}, // { [kitchenId]: timestamp }
    reviewsLastUpdated: {}, // { [kitchenId]: timestamp }
  },
  reducers: {
    clearKitchenData: (state, action) => {
      const kitchenId = action.payload;
      delete state.kitchenStats[kitchenId];
      delete state.kitchenReviews[kitchenId];
      delete state.statsLoading[kitchenId];
      delete state.reviewsLoading[kitchenId];
      delete state.statsError[kitchenId];
      delete state.reviewsError[kitchenId];
      delete state.statsLastUpdated[kitchenId];
      delete state.reviewsLastUpdated[kitchenId];
    },
    clearAllKitchenData: () => {
      return {
        kitchenStats: {},
        kitchenReviews: {},
        statsLoading: {},
        reviewsLoading: {},
        statsError: {},
        reviewsError: {},
        statsLastUpdated: {},
        reviewsLastUpdated: {},
      };
    },
    clearKitchenErrors: (state, action) => {
      const kitchenId = action.payload;
      delete state.statsError[kitchenId];
      delete state.reviewsError[kitchenId];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch kitchen stats
      .addCase(fetchKitchenStats.pending, (state, action) => {
        const kitchenId = action.meta.arg;
        state.statsLoading[kitchenId] = true;
        delete state.statsError[kitchenId];
      })
      .addCase(fetchKitchenStats.fulfilled, (state, action) => {
        const { kitchenId, stats } = action.payload;
        state.statsLoading[kitchenId] = false;
        state.kitchenStats[kitchenId] = stats;
        state.statsLastUpdated[kitchenId] = new Date().toISOString();
      })
      .addCase(fetchKitchenStats.rejected, (state, action) => {
        const kitchenId = action.meta.arg;
        state.statsLoading[kitchenId] = false;
        state.statsError[kitchenId] = action.error.message;
      })

      // Fetch kitchen reviews
      .addCase(fetchKitchenReviews.pending, (state, action) => {
        const { kitchenId } = action.meta.arg;
        state.reviewsLoading[kitchenId] = true;
        delete state.reviewsError[kitchenId];
      })
      .addCase(fetchKitchenReviews.fulfilled, (state, action) => {
        const { kitchenId, reviews } = action.payload;
        state.reviewsLoading[kitchenId] = false;
        state.kitchenReviews[kitchenId] = reviews;
        state.reviewsLastUpdated[kitchenId] = new Date().toISOString();
      })
      .addCase(fetchKitchenReviews.rejected, (state, action) => {
        const { kitchenId } = action.meta.arg;
        state.reviewsLoading[kitchenId] = false;
        state.reviewsError[kitchenId] = action.error.message;
      })

      // Add kitchen review
      .addCase(addKitchenReview.fulfilled, (state, action) => {
        const { kitchenId, review } = action.payload;

        if (!state.kitchenReviews[kitchenId]) {
          state.kitchenReviews[kitchenId] = [];
        }

        // Add new review to the beginning of the array
        state.kitchenReviews[kitchenId].unshift(review);

        // Update stats if they exist
        if (state.kitchenStats[kitchenId]) {
          const stats = state.kitchenStats[kitchenId];
          const oldTotal = stats.totalReviews || 0;
          const oldSum = (stats.averageRating || 0) * oldTotal;
          const newTotal = oldTotal + 1;
          const newSum = oldSum + review.rating;

          state.kitchenStats[kitchenId] = {
            ...stats,
            totalReviews: newTotal,
            averageRating: newSum / newTotal,
          };
        }
      })

      // Update kitchen review
      .addCase(updateKitchenReview.fulfilled, (state, action) => {
        const { kitchenId, reviewId, updates } = action.payload;

        if (state.kitchenReviews[kitchenId]) {
          const reviewIndex = state.kitchenReviews[kitchenId].findIndex(
            (review) => review.id === reviewId
          );

          if (reviewIndex !== -1) {
            const oldRating =
              state.kitchenReviews[kitchenId][reviewIndex].rating;
            state.kitchenReviews[kitchenId][reviewIndex] = {
              ...state.kitchenReviews[kitchenId][reviewIndex],
              ...updates,
              updatedAt: new Date().toISOString(),
            };

            // Update stats if rating changed
            if (
              updates.rating &&
              updates.rating !== oldRating &&
              state.kitchenStats[kitchenId]
            ) {
              const stats = state.kitchenStats[kitchenId];
              const total = stats.totalReviews || 0;
              const oldSum = (stats.averageRating || 0) * total;
              const newSum = oldSum - oldRating + updates.rating;

              state.kitchenStats[kitchenId] = {
                ...stats,
                averageRating: newSum / total,
              };
            }
          }
        }
      })

      // Delete kitchen review
      .addCase(deleteKitchenReview.fulfilled, (state, action) => {
        const { kitchenId, reviewId } = action.payload;

        if (state.kitchenReviews[kitchenId]) {
          const reviewIndex = state.kitchenReviews[kitchenId].findIndex(
            (review) => review.id === reviewId
          );

          if (reviewIndex !== -1) {
            const deletedRating =
              state.kitchenReviews[kitchenId][reviewIndex].rating;
            state.kitchenReviews[kitchenId].splice(reviewIndex, 1);

            // Update stats
            if (state.kitchenStats[kitchenId]) {
              const stats = state.kitchenStats[kitchenId];
              const oldTotal = stats.totalReviews || 0;

              if (oldTotal > 1) {
                const oldSum = (stats.averageRating || 0) * oldTotal;
                const newTotal = oldTotal - 1;
                const newSum = oldSum - deletedRating;

                state.kitchenStats[kitchenId] = {
                  ...stats,
                  totalReviews: newTotal,
                  averageRating: newSum / newTotal,
                };
              } else {
                // Last review deleted
                state.kitchenStats[kitchenId] = {
                  ...stats,
                  totalReviews: 0,
                  averageRating: 0,
                };
              }
            }
          }
        }
      });
  },
});

export const { clearKitchenData, clearAllKitchenData, clearKitchenErrors } =
  kitchenSlice.actions;

export default kitchenSlice.reducer;
