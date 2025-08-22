import { useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import {
  fetchFoodDetail,
  toggleFoodLike,
  toggleLikeLocally,
  clearCurrentFood,
} from "../store/slices/foodSlice";
import { addToCart, updateCartQuantity } from "../store/slices/cartSlice";
import { fetchFoodReviews, addFoodReview } from "../store/slices/reviewsSlice";
import {
  fetchKitchenStats,
  fetchKitchenReviews,
} from "../store/slices/kitchenSlice";

/**
 * Custom hook to manage food detail page data and actions using Redux
 */
export const useFoodDetailRedux = (foodId, kitchenId) => {
  const dispatch = useDispatch();

  // Selectors
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const {
    currentFood: food,
    currentKitchen: kitchen,
    currentReviews: reviews,
    currentReviewStats: reviewStats,
    currentLikes: likes,
    loading: foodLoading,
    error: foodError,
    likedFoods,
  } = useSelector((state) => state.food);

  const {
    kitchenStats,
    kitchenReviews,
    statsLoading: kitchenStatsLoading,
    reviewsLoading: kitchenReviewsLoading,
  } = useSelector((state) => state.kitchen);

  const {
    foodReviews,
    foodReviewsLoading,
    submissionLoading: reviewSubmissionLoading,
  } = useSelector((state) => state.reviews);

  const { items: cartItems, loading: cartLoading } = useSelector(
    (state) => state.cart
  );

  // Get specific data for current food/kitchen
  const currentKitchenStats = kitchenStats[kitchenId];
  const currentKitchenReviews = kitchenReviews[kitchenId];
  const currentFoodReviews = foodReviews[foodId];
  const isFoodReviewsLoading = foodReviewsLoading[foodId];
  const isCurrentKitchenStatsLoading = kitchenStatsLoading[kitchenId];
  const isCurrentKitchenReviewsLoading = kitchenReviewsLoading[kitchenId];

  // Check if food is liked by current user
  const isLiked = likedFoods.includes(foodId);

  // Get cart quantity for current food (total across all variants)
  const cartQuantity = cartItems
    .filter((item) => item.foodId === foodId && item.kitchenId === kitchenId)
    .reduce((total, item) => total + item.quantity, 0);

  // Helper function to find exact cart item match
  const findExactCartItem = useCallback(
    (orderData) => {
      return cartItems.find(
        (item) =>
          item.foodId === foodId &&
          item.kitchenId === kitchenId &&
          item.selectedDate === orderData.selectedDate &&
          item.specialInstructions === (orderData.specialInstructions || "")
      );
    },
    [cartItems, foodId, kitchenId]
  );

  // Actions
  const loadFoodDetail = useCallback(() => {
    if (foodId && kitchenId) {
      dispatch(fetchFoodDetail({ foodId, kitchenId }));
    }
  }, [dispatch, foodId, kitchenId]);

  const loadKitchenStats = useCallback(() => {
    if (kitchenId && !currentKitchenStats && !isCurrentKitchenStatsLoading) {
      dispatch(fetchKitchenStats(kitchenId));
    }
  }, [dispatch, kitchenId, currentKitchenStats, isCurrentKitchenStatsLoading]);

  const loadKitchenReviews = useCallback(() => {
    if (
      kitchenId &&
      !currentKitchenReviews &&
      !isCurrentKitchenReviewsLoading
    ) {
      dispatch(fetchKitchenReviews({ kitchenId, limit: 10 }));
    }
  }, [
    dispatch,
    kitchenId,
    currentKitchenReviews,
    isCurrentKitchenReviewsLoading,
  ]);

  const loadFoodReviews = useCallback(() => {
    if (foodId && !currentFoodReviews && !isFoodReviewsLoading) {
      dispatch(fetchFoodReviews({ foodId, kitchenId, limit: 10 }));
    }
  }, [dispatch, foodId, kitchenId, currentFoodReviews, isFoodReviewsLoading]);

  const toggleLike = useCallback(() => {
    if (!isAuthenticated) {
      console.warn("User must be logged in to like food");
      return;
    }

    // Optimistic update
    dispatch(toggleLikeLocally(foodId));

    // API call
    dispatch(toggleFoodLike(foodId));
  }, [dispatch, foodId, isAuthenticated]);

  // Generate pickup details based on order type and date
  const generatePickupDetails = useCallback((selectedDate = null) => {
    const now = dayjs();

    if (!selectedDate) {
      // Go & Grab - pickup today + 30 minutes
      const pickupTime = now.add(30, "minutes");
      return {
        pickupDate: now.format("YYYY-MM-DD"),
        pickupTime: pickupTime.format("h:mm A"),
        displayPickupTime: "Pick up today",
        displayPickupClock: pickupTime.format("h:mm A"),
        orderType: "grab-and-go",
      };
    } else {
      // Pre-order - pickup on selected date at 6:30 PM
      const pickupDate = dayjs(selectedDate);
      const isToday = pickupDate.isSame(now, "day");
      const isTomorrow = pickupDate.isSame(now.add(1, "day"), "day");

      let displayText;
      if (isToday) {
        displayText = "Pick up today";
      } else if (isTomorrow) {
        displayText = "Pick up tomorrow";
      } else {
        displayText = `Pick up ${pickupDate.format("MMM D ddd")}`;
      }

      return {
        pickupDate: pickupDate.format("YYYY-MM-DD"),
        pickupTime: "6:30 PM",
        displayPickupTime: displayText,
        displayPickupClock: "6:30 PM",
        orderType: "pre-order",
      };
    }
  }, []);

  const addToCartAction = useCallback(
    (orderData) => {
      if (!isAuthenticated) {
        console.warn("User must be logged in to add to cart");
        return {
          success: false,
          message: "User must be logged in to add to cart",
        };
      }

      // Find exact matching cart item (same food, date, and special instructions)
      const exactCartItem = findExactCartItem(orderData);

      // Check if exact same item exists and if quantity is the same
      if (exactCartItem) {
        console.log(
          "Item already exists with same quantity:",
          exactCartItem.quantity
        );
        dispatch(
          updateCartQuantity({
            cartItemId: exactCartItem.id,
            quantity: orderData.quantity,
          })
        );
        return {
          success: false,
          message:
            "This item already exists in the cart with the same quantity and specifications",
          existingQuantity: exactCartItem.quantity,
        };
      }

      // Generate pickup details based on the selected date
      const pickupDetails = generatePickupDetails(orderData.selectedDate);

      const cartItem = {
        foodId,
        kitchenId,
        quantity: orderData.quantity,
        orderType: orderData.orderType,
        selectedDate: orderData.selectedDate,
        specialInstructions: orderData.specialInstructions || "",
        // Add pickup details for proper cart organization
        pickupDetails,
        // Include complete food object with all fields
        food: food
          ? {
              id: food.id,
              name: food.name,
              cost: food.cost,
              price: food.price || food.cost,
              imageUrl: food.imageUrl,
              image: food.image || food.imageUrl,
              description: food.description,
              category: food.category,
              isAvailable: food.isAvailable,
              kitchenName: food.kitchenName,
              maxQuantity: food.maxQuantity,
              totalQuantity: food.totalQuantity,
              availableQuantity: food.availableQuantity,
              isPreOrder: food.isPreOrder,
              // Include any other fields that might be present
              ...food,
            }
          : null,
        // Include complete kitchen object with all fields
        kitchen: kitchen
          ? {
              id: kitchen.id,
              name: kitchen.name,
              address: kitchen.address,
              rating: kitchen.rating,
              ratingCount: kitchen.ratingCount,
              // Include any other fields that might be present
              ...kitchen,
            }
          : null,
      };

      // Add new item to cart
      console.log("Adding new item to cart:", cartItem);
      dispatch(addToCart(cartItem));

      return {
        success: true,
        message: "Item added to cart successfully",
      };
    },
    [
      dispatch,
      foodId,
      kitchenId,
      isAuthenticated,
      findExactCartItem,
      updateCartQuantity,
      food,
      kitchen,
      generatePickupDetails,
    ]
  );

  const updateCartItemQuantity = useCallback(
    (newQuantity) => {
      if (!isAuthenticated) {
        console.warn("User must be logged in to update cart");
        return;
      }

      const cartItem = cartItems.find(
        (item) => item.foodId === foodId && item.kitchenId === kitchenId
      );

      if (cartItem) {
        console.log("Updating cart item quantity:", {
          cartItemId: cartItem.id,
          quantity: newQuantity,
        });
        dispatch(
          updateCartQuantity({ cartItemId: cartItem.id, quantity: newQuantity })
        );
      }
    },
    [dispatch, foodId, kitchenId, isAuthenticated, cartItems]
  );

  const addReview = useCallback(
    (reviewData) => {
      if (!isAuthenticated) {
        console.warn("User must be logged in to add review");
        return;
      }

      return dispatch(
        addFoodReview({
          foodId,
          kitchenId,
          reviewData,
        })
      );
    },
    [dispatch, foodId, kitchenId, isAuthenticated]
  );

  const clearData = useCallback(() => {
    dispatch(clearCurrentFood());
  }, [dispatch]);

  // Effects
  useEffect(() => {
    loadFoodDetail();
    loadKitchenStats();
    loadFoodReviews();

    // Cleanup on unmount
    return () => {
      // Optional: Clear data when component unmounts
      // clearData();
    };
  }, [loadFoodDetail, loadKitchenStats, loadFoodReviews]);

  // Computed values
  const loading = foodLoading || isCurrentKitchenStatsLoading;
  const error = foodError;

  // Use Redux review stats or fallback to kitchen stats
  const displayReviewStats = reviewStats || currentKitchenStats;

  return {
    // Data
    food,
    kitchen,
    reviews: reviews || [],
    reviewStats: displayReviewStats,
    kitchenStats: currentKitchenStats,
    likes,
    isLiked,
    cartQuantity,

    // Loading states
    loading,
    reviewsLoading: isFoodReviewsLoading,
    kitchenStatsLoading: isCurrentKitchenStatsLoading,
    kitchenReviewsLoading: isCurrentKitchenReviewsLoading,
    reviewSubmissionLoading,
    cartLoading,

    // Errors
    error,

    // User state
    user,
    isAuthenticated,

    // Actions
    toggleLike,
    addToCartAction,
    updateCartItemQuantity,
    addReview,
    loadFoodDetail,
    loadKitchenStats,
    loadKitchenReviews,
    loadFoodReviews,
    clearData,
  };
};
