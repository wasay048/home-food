import { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import {
  fetchFoodDetail,
  toggleFoodLike,
  clearCurrentFood,
  checkFoodLikeStatus,
} from "../store/slices/foodSlice";
import { addToCart, updateCartItem } from "../store/slices/cartSlice"; // Changed from updateCartQuantity to updateCartItem
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

  // Local state to track like status check
  const [likeStatusChecked, setLikeStatusChecked] = useState(false);

  // Selectors
  const { user } = useSelector((state) => state.auth);

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
    // if (!isAuthenticated) {
    //   console.warn("User must be logged in to like food");
    //   return;
    // }

    if (!kitchenId) {
      console.warn("Kitchen ID is required to like food");
      return;
    }

    if (!likeStatusChecked) {
      console.warn("Like status not yet checked, preventing toggle");
      return;
    }

    console.log("🔍 Toggle like called:", {
      foodId,
      kitchenId,
      userId: user?.id,
      currentlyLiked: isLiked,
      likedFoodsArray: likedFoods,
      likeStatusChecked,
    });

    // Do NOT do optimistic update - let the thunk handle both API and state
    dispatch(toggleFoodLike(foodId));
  }, [
    dispatch,
    foodId,
    kitchenId,
    // isAuthenticated,
    isLiked,
    likedFoods,
    user?.id,
    likeStatusChecked,
  ]);

  // Generate pickup details based on order type and date
  const generatePickupDetails = useCallback(
    (selectedDate = null, selectedTime = null) => {
      const now = dayjs();

      if (!selectedDate) {
        // Go & Grab - pickup today + 30 minutes or use selected time
        const pickupTime = selectedTime
          ? selectedTime
          : now.add(30, "minutes").format("h:mm A");
        return {
          date: now.format("YYYY-MM-DD"),
          time: pickupTime,
          display: `Today at ${pickupTime}`,
          orderType: "Go&Grab",
        };
      } else {
        // Pre-order - pickup on selected date at selected time or default 6:30 PM
        const pickupDate = dayjs(selectedDate);
        const pickupTime = selectedTime || "6:30 PM";
        const isToday = pickupDate.isSame(now, "day");
        const orderType = isToday ? "Go&Grab" : "Pre-Order";

        return {
          date: pickupDate.format("YYYY-MM-DD"),
          time: pickupTime,
          display: `${pickupDate.format("MMM DD, YYYY")} at ${pickupTime}`,
          orderType: orderType,
        };
      }
    },
    []
  );

  const addToCartAction = useCallback(
    (orderData) => {
      // if (!isAuthenticated) {
      //   console.warn("User must be logged in to add to cart");
      //   return {
      //     success: false,
      //     message: "User must be logged in to add to cart",
      //     requiresAuth: true, // Add this flag for WeChat dialog
      //   };
      // }

      // Find exact matching cart item (same food, date, and special instructions)
      const exactCartItem = findExactCartItem(orderData);

      // Check if exact same item exists and if quantity is the same
      if (exactCartItem) {
        console.log(
          "Item already exists, updating quantity:",
          exactCartItem.quantity,
          "to",
          orderData.quantity
        );

        // Update the existing item's quantity
        dispatch(
          updateCartItem({
            cartItemId: exactCartItem.id,
            quantity: orderData.quantity,
            specialInstructions: orderData.specialInstructions,
          })
        );

        return {
          success: true,
          message: "Cart item quantity updated successfully",
          existingQuantity: exactCartItem.quantity,
          newQuantity: orderData.quantity,
        };
      }

      // Generate pickup details based on the selected date and time
      const pickupDetails = generatePickupDetails(
        orderData.selectedDate,
        orderData.selectedTime
      );

      const cartItem = {
        foodId,
        kitchenId,
        quantity: orderData.quantity,
        orderType: orderData.orderType,
        selectedDate: orderData.selectedDate,
        selectedTime: orderData.selectedTime,
        specialInstructions: orderData.specialInstructions || "",
        // Add pickup details for proper cart organization
        pickupDetails,
        // Determine if this is a pre-order
        isPreOrder:
          orderData.selectedDate &&
          !dayjs(orderData.selectedDate).isSame(dayjs(), "day"),
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
      // isAuthenticated,
      findExactCartItem,
      food,
      kitchen,
      generatePickupDetails,
    ]
  );

  const updateCartItemQuantity = useCallback(
    (newQuantity) => {
      // if (!isAuthenticated) {
      //   console.warn("User must be logged in to update cart");
      //   return;
      // }

      const cartItem = cartItems.find(
        (item) => item.foodId === foodId && item.kitchenId === kitchenId
      );

      if (cartItem) {
        console.log("Updating cart item quantity:", {
          cartItemId: cartItem.id,
          quantity: newQuantity,
        });

        // Use updateCartItem instead of updateCartQuantity
        dispatch(
          updateCartItem({
            cartItemId: cartItem.id,
            quantity: newQuantity,
          })
        );
      }
    },
    [dispatch, foodId, kitchenId, cartItems]
  );

  const addReview = useCallback(
    (reviewData) => {
      // if (!isAuthenticated) {
      //   console.warn("User must be logged in to add review");
      //   return;
      // }

      return dispatch(
        addFoodReview({
          foodId,
          kitchenId,
          reviewData,
        })
      );
    },
    [dispatch, foodId, kitchenId]
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

  // Check like status when food loads and user is authenticated
  useEffect(() => {
    if (foodId && kitchenId && food) {
      console.log("🔍 Checking like status for food:", {
        foodId,
        kitchenId,
        userId: user?.id,
      });
      dispatch(checkFoodLikeStatus({ foodId, kitchenId })).then((result) => {
        console.log("✅ Like status checked:", result);
        setLikeStatusChecked(true);
      });
    }
    //  else if (!isAuthenticated) {
    //   // If not authenticated, we know the status (not liked)
    //   console.log("🔍 Not authenticated, setting like status as checked");
    //   setLikeStatusChecked(true);
    // }
  }, [dispatch, foodId, kitchenId, food, user?.id]);

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
    // isAuthenticated,

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
