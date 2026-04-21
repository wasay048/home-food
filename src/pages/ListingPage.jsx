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
  const { quantitiesByItemName } = useSelector((state) => state.orderAggregation);

  // ✅ If the user lands directly on /foods with no kitchen context in Redux,
  // seed the default kitchen instead of bouncing them back home. Any existing
  // flow that reaches this page after populating Redux (via setListingData or
  // an explicit setKitchenId) is untouched.
  useEffect(() => {
    if (!kitchenId) {
      console.log(
        "ℹ️ [ListingPage] No kitchenId in store, defaulting to",
        DEFAULT_DIRECT_LANDING_KITCHEN_ID
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

  // ✅ Sort Go&Grab items by foodCategory in ascending order
  const sortedGoGrabItems = useMemo(() => {
    if (!goGrabItems || goGrabItems.length === 0) return [];
    return [...goGrabItems].sort((a, b) => {
      const maxCatA = getMaxCategoryId(a.foodCategory);
      const maxCatB = getMaxCategoryId(b.foodCategory);
      return maxCatA - maxCatB; // Ascending order
    });
  }, [goGrabItems, getMaxCategoryId]);

  // ✅ Group Go&Grab items by category for display
  const groupedGoGrabItems = useMemo(() => {
    if (!sortedGoGrabItems || sortedGoGrabItems.length === 0) return [];

    // Create a map from category id to category name
    const categoryNameMap = {};
    foodCategories.forEach((cat) => {
      categoryNameMap[cat.id] = cat.name;
    });

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
      groups[catId].items.sort((a, b) => {
        const percentA = calculateGroupOrderPercentage(a, quantitiesByItemName);
        const percentB = calculateGroupOrderPercentage(b, quantitiesByItemName);
        if (percentB !== percentA) return percentB - percentA; // Descending by percentage
        // If same percentage, sort alphabetically by first English letter, then full name
        const matchA = (a.name || "").match(/[A-Za-z]/);
        const matchB = (b.name || "").match(/[A-Za-z]/);
        const letterA = matchA ? matchA[0].toUpperCase() : "~"; // ~ sorts after Z
        const letterB = matchB ? matchB[0].toUpperCase() : "~";
        if (letterA !== letterB) return letterA.localeCompare(letterB);
        return (a.name || "").localeCompare(b.name || "", undefined, {
          sensitivity: "base",
        });
      });
    });

    return Object.values(groups).sort((a, b) => a.categoryId - b.categoryId);
  }, [sortedGoGrabItems, foodCategories, getMaxCategoryId, quantitiesByItemName]);

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
        .filter(Boolean);
    },
    [kitchen, preOrderItems],
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
            <div className="listing-page-title">More offers from HomeFresh</div>
          </div>

          {/* Kitchen Info */}
          <h2 className="small-title mb-2">
            {kitchen?.name || "Coco&apos;s Kitchen"}
          </h2>

          {/* Go & Grab Section - Grouped by Category */}
          {groupedGoGrabItems.length > 0 && (
            <>
              <h2 className="small-title mb-20">Available Today</h2>
              {groupedGoGrabItems.map((group) => (
                <div key={group.categoryId} className="category-group">
                  <h3 className="category-title">{group.categoryName}</h3>
                  <div className="menu-listing">
                    {group.items.map((food) => {
                      // Compute the letter for this food item (for sidebar scroll targeting)
                      const foodLetterMatch = (food.name || "").match(
                        /[A-Za-z]/,
                      );
                      const foodLetter = foodLetterMatch
                        ? foodLetterMatch[0].toUpperCase()
                        : "#";
                      const cartQty = getMemoizedCartQuantity(food.id);
                      const currentPickupDate = getPickupDate(food.id, false);
                      const currentPickupTime = getPickupTime(food.id, false);
                      return (
                        <div
                          key={food.id}
                          className="menu-list"
                          data-food-letter={foodLetter}
                        >
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
                                src={
                                  food.imageUrl ||
                                  "/src/assets/images/product.png"
                                }
                                alt={food.name}
                                onError={(e) => {
                                  e.target.src =
                                    "/src/assets/images/product.png";
                                }}
                              />
                            </div>
                            <div className="data">
                              <div className="title">{food.name}</div>
                              <div className="text">
                                {food.description || ""}
                              </div>
                              <div className="price-row">
                                <div
                                  className="price"
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <span>$ {food.cost}</span>
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
                              {getMaxCategoryId(food.foodCategory) === 8 &&
                                calculateGroupOrderPercentage(food, quantitiesByItemName) !== null && (
                                  <div
                                    style={{
                                      color: "#e74c3c",
                                      fontSize: "13px",
                                      fontWeight: "700",
                                      marginTop: "4px",
                                    }}
                                  >
                                    Group order filled:{" "}
                                    {calculateGroupOrderPercentage(food, quantitiesByItemName)}%
                                  </div>
                                )}
                              {(() => {
                                const cartItem = getCartItem(food.id);
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
                              {/* Hide DateTimePicker for category 8 items */}
                              {getMaxCategoryId(food.foodCategory) !== 8 && (
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
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
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
                                <span>$ {food.cost}</span>
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
                                    selectedTime={pickupTimes[`${food.id}_preorder`]}
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
