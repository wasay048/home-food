import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { QRCodeSVG } from "qrcode.react";
import scooterRider from "../assets/scooter-rider.png";
import { useGenericCart } from "../hooks/useGenericCart";
import { useKitchenWithFoods } from "../hooks/useKitchenListing";
import {
  setListingData,
  setListingLoading,
  setKitchenId,
} from "../store/slices/listingSlice";
import { removeItemsFromOtherKitchens } from "../store/slices/cartSlice";
import { setCurrentKitchen } from "../store/slices/foodSlice";
import {
  setFoodCategories,
  setFoodCategoriesLoading,
} from "../store/slices/foodCategoriesSlice";
import { getFoodCategories } from "../services/foodService";

// Default kitchen to show when a user lands directly on /foods without any
// prior navigation context (e.g. opens the URL in a new tab or via a bookmark).
const DEFAULT_DIRECT_LANDING_KITCHEN_ID = "PKcWQYMxEZQxnKSLp4de";
import { fetchAggregatedOrderQuantities } from "../store/slices/orderAggregationSlice";
// import Edit from "../assets/images/edit.svg";
import { QuantitySelector } from "../components/QuantitySelector/QuantitySelector";
import DateTimePicker from "../components/DateTimePicker/DateTimePicker";
import { useSelector, useDispatch } from "react-redux";

// ✅ Calculate group order percentage using Redux aggregated orders
// Formula: (totalOrderQuantity / minByGroup) * 100
// totalOrderQuantity = aggregated quantity across ALL orders for this item (by name, irrespective of kitchen)
// minByGroup = minimum orders required to meet wholesale requirement (from food item data)
const calculateGroupOrderPercentage = (food, quantitiesByItemName) => {
  if (!food) return 0;
  const minByGroup = food.minByGroup;
  if (!minByGroup || minByGroup <= 0) return 0; // Guard against division by zero
  const orderedQuantity = quantitiesByItemName[food.name] || 0;
  const percentage = (orderedQuantity / minByGroup) * 100;
  return Math.max(0, Math.round(percentage * 100) / 100);
};

