import { useState, useEffect } from "react";
import {
  getFoodById,
  getKitchenById,
  getFoodLikes,
  getFoodReviews,
  getFoodDetailWithKitchenAndReviews,
  calculateReviewStats,
  getAllFoods,
} from "../services/foodService";

/**
 * Helper function to format numbers into readable format (1K, 1M, 1B)
 */
function formatCount(count) {
  if (!count || count < 1000) {
    return count?.toString() || "0";
  }

  if (count >= 1000000000) {
    return Math.floor(count / 1000000000) + "B";
  }

  if (count >= 1000000) {
    return Math.floor(count / 1000000) + "M";
  }

  if (count >= 1000) {
    return Math.floor(count / 1000) + "K";
  }

  return count.toString();
}
/**
 * Enhanced hook to fetch food item and kitchen data with aggregated kitchen reviews
 */
export function useFoodDetail(foodId, kitchenId) {
  const [food, setFood] = useState(null);
  const [kitchen, setKitchen] = useState(null);
  const [likes, setLikes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  // const [kitchenReviewStats, setKitchenReviewStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      console.log(
        `[useFoodDetail] Starting fetch for foodId: ${foodId}, kitchenId: ${kitchenId}`
      );

      if (!foodId) {
        console.log("[useFoodDetail] No foodId provided, skipping fetch");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setFood(null);
        setKitchen(null);
        setLikes([]);
        setReviews([]);
        setReviewStats(null);
        // setKitchenReviewStats(null);

        console.log(
          "[useFoodDetail] Using getFoodDetailWithKitchenAndReviews for optimized fetch"
        );

        // Use the optimized function that fetches everything in parallel
        const {
          food: foodData,
          kitchen: kitchenData,
          likes: likesData,
          reviews: reviewsData,
          reviewStats: reviewStatsData,
        } = await getFoodDetailWithKitchenAndReviews(foodId, kitchenId);

        console.log("[useFoodDetail] Setting state with fetched data");
        setFood(foodData);
        setKitchen(kitchenData);
        setLikes(likesData);
        setReviews(reviewsData);
        setReviewStats(reviewStatsData);

        // Fetch aggregated kitchen reviews
        // const targetKitchenId = kitchenId || foodData?.kitchenId;
        // if (targetKitchenId) {
        //   console.log(
        //     `[useFoodDetail] Fetching aggregated kitchen reviews for: ${targetKitchenId}`
        //   );
        //   try {
        //     const kitchenStats = await getKitchenAggregatedReviews(
        //       targetKitchenId
        //     );
        //     setKitchenReviewStats(kitchenStats);
        //     console.log("[useFoodDetail] Kitchen review stats:", kitchenStats);
        //   } catch (kitchenStatsError) {
        //     console.warn(
        //       "[useFoodDetail] Failed to fetch kitchen review stats:",
        //       kitchenStatsError
        //     );
        //   }
        // }
      } catch (err) {
        console.error("[useFoodDetail] Error in fetchData:", err);
        setError(err.message);

        // Try fallback approach
        try {
          console.log("[useFoodDetail] Attempting fallback fetch approach");
          const foodData = await getFoodById(foodId);
          setFood(foodData);

          const targetKitchenId = kitchenId || foodData.kitchenId;
          if (targetKitchenId) {
            try {
              const kitchenData = await getKitchenById(targetKitchenId);
              setKitchen(kitchenData);

              // Try to get kitchen review stats in fallback too
              // const kitchenStats = await getKitchenAggregatedReviews(
              //   targetKitchenId
              // );
              // setKitchenReviewStats(kitchenStats);
            } catch (kitchenError) {
              console.warn(
                "[useFoodDetail] Kitchen fetch failed:",
                kitchenError
              );
            }
          }

          try {
            const [likesData, reviewsData] = await Promise.all([
              getFoodLikes(foodId),
              getFoodReviews(foodId),
            ]);
            setLikes(likesData);
            setReviews(reviewsData);
            setReviewStats(calculateReviewStats(reviewsData));
          } catch (dataError) {
            console.warn("[useFoodDetail] Data fetch failed:", dataError);
          }

          // Clear error if fallback succeeded
          setError(null);
        } catch (fallbackError) {
          console.error(
            "[useFoodDetail] Fallback approach also failed:",
            fallbackError
          );
          setError(fallbackError.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [foodId, kitchenId]);

  // Helper to get display values with fallbacks
  const getDisplayData = () => {
    if (!food) return null;

    return {
      ...food,
      // Fallback kitchen name from food data if kitchen object not available
      kitchenName: kitchen?.name || food.kitchenName || "Unknown Kitchen",
      kitchenCity: kitchen?.city || kitchen?.address || "Unknown Location",
      // Combine engagement data
      totalLikes: likes.length || food.engagement?.numOfLike || 0,
      rating:
        reviewStats?.averageRating ||
        food.engagement?.rating ||
        kitchen?.rating ||
        4.5,
      reviewCount:
        reviewStats?.totalReviews ||
        food.engagement?.numRatings ||
        food.engagement?.countRating ||
        0,
    };
  };

  return {
    food,
    kitchen,
    likes,
    reviews,
    reviewStats,
    loading,
    error,
    displayData: getDisplayData(),
    hasData: !!food,
    totalLikes: likes.length,
  };
}

/**
 * New hook specifically for kitchen aggregated reviews
 */
export function useKitchenReviews(kitchenId) {
  const [kitchenStats, setKitchenStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchKitchenReviews() {
      if (!kitchenId) {
        setKitchenStats(null);
        return;
      }

      console.log(
        `[useKitchenReviews] Fetching reviews for kitchen: ${kitchenId}`
      );

      try {
        setLoading(true);
        setError(null);

        const stats = await getKitchenAggregatedReviews(kitchenId);
        setKitchenStats(stats);

        console.log(`[useKitchenReviews] Kitchen stats loaded:`, stats);
      } catch (err) {
        console.error(
          "[useKitchenReviews] Error fetching kitchen reviews:",
          err
        );
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchKitchenReviews();
  }, [kitchenId]);

  return {
    kitchenStats,
    loading,
    error,
    totalReviews: kitchenStats?.totalReviews || 0,
    averageRating: kitchenStats?.averageRating || 0,
    ratingBreakdown: kitchenStats?.ratingBreakdown || {},
    ratingPercentages: kitchenStats?.ratingPercentages || {},
  };
}

/**
 * Hook to fetch multiple food items (for listing pages)
 */
export function useFoodListing(limitCount = 20) {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFoods() {
      console.log(`[useFoodListing] Starting fetch with limit: ${limitCount}`);

      try {
        setLoading(true);
        setError(null);
        setFoods([]);

        console.log("[useFoodListing] Calling getAllFoods");
        const foodData = await getAllFoods(limitCount);

        console.log(
          `[useFoodListing] Received ${foodData.length} foods:`,
          foodData
        );
        setFoods(foodData);
      } catch (err) {
        console.error("[useFoodListing] Error fetching food listing:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFoods();
  }, [limitCount]);

  const refetch = () => {
    console.log("[useFoodListing] Manual refetch triggered");
    setFoods([]);
    setError(null);
    // Trigger useEffect by changing a dependency (this is a simple approach)
    window.location.reload();
  };

  return {
    foods,
    loading,
    error,
    refetch,
    hasData: foods.length > 0,
    isEmpty: !loading && foods.length === 0,
  };
}

/**
 * Hook for testing Firestore connection
 */
export function useFirestoreTest() {
  const [testResults, setTestResults] = useState(null);
  const [testing, setTesting] = useState(false);

  const runTest = async () => {
    console.log("[useFirestoreTest] Running connection test");
    setTesting(true);
    try {
      const { testFirestoreConnection } = await import(
        "../services/foodService"
      );
      const results = await testFirestoreConnection();
      setTestResults(results);
      console.log("[useFirestoreTest] Test completed:", results);
    } catch (error) {
      console.error("[useFirestoreTest] Test failed:", error);
      setTestResults({ status: "error", error: error.message });
    } finally {
      setTesting(false);
    }
  };

  return { testResults, testing, runTest };
}

/**
 * Helper function to get aggregated reviews for a kitchen
 * This calculates total reviews across all food items in the kitchen
 */
async function getKitchenAggregatedReviews(kitchenId) {
  console.log(
    `[getKitchenAggregatedReviews] Starting aggregation for kitchen: ${kitchenId}`
  );

  try {
    // Step 1: Get all food items to find foods belonging to this kitchen
    console.log(
      `[getKitchenAggregatedReviews] Fetching all foods to filter by kitchen: ${kitchenId}`
    );
    const allFoods = await getAllFoods(1000); // Get up to 1000 foods
    console.log("🚀 ~ getKitchenAggregatedReviews ~ allFoods:", allFoods);

    // Step 2: Filter foods that belong to this kitchen
    const kitchenFoods = allFoods.filter(
      (food) =>
        food.kitchenId === kitchenId ||
        food.kitchen?.id === kitchenId ||
        food.kitchen_id === kitchenId
    );

    const foodIds = kitchenFoods.map((food) => food.id).filter(Boolean);
    console.log("🚀 ~ getKitchenAggregatedReviews ~ foodIds:", foodIds);

    console.log(
      `[getKitchenAggregatedReviews] Found ${foodIds.length} foods for kitchen ${kitchenId}:`,
      foodIds
    );

    if (foodIds.length === 0) {
      console.log(
        `[getKitchenAggregatedReviews] No foods found for kitchen ${kitchenId}`
      );
      return {
        kitchenId,
        totalReviews: 0,
        averageRating: 0,
        ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        ratingPercentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        reviewsList: [],
        foodIds: [],
        lastUpdated: new Date().toISOString(),
      };
    }

    // Step 3: Fetch reviews for each food item in parallel
    console.log(
      `[getKitchenAggregatedReviews] Fetching reviews for ${foodIds.length} food items`
    );

    const reviewPromises = foodIds.map(async (foodId) => {
      try {
        console.log(
          `[getKitchenAggregatedReviews] Fetching reviews for food: ${foodId}`
        );
        const reviews = await getFoodReviews(foodId, kitchenId, 100); // Limit per food item
        console.log(
          `[getKitchenAggregatedReviews] Found ${reviews.length} reviews for food ${foodId}`
        );
        return reviews.map((review) => ({
          ...review,
          foodId: foodId, // Ensure foodId is set
          kitchenId: kitchenId, // Ensure kitchenId is set
        }));
      } catch (error) {
        console.warn(
          `[getKitchenAggregatedReviews] Failed to fetch reviews for food ${foodId}:`,
          error
        );
        return []; // Return empty array on error
      }
    });

    // Wait for all review fetches to complete
    const reviewArrays = await Promise.all(reviewPromises);

    // Step 4: Flatten all reviews into a single array
    const allKitchenReviews = reviewArrays.flat();

    console.log(
      `[getKitchenAggregatedReviews] Found total of ${allKitchenReviews.length} reviews for kitchen ${kitchenId} across ${foodIds.length} food items`
    );

    // Step 5: Calculate aggregated statistics
    const aggregatedStats = calculateReviewStats(allKitchenReviews);
    console.log(
      "🚀 ~ getKitchenAggregatedReviews ~ aggregatedStats:",
      aggregatedStats
    );

    // Step 6: Add additional metadata
    const result = {
      ...aggregatedStats,
      kitchenId,
      foodIds, // Include the food IDs that were processed
      reviewsList: allKitchenReviews, // Include the actual reviews if needed
      lastUpdated: new Date().toISOString(),
      processingDetails: {
        totalFoodsProcessed: foodIds.length,
        totalReviewsFetched: allKitchenReviews.length,
        averageReviewsPerFood:
          foodIds.length > 0
            ? (allKitchenReviews.length / foodIds.length).toFixed(2)
            : 0,
      },
    };

    console.log(
      `[getKitchenAggregatedReviews] Aggregated stats for kitchen ${kitchenId}:`,
      {
        ...result,
        reviewsList: `[${result.reviewsList.length} reviews]`, // Don't log all reviews, just count
      }
    );

    return result;
  } catch (error) {
    console.error(
      `[getKitchenAggregatedReviews] Error aggregating reviews for kitchen ${kitchenId}:`,
      error
    );

    // Return empty stats on error
    return {
      kitchenId,
      totalReviews: 0,
      averageRating: 0,
      ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      ratingPercentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      reviewsList: [],
      foodIds: [],
      lastUpdated: new Date().toISOString(),
      error: error.message,
      processingDetails: {
        totalFoodsProcessed: 0,
        totalReviewsFetched: 0,
        averageReviewsPerFood: 0,
      },
    };
  }
}
