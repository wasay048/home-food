import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// TODO: Import actual review service functions when implemented
// import { getFoodReviews, addFoodReview, updateFoodReview, deleteFoodReview } from '../../services/reviewService';

// Async thunk for fetching food reviews
export const fetchFoodReviews = createAsyncThunk(
  "reviews/fetchFoodReviews",
  async ({ foodId, kitchenId, limit = 10 }) => {
    try {
      // TODO: Implement actual API call
      console.log("Fetching food reviews:", { foodId, kitchenId, limit });

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Mock data for development
      const mockReviews = [
        {
          id: `review-1-${foodId}`,
          userId: "user-001",
          userName: "Alice Chen",
          rating: 5,
          comment: "Absolutely delicious! Perfect taste and portion size.",
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          foodId,
          kitchenId,
          verified: true,
        },
        {
          id: `review-2-${foodId}`,
          userId: "user-002",
          userName: "Bob Wilson",
          rating: 4,
          comment: "Great food, fast delivery. Will order again!",
          timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          foodId,
          kitchenId,
          verified: true,
        },
        {
          id: `review-3-${foodId}`,
          userId: "user-003",
          userName: "Carol Davis",
          rating: 5,
          comment:
            "Outstanding quality! Fresh ingredients and amazing flavors.",
          timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          foodId,
          kitchenId,
          verified: true,
        },
      ].slice(0, limit);

      return { foodId, kitchenId, reviews: mockReviews };
    } catch (error) {
      console.error("Error fetching food reviews:", error);
      throw error;
    }
  }
);