export default function ListingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get listing data from Redux store
  const {
    goGrabItems,
    preOrderItems,
    availablePreorderDates,
    kitchen,
    isLoading: listingLoading,
    lastUpdated,
    kitchenId,
  } = useSelector((state) => state.listing);

  const dispatch = useDispatch();

  // ✅ NEW: Get aggregated order quantities from Redux
  const { quantitiesByItemName } = useSelector(
    (state) => state.orderAggregation,
  );

  // ✅ If the user lands directly on /foods with no kitchen context in Redux,
  // seed the default kitchen instead of bouncing them back home. Any existing
  // flow that reaches this page after populating Redux (via setListingData or
  // an explicit setKitchenId) is untouched.
  useEffect(() => {
    if (!kitchenId) {
      console.log(
        "ℹ️ [ListingPage] No kitchenId in store, defaulting to",
        DEFAULT_DIRECT_LANDING_KITCHEN_ID,
      );
      dispatch(setKitchenId(DEFAULT_DIRECT_LANDING_KITCHEN_ID));
    }
  }, [kitchenId, dispatch]);

  // ✅ Fetch fresh data from Firebase when mounting/refreshing
  const {
    kitchen: fullKitchen,
    foods: allFoods,
    loading: freshLoading,
    refetch,
  } = useKitchenWithFoods(kitchenId);

  // ✅ Pull-to-refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef(0);
  const containerRef = useRef(null);
  const PULL_THRESHOLD = 80; // pixels to pull before triggering refresh

  // Handle touch start for pull-to-refresh
  const handleTouchStart = useCallback((e) => {
    if (window.scrollY === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  }, []);

  // Handle touch move for pull-to-refresh
  const handleTouchMove = useCallback(
    (e) => {
      if (isRefreshing) return;
      if (window.scrollY > 0) {
        setPullDistance(0);
        return;
      }

      const touchY = e.touches[0].clientY;
      const diff = touchY - touchStartY.current;

      if (diff > 0) {
        // Pulling down - apply resistance
        setPullDistance(Math.min(diff * 0.5, PULL_THRESHOLD + 20));
      }
    },
    [isRefreshing],
  );

  // Handle touch end for pull-to-refresh
  const handleTouchEnd = useCallback(async () => {
    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      console.log("🔄 [ListingPage] Pull-to-refresh triggered");

      try {
        // Trigger refetch
        refetch();
        // Wait a bit to show the refresh animation
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullDistance(0);
  }, [pullDistance, isRefreshing, refetch]);

  // ✅ Update Redux with fresh data when it arrives
  useEffect(() => {
    // Only proceed if we have fresh data and a valid kitchenId
    if (!fullKitchen || !allFoods || allFoods.length === 0 || !kitchenId) {
      return;
    }

    // Optional: Only update if data has actually changed or if it's been a while?
    // For now, we update on every mount/refresh to ensure fresh percentages
    console.log("🔄 [ListingPage] Refreshed data received from Firebase");

    try {
      // Process Go & Grab items
      const goGrabItems = allFoods.filter((food) => {
        if (food.deActiveItem) return false;
        const numAvailable =
          food.availability?.numAvailable || food.numAvailable || 0;
        return numAvailable > 0 && food.kitchenId === kitchenId;
      });

      // Process Pre-Order items
      let preOrderItems = [];
      let availablePreorderDates = [];

      if (fullKitchen?.preorderSchedule?.dates) {
        // Get dates for the next 7 days (including today)
        const today = dayjs();
        const preorderFoodIds = new Set();
        availablePreorderDates = [];

        // Loop through the next 7 days
        for (let i = 0; i < 7; i++) {
          const currentDate = today.add(i, "day");
          const dateStr = currentDate.format("YYYY-MM-DD");
          const schedule = fullKitchen.preorderSchedule.dates[dateStr];

          // Check if schedule exists for this date
          if (schedule && Array.isArray(schedule) && schedule.length > 0) {
            // Format display date
            let displayDate;
            if (i === 0) {
              displayDate = `Today, ${currentDate.format("MMM D")}`;
            } else if (i === 1) {
              displayDate = `Tomorrow, ${currentDate.format("MMM D")}`;
            } else {
              displayDate = currentDate.format("ddd, MMM D");
            }

            availablePreorderDates.push({
              dateString: dateStr,
              displayDate: displayDate,
              scheduleItems: schedule,
            });

            // Add food IDs from this date's schedule
            schedule.forEach((item) => {
              preorderFoodIds.add(item.foodItemId);
            });
          }
        }

        // Filter foods that are in any of the week's preorder schedules
        if (preorderFoodIds.size > 0) {
          preOrderItems = allFoods.filter((food) => {
            return (
              !food.deActiveItem &&
              preorderFoodIds.has(food.id) &&
              food.kitchenId === kitchenId
            );
          });
        } else {
          preOrderItems = [];
        }
      } else {
        availablePreorderDates = [];
        preOrderItems = [];
      }

      const listingData = {
        goGrabItems,
        preOrderItems,
        availablePreorderDates,
        kitchen: fullKitchen,
      };

      // Prune cart items that belong to a different kitchen before updating
      // listing state, so the cart is always consistent with the active kitchen.
      dispatch(removeItemsFromOtherKitchens(kitchenId));

      dispatch(setListingData(listingData));
      // Seed food.currentKitchen so downstream pages (e.g. PaymentPage) work
      // even when the user skips FoodDetailPage (direct /foods → /checkout).
      dispatch(setCurrentKitchen(fullKitchen));
    } catch (error) {
      console.error("❌ [ListingPage] Error processing fresh data:", error);
    }
  }, [fullKitchen, allFoods, kitchenId, dispatch]);

  // ✅ Fetch aggregated order quantities globally for the group buy progress calculation
  useEffect(() => {
    dispatch(fetchAggregatedOrderQuantities());
  }, [dispatch]);

  // ✅ Get food categories from Redux store
  const foodCategories = useSelector(
    (state) => state.foodCategories?.categories || [],
  );
  const foodCategoriesLastUpdated = useSelector(
    (state) => state.foodCategories?.lastUpdated,
  );

  // Background-fetch food categories so headings show real names (e.g.
  // "Group PreOrder") instead of the "Category 8" fallback when the user
  // lands directly on /foods without first visiting FoodDetailPage.
  useEffect(() => {
    const ONE_HOUR_MS = 60 * 60 * 1000;
    const isStale =
      !foodCategoriesLastUpdated ||
      Date.now() - foodCategoriesLastUpdated > ONE_HOUR_MS;
    if (foodCategories.length > 0 && !isStale) return;

    let cancelled = false;
    (async () => {
      try {
        dispatch(setFoodCategoriesLoading(true));
        const categories = await getFoodCategories();
        if (cancelled) return;
        dispatch(setFoodCategories(categories));
      } catch (err) {
        console.error("[ListingPage] Failed to fetch food categories:", err);
        if (!cancelled) dispatch(setFoodCategoriesLoading(false));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [dispatch, foodCategories.length, foodCategoriesLastUpdated]);

  // Use the generic cart hook for all cart operations
  const { cartItems, getCartQuantity, getCartItem } = useGenericCart();

  // ✅ Helper function to get max category ID from comma-separated string (e.g., "5, 7" -> 7)
  const getMaxCategoryId = useCallback((foodCategory) => {
    if (!foodCategory) return 0;
    const categories = foodCategory
      .split(",")
      .map((c) => parseInt(c.trim(), 10));
    return Math.max(...categories.filter((c) => !isNaN(c)), 0);
  }, []);

  // ✅ Search state — `searchInput` mirrors the input field; `searchQuery`
  // is the debounced value used for filtering so keystrokes don't re-filter
  // the entire list on every character.
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(searchInput.trim()), 150);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ✅ Pre-compute a normalized, lowercased haystack per food item so each
  // keystroke does O(1) `includes` calls instead of re-lowercasing text.
  // Covers name, description, and category name for richer matching.
  const foodSearchIndex = useMemo(() => {
    const index = new Map();
    const categoryNameMap = {};
    foodCategories.forEach((cat) => {
      categoryNameMap[String(cat.id)] = cat.name;
    });
    const buildHaystack = (food) => {
      const catIds = (food.foodCategory || "")
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      const catNames = catIds.map((id) => categoryNameMap[id] || "").join(" ");
      return [food.name, food.description, catNames]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();
    };
    (goGrabItems || []).forEach((f) => index.set(f.id, buildHaystack(f)));
    (preOrderItems || []).forEach((f) => {
      if (!index.has(f.id)) index.set(f.id, buildHaystack(f));
    });
    return index;
  }, [goGrabItems, preOrderItems, foodCategories]);

  // ✅ Tokenize once; every token must appear in the haystack (AND logic).
  const searchTokens = useMemo(() => {
    if (!searchQuery) return [];
    return searchQuery.toLocaleLowerCase().split(/\s+/).filter(Boolean);
  }, [searchQuery]);

  const matchesSearch = useCallback(
    (foodId) => {
      if (searchTokens.length === 0) return true;
      const hay = foodSearchIndex.get(foodId) || "";
      for (let i = 0; i < searchTokens.length; i++) {
        if (!hay.includes(searchTokens[i])) return false;
      }
      return true;
    },
    [searchTokens, foodSearchIndex],
  );

  // ✅ Sort Go&Grab items by foodCategory in ascending order
  const sortedGoGrabItems = useMemo(() => {
    if (!goGrabItems || goGrabItems.length === 0) return [];
    const base = searchTokens.length
      ? goGrabItems.filter((f) => matchesSearch(f.id))
      : goGrabItems;
    return [...base].sort((a, b) => {
      const maxCatA = getMaxCategoryId(a.foodCategory);
      const maxCatB = getMaxCategoryId(b.foodCategory);
      return maxCatA - maxCatB; // Ascending order
    });
  }, [goGrabItems, getMaxCategoryId, searchTokens, matchesSearch]);

  // ✅ Group Go&Grab items by category for display
  const groupedGoGrabItems = useMemo(() => {
    if (!sortedGoGrabItems || sortedGoGrabItems.length === 0) return [];

    // Create a map from category id to category name. Stringify the key so
    // numeric ids from Firestore and string lookups below land in the same slot.
    const categoryNameMap = {};
    foodCategories.forEach((cat) => {
      categoryNameMap[String(cat.id)] = cat.name;
    });

    // Shared comparator: group-order % desc, then first English letter, then full name
    const compareItems = (a, b) => {
      const percentA = calculateGroupOrderPercentage(a, quantitiesByItemName);
      const percentB = calculateGroupOrderPercentage(b, quantitiesByItemName);
      if (percentB !== percentA) return percentB - percentA;
      const matchA = (a.name || "").match(/[A-Za-z]/);
      const matchB = (b.name || "").match(/[A-Za-z]/);
      const letterA = matchA ? matchA[0].toUpperCase() : "~";
      const letterB = matchB ? matchB[0].toUpperCase() : "~";
      if (letterA !== letterB) return letterA.localeCompare(letterB);
      return (a.name || "").localeCompare(b.name || "", undefined, {
        sensitivity: "base",
      });
    };

    // Group items by their max category ID
    const groups = {};
    sortedGoGrabItems.forEach((food) => {
      const maxCatId = getMaxCategoryId(food.foodCategory);
      if (!groups[maxCatId]) {
        groups[maxCatId] = {
          categoryId: maxCatId,
          categoryName:
            categoryNameMap[String(maxCatId)] || `Category ${maxCatId}`,
          items: [],
        };
      }
      groups[maxCatId].items.push(food);
    });

    // Sort ALL categories by group order percentage (high to low), then alphabetically
    Object.keys(groups).forEach((catId) => {
      groups[catId].items.sort(compareItems);
    });

    // For category 8 (Group PreOrder), build a sub-grouping by `subcategory`.
    // Subcategories containing "#" — and missing/empty values — collapse into "Others".
    // Sorting within each subcategory uses the exact same pattern as the parent group.
    const OTHERS_KEY = "Others";
    const cat8 = groups[8];
    if (cat8) {
      const subBuckets = {};
      cat8.items.forEach((food) => {
        const raw = (food.subcategory || "").trim();
        const useOthers = !raw || raw.includes("#");
        const displayName = useOthers
          ? OTHERS_KEY
          : raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
        if (!subBuckets[displayName]) {
          subBuckets[displayName] = { name: displayName, items: [] };
        }
        subBuckets[displayName].items.push(food);
      });

      Object.values(subBuckets).forEach((bucket) => {
        bucket.items.sort(compareItems);
      });

      cat8.subcategoryGroups = Object.values(subBuckets).sort((a, b) => {
        if (a.name === OTHERS_KEY) return 1;
        if (b.name === OTHERS_KEY) return -1;
        return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
      });
    }

    return Object.values(groups).sort((a, b) => a.categoryId - b.categoryId);
  }, [
    sortedGoGrabItems,
    foodCategories,
    getMaxCategoryId,
    quantitiesByItemName,
  ]);

  // ✅ Build alphabet-grouped items per category (for letter headers)
  const alphabetGroupedItems = useMemo(() => {
    const result = {};
    groupedGoGrabItems.forEach((group) => {
      const letterGroups = {};
      group.items.forEach((food) => {
        // Find the first English letter in the name (skip Chinese chars, brackets, etc.)
        const match = (food.name || "").match(/[A-Za-z]/);
        const letter = match ? match[0].toUpperCase() : "#";
        if (!letterGroups[letter]) letterGroups[letter] = [];
        letterGroups[letter].push(food);
      });
      // Sort letters alphabetically, # at end
      const sortedLetters = Object.keys(letterGroups).sort((a, b) => {
        if (a === "#") return 1;
        if (b === "#") return -1;
        return a.localeCompare(b);
      });
      result[group.categoryId] = sortedLetters.map((letter) => ({
        letter,
        items: letterGroups[letter],
      }));
    });
    return result;
  }, [groupedGoGrabItems]);

  // ✅ Collect all active letters across all categories for the sidebar
  const activeAlphabetLetters = useMemo(() => {
    const letters = new Set();
    groupedGoGrabItems.forEach((group) => {
      group.items.forEach((food) => {
        const match = (food.name || "").match(/[A-Za-z]/);
        const letter = match ? match[0].toUpperCase() : "#";
        letters.add(letter);
      });
    });
    const sorted = [...letters].sort((a, b) => {
      if (a === "#") return 1;
      if (b === "#") return -1;
      return a.localeCompare(b);
    });
    return sorted;
  }, [groupedGoGrabItems]);

  // ✅ Alphabet sidebar scroll handler (iOS-style)
  // Scrolls to the FIRST food item in the list whose name starts with the given letter
  const handleAlphabetClick = useCallback((letter) => {
    const el = document.querySelector(`[data-food-letter="${letter}"]`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // ✅ Alphabet sidebar touch-slide handler for iOS-style drag scrolling
  const alphabetSidebarRef = useRef(null);
  const handleAlphabetTouch = useCallback(
    (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      if (el && el.dataset.letter) {
        handleAlphabetClick(el.dataset.letter);
      }
    },
    [handleAlphabetClick],
  );

  // State for managing pickup dates and times for each food item
  const [pickupDates, setPickupDates] = useState({});
  const [pickupTimes, setPickupTimes] = useState({});

  // ✅ Collapsed-by-default subcategory accordions for category 8 (Group PreOrder).
  // While a search is active we treat every subcategory as expanded so matches
  // are never hidden behind a closed accordion.
  const [expandedSubcategories, setExpandedSubcategories] = useState(
    () => new Set(),
  );
  const toggleSubcategory = useCallback((key) => {
    setExpandedSubcategories((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);
  const isSubcategoryExpanded = useCallback(
    (key) => searchTokens.length > 0 || expandedSubcategories.has(key),
    [searchTokens.length, expandedSubcategories],
  );

  // ✅ Get preorder items for a specific date (using Redux data)
  const getPreOrderItemsForDate = useCallback(
    (dateString) => {
      if (!kitchen?.preorderSchedule?.dates?.[dateString]) return [];
      if (!preOrderItems || preOrderItems.length === 0) return [];

      const scheduleItems = kitchen.preorderSchedule.dates[dateString];
      return scheduleItems
        .map((scheduleItem) => {
          const food = preOrderItems.find(
            (f) => f.id === scheduleItem.foodItemId,
          );
          return food ? { ...food, scheduleItem } : null;
        })
        .filter(Boolean)
        .filter((food) => matchesSearch(food.id));
    },
    [kitchen, preOrderItems, matchesSearch],
  );

  const initializePickupDataFromCart = useCallback(() => {
    const newPickupDates = {};
    const newPickupTimes = {};

    // Initialize Go&Grab items from cart
    if (goGrabItems && goGrabItems.length > 0) {
      goGrabItems.forEach((food) => {
        const cartItem = getCartItem(food.id);
        if (cartItem) {
          if (cartItem.selectedDate) {
            newPickupDates[food.id] = cartItem.selectedDate;
          }
          if (cartItem.selectedTime) {
            newPickupTimes[food.id] = cartItem.selectedTime;
          }
        }
      });
    }

    // Initialize Pre-Order items from cart
    if (availablePreorderDates && availablePreorderDates.length > 0) {
      availablePreorderDates.forEach((dateInfo) => {
        const itemsForDate = getPreOrderItemsForDate(dateInfo.dateString);
        itemsForDate.forEach((food) => {
          // For pre-order, we need to check cart items with specific dates
          const cartItem = cartItems.find(
            (item) =>
              item.foodId === food.id &&
              item.selectedDate === dateInfo.dateString,
          );

          if (cartItem) {
            const key = `${food.id}_preorder`;
            if (cartItem.selectedDate) {
              newPickupDates[key] = cartItem.selectedDate;
            }
            if (cartItem.selectedTime) {
              newPickupTimes[key] = cartItem.selectedTime;
            }
          }
        });
      });
    }

    console.log("🔄 [ListingPage] Initializing pickup data from cart:", {
      newPickupDates,
      newPickupTimes,
    });

    // Only update if we have new data
    if (Object.keys(newPickupDates).length > 0) {
      setPickupDates((prev) => ({ ...prev, ...newPickupDates }));
    }
    if (Object.keys(newPickupTimes).length > 0) {
      setPickupTimes((prev) => ({ ...prev, ...newPickupTimes }));
    }
  }, [
    goGrabItems,
    availablePreorderDates,
    cartItems,
    getCartItem,
    getPreOrderItemsForDate,
  ]);

  // ✅ NEW: Initialize pickup data when component mounts or cart changes
  useEffect(() => {
    if (goGrabItems.length > 0 || availablePreorderDates.length > 0) {
      initializePickupDataFromCart();
    }
  }, [initializePickupDataFromCart]);

  // ✅ Log Redux data on mount and updates
  useEffect(() => {
    console.log("[ListingPage] Using Redux listing data:", {
      goGrabItems: goGrabItems?.length || 0,
      preOrderItems: preOrderItems?.length || 0,
      availablePreorderDates: availablePreorderDates?.length || 0,
      kitchen: kitchen?.name,
      lastUpdated: lastUpdated ? new Date(lastUpdated).toISOString() : "never",
      isLoading: listingLoading,
    });

    // Alert for iOS devices
    if (
      /iPad|iPhone|iPod/.test(navigator.userAgent) &&
      goGrabItems?.length > 0
    ) {
      console.log(
        "[ListingPage] iOS device detected - using pre-loaded Redux data",
      );
    }
  }, [
    goGrabItems,
    preOrderItems,
    availablePreorderDates,
    kitchen,
    lastUpdated,
    listingLoading,
  ]);

  // Function to go back to previous page in history
  const handleGoBack = () => {
    const detailPage = localStorage.getItem("detailPage");
    if (detailPage) {
      console.log("Going back to detailPage from localStorage:", detailPage);
      window.location.href = detailPage;
      return;
    }
    // Check if we have state from FoodDetailPage with the exact params
    if (location.state?.from?.fullUrl) {
      console.log(
        "Going back to FoodDetailPage with params:",
        location.state.from.fullUrl,
      );
      navigate(location.state.from.fullUrl);
      return;
    }

    // Check if we have any location state indicating where we came from
    if (location.state?.from?.pathname) {
      console.log(
        "Going back to:",
        location.state.from.pathname + (location.state.from.search || ""),
      );
      navigate(
        location.state.from.pathname + (location.state.from.search || ""),
      );
      return;
    }

    // Fallback: try browser history first, then home
    try {
      navigate(-1);
    } catch (error) {
      navigate("/");
    }
  };

  const handleDateChange = useCallback(
    (foodId, newDate, isPreOrder = false) => {
      const key = isPreOrder ? `${foodId}_preorder` : foodId;
      setPickupDates((prev) => ({
        ...prev,
        [key]: newDate,
      }));
      console.log(`[ListingPage] Date changed for ${key}:`, newDate);
      const timeKey = isPreOrder ? `${foodId}_preorder` : foodId;
      setPickupTimes((prev) => ({
        ...prev,
        [timeKey]: null,
      }));
    },
    [],
  );

  const handleTimeChange = useCallback(
    (foodId, newTime, isPreOrder = false) => {
      const key = isPreOrder ? `${foodId}_preorder` : foodId;
      setPickupTimes((prev) => ({
        ...prev,
        [key]: newTime,
      }));
      console.log(`[ListingPage] Time changed for ${key}:`, newTime);
    },
    [],
  );

  // ✅ Memoize cart quantities to prevent infinite recalculations
  const cartQuantities = useMemo(() => {
    const quantities = new Map();

    // Calculate Go&Grab quantities
    if (goGrabItems && goGrabItems.length > 0) {
      goGrabItems.forEach((food) => {
        quantities.set(`${food.id}`, getCartQuantity(food.id));
      });
    }

    // Calculate Pre-Order quantities
    if (availablePreorderDates && availablePreorderDates.length > 0) {
      availablePreorderDates.forEach((dateInfo) => {
        const itemsForDate = getPreOrderItemsForDate(dateInfo.dateString);
        itemsForDate.forEach((food) => {
          quantities.set(
            `${food.id}-${dateInfo.dateString}`,
            getCartQuantity(food.id, dateInfo.dateString),
          );
        });
      });
    }

    return quantities;
  }, [
    goGrabItems,
    availablePreorderDates,
    cartItems.length,
    getCartQuantity,
    getPreOrderItemsForDate,
  ]);

  // Helper function to get cart quantity from memoized map
  const getMemoizedCartQuantity = useCallback(
    (foodId, selectedDate = null) => {
      const key = selectedDate ? `${foodId}-${selectedDate}` : `${foodId}`;
      return cartQuantities.get(key) || 0;
    },
    [cartQuantities],
  );

  useEffect(() => {
    console.log("pickeup pickupDates updated:", pickupDates);
    console.log("pickeup pickupTimes updated time:", pickupTimes);
  }, [pickupDates, pickupTimes]);

  console.log(
    "Rendering ListingPage with state:",
    cartItems.map((item) => item.foodId),
  );

  // ✅ "Pickup Now" inventory list — INTENTIONALLY isolated from goGrabItems
  // and the existing numAvailable-based flow. Derives directly from the raw
  // `allFoods` fetched by useKitchenWithFoods, filters by the dedicated
  // `stock` field (>0), and applies its own price/stock formulas keyed on
  // variableWeight + poundsInOneOrder. Touching this memo cannot affect the
  // categorized menu sections rendered below.
  const pickupNowItems = useMemo(() => {
    if (!allFoods || allFoods.length === 0 || !kitchenId) return [];

    const stripPrefix = (name) => {
      let cleaned = (name || "").trim();
      while (cleaned.startsWith("付款预订")) {
        cleaned = cleaned.slice(4).trim();
      }
      return cleaned;
    };
    const isVariableWeight = (food) =>
      food?.variableWeight === 1 || food?.variableWeight === true;
    const formatNum = (n) => {
      const rounded = Math.round(n * 100) / 100;
      return Number.isInteger(rounded) ? `${rounded}` : `${rounded}`;
    };

    return allFoods
      .filter((food) => {
        if (!food || food.deActiveItem) return false;
        if (food.kitchenId !== kitchenId) return false;
        const stock = Number(food.stock) || 0;
        return stock > 0;
      })
      .map((food) => {
        const stock = Number(food.stock) || 0;
        const pounds = Number(food.poundsInOneOrder) || 0;
        const cost = Number(food.cost) || 0;
        const variable = isVariableWeight(food);

        let priceText;
        if (variable && pounds > 0) {
          priceText = `$${formatNum(cost / pounds)}/lb`;
        } else {
          priceText = `$${formatNum(cost)}`;
        }

        let stockText;
        if (variable && pounds > 0) {
          stockText = `${formatNum(pounds * stock)}lb`;
        } else {
          stockText = `${stock}`;
        }

        return {
          id: food.id,
          displayName: stripPrefix(food.name),
          priceText,
          stockText,
        };
      });
  }, [allFoods, kitchenId]);

  const [copyFeedback, setCopyFeedback] = useState("");

  const handleCopyInventory = useCallback(async () => {
    if (!pickupNowItems || pickupNowItems.length === 0) return;
    const origin =
      typeof window !== "undefined" && window.location
        ? window.location.origin
        : "";
    const header = `${kitchen?.name || "Kitchen"} — Pickup Now (No Preorder Needed)`;
    const lines = pickupNowItems.map((it) => {
      const link = `${origin}/share?kitchenId=${kitchen?.id || ""}&foodId=${it.id}&pickupNow=1`;
      return `${it.displayName} — ${it.priceText} (${it.stockText} in stock)\n${link}`;
    });
    const text = [header, ...lines].join("\n\n");
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopyFeedback("Copied!");
      setTimeout(() => setCopyFeedback(""), 1500);
    } catch (err) {
      console.error("[ListingPage] Copy inventory failed:", err);
      setCopyFeedback("Copy failed");
      setTimeout(() => setCopyFeedback(""), 1500);
    }
  }, [pickupNowItems, kitchen]);

  // ✅ When a search is active, compute whether any section will render
  // so we can show a clear empty-state instead of a blank page.
  const hasSearchResults = useMemo(() => {
    if (searchTokens.length === 0) return true;
    if (groupedGoGrabItems.some((g) => g.items.length > 0)) return true;
    return availablePreorderDates.some(
      (d) => getPreOrderItemsForDate(d.dateString).length > 0,
    );
  }, [
    searchTokens,
    groupedGoGrabItems,
    availablePreorderDates,
    getPreOrderItemsForDate,
  ]);

  const getPickupDate = useCallback(
    (foodId, isPreOrder = false, fallbackDate = null) => {
      const key = isPreOrder ? `${foodId}_preorder` : foodId;
      return pickupDates[key] || fallbackDate;
    },
    [pickupDates],
  );

  // ✅ ENHANCED: Helper function to get pickup time
  const getPickupTime = useCallback(
    (foodId, isPreOrder = false) => {
      const key = isPreOrder ? `${foodId}_preorder` : foodId;
      return pickupTimes[key] || null;
    },
    [pickupTimes],
  );

  useEffect(() => {
    console.log("🗓️ [ListingPage] Pickup dates updated:", pickupDates);
    console.log("⏰ [ListingPage] Pickup times updated:", pickupTimes);
  }, [pickupDates, pickupTimes]);

  console.log(
    "Rendering ListingPage with state:",
    cartItems.map((item) => item.foodId),
  );

  // Render a single Go&Grab card. Extracted so the same card markup is reused
  // both for flat category lists and inside the cat-8 subcategory accordions.
  const renderGoGrabFoodCard = (food) => {
    const foodLetterMatch = (food.name || "").match(/[A-Za-z]/);
    const foodLetter = foodLetterMatch ? foodLetterMatch[0].toUpperCase() : "#";
    const cartQty = getMemoizedCartQuantity(food.id);
    const currentPickupDate = getPickupDate(food.id, false);
    const currentPickupTime = getPickupTime(food.id, false);
    const isCat8 = getMaxCategoryId(food.foodCategory) === 8;
    return (
      <div key={food.id} className="menu-list" data-food-letter={foodLetter}>
        <div
          className="left"
          onClick={() =>
            window.open(
              `/share?kitchenId=${kitchen?.id}&foodId=${food.id}`,
              "_blank",
            )
          }
          style={{ cursor: "pointer" }}
        >
          <div className="image">
            <img
              src={food.imageUrl || "/src/assets/images/product.png"}
              alt={food.name}
              onError={(e) => {
                e.target.src = "/src/assets/images/product.png";
              }}
            />
          </div>
          <div className="data">
            <div className="title">{food.name}</div>
            <div className="text">{food.description || ""}</div>
            <div className="price-row">
              <div
                className="price"
                style={{ display: "flex", alignItems: "center" }}
              >
                <span>${food.cost}</span>
                {food.orderType === 1 && (
                  <img
                    src={scooterRider}
                    alt="Delivery"
                    style={{
                      marginLeft: "5px",
                      width: "15px",
                      height: "15px",
                    }}
                  />
                )}
              </div>
              {isCat8 &&
                calculateGroupOrderPercentage(food, quantitiesByItemName) !==
                  null && (
                  <div className="group-order-chip" aria-label="Groupbuy">
                    <span className="group-order-chip__label">Groupbuy:</span>{" "}
                    <span className="group-order-chip__value">
                      {calculateGroupOrderPercentage(
                        food,
                        quantitiesByItemName,
                      )}
                      %
                    </span>
                  </div>
                )}
              <div
                className="quantity-warpper"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="right mb-1">
                  <QuantitySelector
                    food={food}
                    kitchen={kitchen}
                    selectedDate={pickupDates[food.id]}
                    size="small"
                    initialQuantity={cartQty}
                    minQuantity={0}
                    orderType={"GO_GRAB"}
                    selectedTime={pickupTimes[food.id]}
                  />
                </div>
              </div>
            </div>
            {(() => {
              const cartItem = getCartItem(food.id);
              return cartItem?.specialInstructions ? (
                <div
                  className="text"
                  style={{ marginTop: "4px", fontStyle: "italic" }}
                >
                  Special Instruction: {cartItem.specialInstructions}
                </div>
              ) : null;
            })()}
            {!isCat8 && (
              <div
                className="pickup-time-section"
                onClick={(e) => e.stopPropagation()}
              >
                <DateTimePicker
                  food={food}
                  kitchen={kitchen}
                  orderType="GO_GRAB"
                  selectedDate={currentPickupDate}
                  selectedTime={currentPickupTime}
                  onDateChange={(newDate) => {
                    handleDateChange(food.id, newDate, false);
                  }}
                  onTimeChange={(newTime) => {
                    handleTimeChange(food.id, newTime, false);
                  }}
                  disabled={!food || !kitchen}
                  className="listing-page-picker"
                  dateLabel={
                    food.orderType === 1 ? "Delivery Date" : "Pickup Date"
                  }
                  timeLabel={
                    food.orderType === 1 ? "Deliver Time" : "Pickup Time"
                  }
                  isDeliveryMode={food.orderType === 1}
                  fulfillmentType={food.orderType}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="container"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: pullDistance > 0 ? `translateY(${pullDistance}px)` : "none",
        transition: pullDistance === 0 ? "transform 0.2s ease-out" : "none",
      }}
    >
      {/* Pull-to-refresh indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <div
          style={{
            position: "absolute",
            top: pullDistance > 0 ? -40 + pullDistance : 10,
            left: "50%",
            transform: "translateX(-50%)",
            textAlign: "center",
            color: "#3fc045",
            fontSize: "14px",
            fontWeight: "500",
            zIndex: 1000,
          }}
        >
          {isRefreshing ? (
            <span>🔄 Refreshing...</span>
          ) : pullDistance >= 80 ? (
            <span>↓ Release to refresh</span>
          ) : (
            <span>↓ Pull to refresh</span>
          )}
        </div>
      )}
      <div className="mobile-container" style={{ position: "relative" }}>
        {/* iOS-style Alphabet Sidebar */}
        {activeAlphabetLetters.length > 1 && (
          <div
            ref={alphabetSidebarRef}
            onTouchMove={handleAlphabetTouch}
            style={{
              position: "fixed",
              right: 2,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0,
              zIndex: 100,
              padding: "6px 3px",
              borderRadius: "12px",
              background: "rgba(0,0,0,0.04)",
              WebkitTapHighlightColor: "transparent",
              touchAction: "none",
              userSelect: "none",
            }}
          >
            {activeAlphabetLetters.map((letter) => (
              <div
                key={letter}
                data-letter={letter}
                onClick={() => handleAlphabetClick(letter)}
                style={{
                  fontSize: "10px",
                  fontWeight: "600",
                  color: "#198754",
                  padding: "2px 5px",
                  cursor: "pointer",
                  lineHeight: "1.4",
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                {letter}
              </div>
            ))}
          </div>
        )}
        <div className="padding-20">
          <div className="back-link-title">
            <button
              className="back-link"
              onClick={handleGoBack}
              style={{ border: "none", background: "none", cursor: "pointer" }}
            >
              <svg
                width="9"
                height="14"
                viewBox="0 0 9 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.94194 0.51631C8.18602 0.760388 8.18602 1.15612 7.94194 1.40019L2.34222 6.99992L7.94194 12.5996C8.18602 12.8437 8.18602 13.2394 7.94194 13.4835C7.69786 13.7276 7.30214 13.7276 7.05806 13.4835L1.01639 7.44186C0.772315 7.19778 0.772315 6.80205 1.01639 6.55798L7.05806 0.51631C7.30214 0.272233 7.69786 0.272233 7.94194 0.51631Z"
                  fill="#212226"
                />
              </svg>
            </button>
            <div className="listing-page-title">
              {kitchen?.name ? `${kitchen.name} on HomeFresh` : "HomeFresh"}
            </div>
          </div>

          {/* Chef / kitchen info row: avatar + chef name + MEHKO license on the
              left; "My Orders" and "My Balance" pill buttons on the right.
              Buttons mirror the same nav targets used on FoodDetailPage. */}
          <div className="kitchen-info-row">
            <div className="kitchen-info-left">
              <div className="kitchen-info-avatar">
                {kitchen?.imageURL ? (
                  <img
                    src={kitchen.imageURL}
                    alt={kitchen?.name || "Chef"}
                    onError={(e) => {
                      e.target.src = "/src/assets/images/product.png";
                    }}
                  />
                ) : (
                  <div className="kitchen-info-avatar__placeholder" aria-hidden="true" />
                )}
              </div>
              <div className="kitchen-info-text">
                <div className="kitchen-info-chef">
                  {kitchen?.chefName || kitchen?.name || "Chef"}
                </div>
                <div className="kitchen-info-license">
                  {(() => {
                    const raw = kitchen?.dateApproved;
                    const year = raw ? new Date(raw).getFullYear() : null;
                    return year && !Number.isNaN(year)
                      ? `MEHKO licensed since ${year}`
                      : "MEHKO licensed";
                  })()}
                </div>
              </div>
            </div>
            <div className="kitchen-info-actions">
              <button
                type="button"
                className="kitchen-info-btn kitchen-info-btn--orders"
                onClick={() =>
                  navigate("/my-orders", {
                    state: { from: location.pathname + location.search },
                  })
                }
              >
                My Orders
              </button>
              <button
                type="button"
                className="kitchen-info-btn kitchen-info-btn--balance"
                onClick={() =>
                  navigate("/my-balance", {
                    state: { from: location.pathname + location.search },
                  })
                }
              >
                My Balance
              </button>
            </div>
          </div>

          {/* iOS-first search bar */}
          <div className="listing-search-bar">
            <svg
              className="listing-search-bar__icon"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M7.333 12.667A5.333 5.333 0 107.333 2a5.333 5.333 0 000 10.667zM14 14l-2.9-2.9"
                stroke="#8e8e93"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="search"
              inputMode="search"
              enterKeyHint="search"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck="false"
              className="listing-search-bar__input"
              placeholder="Search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Search food items"
            />
            {searchInput && (
              <button
                type="button"
                className="listing-search-bar__clear"
                onClick={() => setSearchInput("")}
                aria-label="Clear search"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <circle cx="7" cy="7" r="7" fill="#c7c7cc" />
                  <path
                    d="M4.5 4.5l5 5M9.5 4.5l-5 5"
                    stroke="#fff"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Pickup Now (No Preorder Needed) — flat inventory table of items
              with stock > 0, sourced from goGrabItems. Rendered above the
              categorized menu cards; existing sections below are untouched. */}
          {pickupNowItems.length > 0 && (
            <div className="pickup-now-section">
              <div className="pickup-now-header">
                <h2 className="small-title pickup-now-title">
                  Pickup Now{" "}
                  <span className="pickup-now-subtitle">
                    (No Preorder Needed)
                  </span>
                </h2>
                <button
                  type="button"
                  className="pickup-now-copy-btn"
                  onClick={handleCopyInventory}
                  aria-label="Copy inventory list"
                >
                  {copyFeedback || "Copy"}
                </button>
              </div>
              <div className="pickup-now-table">
                <div className="pickup-now-row pickup-now-row--head">
                  <span className="pickup-now-col pickup-now-col--name" />
                  <span className="pickup-now-col pickup-now-col--price">
                    Price
                  </span>
                  <span className="pickup-now-col pickup-now-col--stock">
                    In Stock
                  </span>
                </div>
                {pickupNowItems.map((item) => (
                  <div key={item.id} className="pickup-now-row">
                    <span
                      className="pickup-now-col pickup-now-col--name pickup-now-col--clickable"
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        window.open(
                          `/share?kitchenId=${kitchen?.id}&foodId=${item.id}&pickupNow=1`,
                          "_blank",
                        )
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          window.open(
                            `/share?kitchenId=${kitchen?.id}&foodId=${item.id}&pickupNow=1`,
                            "_blank",
                          );
                        }
                      }}
                    >
                      {item.displayName}
                    </span>
                    <span className="pickup-now-col pickup-now-col--price">
                      {item.priceText}
                    </span>
                    <span className="pickup-now-col pickup-now-col--stock">
                      {item.stockText}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Go & Grab Section - Grouped by Category */}
          {groupedGoGrabItems.length > 0 && (
            <>
              <h2 className="small-title mb-20">Available Today</h2>
              {groupedGoGrabItems.map((group) => {
                const isCat8 = group.categoryId === 8;
                return (
                  <div key={group.categoryId} className="category-group">
                    <h3 className="category-title">{group.categoryName}</h3>
                    {isCat8 && group.subcategoryGroups ? (
                      <div className="subcategory-list">
                        {group.subcategoryGroups.map((sg) => {
                          const subKey = `${group.categoryId}__${sg.name}`;
                          const expanded = isSubcategoryExpanded(subKey);
                          return (
                            <div
                              key={subKey}
                              className={`subcategory-group${expanded ? " is-expanded" : ""}`}
                            >
                              <button
                                type="button"
                                className="subcategory-header"
                                onClick={() => toggleSubcategory(subKey)}
                                aria-expanded={expanded}
                                aria-controls={`subcat-body-${subKey}`}
                              >
                                <span className="subcategory-header__label">
                                  <span className="subcategory-header__name">
                                    {sg.name}
                                  </span>
                                  <span className="subcategory-header__count">
                                    {sg.items.length}
                                  </span>
                                </span>
                                <svg
                                  className="subcategory-header__chevron"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  aria-hidden="true"
                                >
                                  <path
                                    d="M3.5 5.25L7 8.75L10.5 5.25"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                              {expanded && (
                                <div
                                  id={`subcat-body-${subKey}`}
                                  className="subcategory-body"
                                >
                                  <div className="menu-listing">
                                    {sg.items.map((food) =>
                                      renderGoGrabFoodCard(food),
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="menu-listing">
                        {group.items.map((food) => renderGoGrabFoodCard(food))}
                      </div>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {/* Pre-order Sections */}
          {availablePreorderDates.map((dateInfo) => {
            const preOrderItemsForDate = getPreOrderItemsForDate(
              dateInfo.dateString,
            );
            console.log("preOrderItemsForDate", preOrderItemsForDate);
            if (preOrderItemsForDate.length === 0) return null;

            return (
              <div key={dateInfo.dateString}>
                <h2 className="small-title mb-16">
                  Pre-order for {dateInfo.displayDate}
                </h2>
                <div className="menu-listing">
                  {preOrderItemsForDate.map((food) => {
                    const cartQty = getMemoizedCartQuantity(
                      food.id,
                      dateInfo.dateString,
                    );
                    const currentPickupDate = getPickupDate(
                      food.id,
                      true,
                      dateInfo.dateString,
                    );
                    const currentPickupTime = getPickupTime(food.id, true);
                    // const availableTimes = food.scheduleItem
                    //   ?.availableTimes || ["6:22 PM"];

                    return (
                      <div
                        key={`${food.id}-${dateInfo.dateString}`}
                        className="menu-list"
                      >
                        <div
                          className="left"
                          onClick={() =>
                            window.open(
                              `/share?kitchenId=${kitchen?.id}&foodId=${
                                food.id
                              }&date=${dayjs(dateInfo.dateString).format(
                                "M/D/YYYY",
                              )}`,
                              "_blank",
                            )
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <div className="image">
                            <img
                              src={
                                food.imageUrl ||
                                "/src/assets/images/product.png"
                              }
                              alt={food.name}
                              onError={(e) => {
                                e.target.src = "/src/assets/images/product.png";
                              }}
                            />
                          </div>
                          <div className="data">
                            <div className="title">{food.name}</div>
                            <div className="text">{food.description || ""}</div>
                            <div className="price-row">
                              <div
                                className="price"
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <span>${food.cost}</span>
                                {food.orderType === 1 && (
                                  <img
                                    src={scooterRider}
                                    alt="Delivery"
                                    style={{
                                      marginLeft: "5px",
                                      width: "15px",
                                      height: "15px",
                                    }}
                                  />
                                )}
                              </div>
                              <div
                                className="quantity-warpper"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="right mb-1">
                                  <QuantitySelector
                                    food={food}
                                    kitchen={kitchen}
                                    selectedDate={
                                      pickupDates[`${food.id}_preorder`] ||
                                      dateInfo.dateString
                                    }
                                    size="small"
                                    initialQuantity={cartQty}
                                    minQuantity={0}
                                    orderType={"PRE_ORDER"}
                                    selectedTime={
                                      pickupTimes[`${food.id}_preorder`]
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            {(() => {
                              const cartItem = cartItems.find(
                                (item) =>
                                  item.foodId === food.id &&
                                  item.selectedDate === dateInfo.dateString,
                              );
                              return cartItem?.specialInstructions ? (
                                <div
                                  className="text"
                                  style={{
                                    marginTop: "4px",
                                    fontStyle: "italic",
                                  }}
                                >
                                  Special Instruction:{" "}
                                  {cartItem.specialInstructions}
                                </div>
                              ) : null;
                            })()}
                            <div
                              className="pickup-time-section"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <DateTimePicker
                                food={food}
                                kitchen={kitchen}
                                orderType="PRE_ORDER"
                                selectedDate={currentPickupDate}
                                selectedTime={currentPickupTime}
                                onDateChange={(newDate) => {
                                  handleDateChange(food.id, newDate, true);
                                }}
                                onTimeChange={(newTime) => {
                                  handleTimeChange(food.id, newTime, true);
                                }}
                                disabled={!food || !kitchen}
                                className="listing-page-picker"
                                dateLabel={
                                  food.orderType === 1
                                    ? "Delivery Date"
                                    : "Pickup Date"
                                }
                                timeLabel={
                                  food.orderType === 1
                                    ? "Deliver Time"
                                    : "Pickup Time"
                                }
                                isDeliveryMode={food.orderType === 1}
                                fulfillmentType={food.orderType}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Empty search results state */}
          {searchTokens.length > 0 && !hasSearchResults && (
            <div className="listing-search-empty">
              <div className="listing-search-empty__title">
                No matches for &ldquo;{searchQuery}&rdquo;
              </div>
              <div className="listing-search-empty__subtitle">
                Try a different keyword or clear the search.
              </div>
            </div>
          )}

          {/* Continue to Cart Button - Only show when data is loaded */}
          <button
            className="action-button mb-16"
            onClick={() => {
              if (cartItems.length === 0) {
                alert(
                  "Oops! Your cart is empty. Add something delicious to get started.",
                );
              } else {
                navigate("/order");
              }
            }}
          >
            Continue to View Cart
          </button>

          {/* QR Code Section */}
          <div className="scanner-bottom mb-16">
            <div className="text">
              Full menus from your local home kitchens can be found in the
              HomeFresh app, available in the iOS App Store.
            </div>
            <div className="qr">
              <QRCodeSVG value="https://www.homefreshfoods.ai" size={50} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
