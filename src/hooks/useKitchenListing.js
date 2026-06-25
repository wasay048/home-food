import { useState, useEffect } from "react";
import {
  getKitchenWithFoodItems,
  getAllKitchensWithFoodItems,
} from "../services/foodService";

/**
 * Hook to fetch a specific kitchen with its food items from Firebase
 */
export function useKitchenWithFoods(kitchenId, { defer = false } = {}) {
  const [kitchen, setKitchen] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Function to trigger a manual refetch
  const refetch = () => {
    console.log("[useKitchenWithFoods] Manual refetch triggered");
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (!kitchenId) {
      setLoading(false);
      return;
    }

    async function fetchKitchenData() {
      console.log(`[useKitchenWithFoods] Fetching kitchen: ${kitchenId}`);

      try {
        setLoading(true);
        setError(null);

        const { kitchen, foods } = await getKitchenWithFoodItems(kitchenId);

        setKitchen(kitchen);
        setFoods(foods);

        console.log(
          `[useKitchenWithFoods] Loaded kitchen with ${foods.length} foods`
        );
      } catch (err) {
        console.error("[useKitchenWithFoods] Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    // Callers where foods are the primary content (ListingPage, OrderPage) run
    // synchronously, exactly as before. Callers that only prefetch (FoodDetail
    // page, defer:true) run after first paint via requestIdleCallback so the
    // duplicate kitchen doc + full foodItems subcollection read never competes
    // with the critical fetch. setTimeout fallback for WeChat / iOS Safari.
    if (!defer) {
      fetchKitchenData();
      return;
    }

    const ric =
      typeof window !== "undefined" && window.requestIdleCallback
        ? window.requestIdleCallback
        : (cb) => setTimeout(cb, 200);
    const handle = ric(fetchKitchenData);
    return () => {
      if (window.cancelIdleCallback && typeof handle === "number") {
        try {
          window.cancelIdleCallback(handle);
        } catch (_) {}
      } else {
        clearTimeout(handle);
      }
    };
  }, [kitchenId, refreshKey, defer]);

  return {
    kitchen,
    foods,
    loading,
    error,
    hasData: !!kitchen && foods.length > 0,
    refetch,
  };
}

/**
 * Hook to fetch all kitchens with their food items from Firebase
 * This can be used for a comprehensive listing across multiple kitchens
 */
export function useAllKitchensWithFoods(limitKitchens = 10) {
  const [kitchensData, setKitchensData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAllKitchensData() {
      console.log(
        `[useAllKitchensWithFoods] Fetching up to ${limitKitchens} kitchens`
      );

      try {
        setLoading(true);
        setError(null);

        const kitchensWithFoods = await getAllKitchensWithFoodItems(
          limitKitchens
        );
        setKitchensData(kitchensWithFoods);

        const totalFoods = kitchensWithFoods.reduce(
          (total, item) => total + item.foods.length,
          0
        );
        console.log(
          `[useAllKitchensWithFoods] Loaded ${kitchensWithFoods.length} kitchens with ${totalFoods} total foods`
        );
      } catch (err) {
        console.error("[useAllKitchensWithFoods] Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAllKitchensData();
  }, [limitKitchens]);

  // Flatten all foods from all kitchens
  const allFoods = kitchensData.reduce((foods, kitchenData) => {
    return [...foods, ...kitchenData.foods];
  }, []);

  // Get first kitchen (for display purposes)
  const primaryKitchen =
    kitchensData.length > 0 ? kitchensData[0].kitchen : null;

  return {
    kitchensData,
    allFoods,
    primaryKitchen,
    loading,
    error,
    hasData: kitchensData.length > 0,
    totalKitchens: kitchensData.length,
    totalFoods: allFoods.length,
  };
}