// Async thunk for adding a food review
export const addFoodReview = createAsyncThunk(
  "reviews/addFoodReview",
  async ({ foodId, kitchenId, reviewData }, { getState }) => {
    const { auth } = getState();
    const userId = auth.user?.id;
    const userName = auth.user?.name || "Anonymous";

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // TODO: Implement actual review API call
    console.log("Adding food review:", {
      foodId,
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
      foodId,
      kitchenId,
      verified: true,
    };

    return { foodId, kitchenId, review: newReview };
  }
);

// Async thunk for updating a food review
export const updateFoodReview = createAsyncThunk(
  "reviews/updateFoodReview",
  async ({ foodId, kitchenId, reviewId, updates }, { getState }) => {
    const { auth } = getState();
    const userId = auth.user?.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // TODO: Implement actual review update API call
    console.log("Updating food review:", {
      foodId,
      kitchenId,
      reviewId,
      updates,
      userId,
    });

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return { foodId, kitchenId, reviewId, updates };
  }
);

// Async thunk for deleting a food review
export const deleteFoodReview = createAsyncThunk(
  "reviews/deleteFoodReview",
  async ({ foodId, kitchenId, reviewId }, { getState }) => {
    const { auth } = getState();
    const userId = auth.user?.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // TODO: Implement actual review delete API call
    console.log("Deleting food review:", {
      foodId,
      kitchenId,
      reviewId,
      userId,
    });

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return { foodId, kitchenId, reviewId };
  }
);

// Async thunk for fetching user's own reviews
export const fetchUserReviews = createAsyncThunk(
  "reviews/fetchUserReviews",
  async ({ limit = 20 }, { getState }) => {
    const { auth } = getState();
    const userId = auth.user?.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // TODO: Implement actual API call
    console.log("Fetching user reviews:", { userId, limit });

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Mock user reviews for development
    const mockUserReviews = [
      {
        id: "user-review-1",
        userId,
        userName: auth.user.name,
        rating: 5,
        comment: "Loved this dish! Perfect for dinner.",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        foodId: "food-001",
        foodName: "Kung Pao Chicken",
        kitchenId: "kitchen-001",
        kitchenName: "Mary's Kitchen",
        verified: true,
      },
      {
        id: "user-review-2",
        userId,
        userName: auth.user.name,
        rating: 4,
        comment: "Good value for money. Quick delivery.",
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        foodId: "food-002",
        foodName: "Beef Noodle Soup",
        kitchenId: "kitchen-002",
        kitchenName: "Tom's Noodles",
        verified: true,
      },
    ];

    return mockUserReviews;
  }
);

const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    // Food reviews by foodId
    foodReviews: {}, // { [foodId]: [reviews] }

    // User's own reviews
    userReviews: [],

    // Loading states
    foodReviewsLoading: {}, // { [foodId]: boolean }
    userReviewsLoading: false,

    // Error states
    foodReviewsError: {}, // { [foodId]: errorMessage }
    userReviewsError: null,

    // Last updated timestamps
    foodReviewsLastUpdated: {}, // { [foodId]: timestamp }
    userReviewsLastUpdated: null,

    // Review submission state
    submissionLoading: false,
    submissionError: null,
  },
  reducers: {
    clearFoodReviews: (state, action) => {
      const foodId = action.payload;
      delete state.foodReviews[foodId];
      delete state.foodReviewsLoading[foodId];
      delete state.foodReviewsError[foodId];
      delete state.foodReviewsLastUpdated[foodId];
    },
    clearAllReviews: (state) => {
      state.foodReviews = {};
      state.userReviews = [];
      state.foodReviewsLoading = {};
      state.userReviewsLoading = false;
      state.foodReviewsError = {};
      state.userReviewsError = null;
      state.foodReviewsLastUpdated = {};
      state.userReviewsLastUpdated = null;
    },
    clearReviewErrors: (state, action) => {
      if (action.payload) {
        const foodId = action.payload;
        delete state.foodReviewsError[foodId];
      } else {
        state.foodReviewsError = {};
        state.userReviewsError = null;
        state.submissionError = null;
      }
    },
    clearSubmissionError: (state) => {
      state.submissionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch food reviews
      .addCase(fetchFoodReviews.pending, (state, action) => {
        const { foodId } = action.meta.arg;
        state.foodReviewsLoading[foodId] = true;
        delete state.foodReviewsError[foodId];
      })
      .addCase(fetchFoodReviews.fulfilled, (state, action) => {
        const { foodId, reviews } = action.payload;
        state.foodReviewsLoading[foodId] = false;
        state.foodReviews[foodId] = reviews;
        state.foodReviewsLastUpdated[foodId] = new Date().toISOString();
      })
      .addCase(fetchFoodReviews.rejected, (state, action) => {
        const { foodId } = action.meta.arg;
        state.foodReviewsLoading[foodId] = false;
        state.foodReviewsError[foodId] = action.error.message;
      })

      // Add food review
      .addCase(addFoodReview.pending, (state) => {
        state.submissionLoading = true;
        state.submissionError = null;
      })
      .addCase(addFoodReview.fulfilled, (state, action) => {
        state.submissionLoading = false;
        const { foodId, review } = action.payload;

        if (!state.foodReviews[foodId]) {
          state.foodReviews[foodId] = [];
        }

        // Add new review to the beginning of the array
        state.foodReviews[foodId].unshift(review);

        // Also add to user reviews
        state.userReviews.unshift({
          ...review,
          foodName: "Unknown Food", // Will be updated when we have food data
          kitchenName: "Unknown Kitchen", // Will be updated when we have kitchen data
        });
      })
      .addCase(addFoodReview.rejected, (state, action) => {
        state.submissionLoading = false;
        state.submissionError = action.error.message;
      })

      // Update food review
      .addCase(updateFoodReview.fulfilled, (state, action) => {
        const { foodId, reviewId, updates } = action.payload;

        // Update in food reviews
        if (state.foodReviews[foodId]) {
          const reviewIndex = state.foodReviews[foodId].findIndex(
            (review) => review.id === reviewId
          );

          if (reviewIndex !== -1) {
            state.foodReviews[foodId][reviewIndex] = {
              ...state.foodReviews[foodId][reviewIndex],
              ...updates,
              updatedAt: new Date().toISOString(),
            };
          }
        }

        // Update in user reviews
        const userReviewIndex = state.userReviews.findIndex(
          (review) => review.id === reviewId
        );

        if (userReviewIndex !== -1) {
          state.userReviews[userReviewIndex] = {
            ...state.userReviews[userReviewIndex],
            ...updates,
            updatedAt: new Date().toISOString(),
          };
        }
      })

      // Delete food review
      .addCase(deleteFoodReview.fulfilled, (state, action) => {
        const { foodId, reviewId } = action.payload;

        // Remove from food reviews
        if (state.foodReviews[foodId]) {
          state.foodReviews[foodId] = state.foodReviews[foodId].filter(
            (review) => review.id !== reviewId
          );
        }

        // Remove from user reviews
        state.userReviews = state.userReviews.filter(
          (review) => review.id !== reviewId
        );
      })

      // Fetch user reviews
      .addCase(fetchUserReviews.pending, (state) => {
        state.userReviewsLoading = true;
        state.userReviewsError = null;
      })
      .addCase(fetchUserReviews.fulfilled, (state, action) => {
        state.userReviewsLoading = false;
        state.userReviews = action.payload;
        state.userReviewsLastUpdated = new Date().toISOString();
      })
      .addCase(fetchUserReviews.rejected, (state, action) => {
        state.userReviewsLoading = false;
        state.userReviewsError = action.error.message;
      });
  },
});

export const {
  clearFoodReviews,
  clearAllReviews,
  clearReviewErrors,
  clearSubmissionError,
} = reviewsSlice.actions;

export default reviewsSlice.reducer;
