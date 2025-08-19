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
 * Enhanced hook to fetch food item and kitchen data
 */
export function useFoodDetail(foodId, kitchenId) {
  const [food, setFood] = useState(null);
  const [kitchen, setKitchen] = useState(null);
  const [likes, setLikes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
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
