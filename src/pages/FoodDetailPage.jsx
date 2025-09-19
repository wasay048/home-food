import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
// import { showToast } from "../utils/toast";
import ProductImage from "../assets/images/product.png";
import User1 from "../assets/images/user1.svg";
import { useFoodDetailRedux } from "../hooks/useFoodDetailRedux";
import MobileLoader from "../components/Loader/MobileLoader";
import { LazyImage } from "../components/LazyImage/LazyImage";
import StarRating from "../components/StarRating/StarRating";
import {
  debugReviewsQuery,
  testFirestoreConnection,
} from "../services/foodService";
import { QuantitySelector } from "../components/QuantitySelector/QuantitySelector";
// import WeChatAuthDialog from "../components/WeChatAuthDialog/WeChatAuthDialog";
import DateTimePicker from "../components/DateTimePicker/DateTimePicker";
import "../styles/FoodDetailPage.css";
import { clearCart } from "../store/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { useGenericCart } from "../hooks/useGenericCart";
import {
  setListingData,
  setListingLoading,
} from "../store/slices/listingSlice";
import dayjs from "dayjs";
import { useKitchenWithFoods } from "../hooks/useKitchenListing";
import WeChatAuthDialog from "../components/WeChatAuthDialog/WeChatAuthDialog";

// Custom Slider Component
// Enhanced Custom Slider Component with better styling
// Enhanced Custom Slider Component with better styling and error handling
const CustomSlider = ({ food, isLiked }) => {
  console.log("🚀 ~ CustomSlider ~ isLiked:", isLiked);
  // Generate slider images based on food data
  const generateSliderImages = () => {
    // Check if imagesUrl array exists and has images
    console.log("🖼️ [CustomSlider] Checking imagesUrl array:", food);

    if (
      food?.imageUrls &&
      Array.isArray(food.imageUrls) &&
      food.imageUrls.length > 0
    ) {
      console.log(
        "🖼️ [CustomSlider] Using imageUrls array with",
        food.imageUrls.length,
        "images"
      );
      // Use actual food images from imageUrls array
      return food.imageUrls;
    }
    // // Fallback to single imageUrl if imagesUrl doesn't exist
    if (food?.imageUrl && !food?.imageUrls) {
      return [food.imageUrl];
    }
  };

  const sliderImages = generateSliderImages() || []; // Ensure it's always an array
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoSliding, setIsAutoSliding] = useState(true);

  // Auto-slide functionality with proper null checks
  useEffect(() => {
    // Add null checks for sliderImages
    if (!isAutoSliding || !sliderImages || sliderImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
    }, 2000); // 2 seconds

    return () => clearInterval(interval);
  }, [isAutoSliding, sliderImages]); // Remove .length from dependency array

  // Initialize auto-sliding only when we have multiple images
  useEffect(() => {
    if (sliderImages && sliderImages.length > 1) {
      setIsAutoSliding(true);
    }
  }, [sliderImages]);

  // Pause auto-sliding on user interaction
  const pauseAutoSliding = () => {
    setIsAutoSliding(true);
    // Resume after 3 seconds
    setTimeout(() => {
      if (sliderImages && sliderImages.length > 1) {
        setIsAutoSliding(true);
      }
    }, 3000);
  };

  const goToPrevious = () => {
    if (!sliderImages || sliderImages.length === 0) return;
    pauseAutoSliding();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? sliderImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    if (!sliderImages || sliderImages.length === 0) return;
    pauseAutoSliding();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
  };

  const goToSlide = (index) => {
    if (!sliderImages || sliderImages.length === 0) return;
    pauseAutoSliding();
    setCurrentIndex(index);
  };

  // Early return if no images available
  if (!sliderImages || sliderImages.length === 0) {
    return (
      <div className="custom-slider">
        <div className="slider-container">
          <div className="slider-slide">
            <LazyImage
              src={ProductImage}
              alt="No image available"
              fallbackSrc={ProductImage}
              className="slider-image"
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`custom-slider ${isAutoSliding ? "auto-sliding" : ""}`}>
      <div className="slider-container">
        <div
          className="slider-track"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {sliderImages.map((image, index) => (
            <div key={index} className="slider-slide">
              <LazyImage
                src={image}
                alt={`${food?.name || "Food"} Image ${index + 1}`}
                fallbackSrc={ProductImage}
                className="slider-image"
              />
            </div>
          ))}
        </div>

        {/* Heart Icon */}
        {/* <div
          className={`icon heart-icon ${isLiked ? "liked" : ""}`}
          onClick={handleLikeToggle}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.80568 16.3852C9.53252 16.4816 9.08261 16.4816 8.80945 16.3852C6.47955 15.5898 1.27344 12.2717 1.27344 6.64781C1.27344 4.16527 3.27393 2.15674 5.74041 2.15674C7.20262 2.15674 8.49612 2.86374 9.30756 3.95638C10.119 2.86374 11.4205 2.15674 12.8747 2.15674C15.3412 2.15674 17.3417 4.16527 17.3417 6.64781C17.3417 12.2717 12.1356 15.5898 9.80568 16.3852Z"
              stroke={isLiked ? "#FF5555" : "#FF5555"}
              fill={isLiked ? "#FF5555" : "transparent"}
              strokeWidth="1.20512"
            />
          </svg>
        </div> */}

        {/* Previous Button - only show if there are multiple images */}
        {sliderImages.length > 1 && (
          <button
            className="slider-btn slider-prev"
            onClick={goToPrevious}
            aria-label="Previous image"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {/* Next Button - only show if there are multiple images */}
        {sliderImages.length > 1 && (
          <button
            className="slider-btn slider-next"
            onClick={goToNext}
            aria-label="Next image"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M7.5 5L12.5 10L7.5 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}

        {/* Dots Indicator - only show if there are multiple images */}
        {sliderImages.length > 1 && (
          <div className="slider-dots">
            {sliderImages.map((_, index) => (
              <button
                key={index}
                className={`slider-dot ${
                  currentIndex === index ? "active" : ""
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function FoodDetailPage() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { getCartQuantity, handleQuantityChange: handleCartQuantityChange } =
    useGenericCart();

  useEffect(() => {
    localStorage.setItem("detailPage", window.location.href);
  }, []);

  const getPageParams = () => {
    console.log("🔍 [FoodDetailPage] Current pathname:", location.pathname);
    console.log("🔍 [FoodDetailPage] Search params:", searchParams.toString());

    // Handle both "/share" and "/share/" paths
    if (location.pathname === "/share" || location.pathname === "/share/") {
      const params = {
        kitchenId: searchParams.get("kitchenId"),
        foodId: searchParams.get("foodId"),
        selectedDate: searchParams.get("date"),
        toggle: searchParams.get("toggle"),
      };
      console.log("🔍 [FoodDetailPage] Extracted params:", params);
      return params;
    }

    // Fallback return to prevent undefined destructuring
    console.log(
      "🔍 [FoodDetailPage] Using fallback params (pathname not /share)"
    );
    return {
      kitchenId: null,
      foodId: null,
      selectedDate: null,
      toggle: null,
    };
  };

  const { kitchenId, foodId, selectedDate, toggle } = getPageParams();

  if (!kitchenId || !foodId) {
    return (
      <div className="mobile-container">
        <div className="padding-20">
          <div className="alert alert-danger" role="alert">
            <h4>Invalid URL</h4>
            <p>
              Missing required parameters. Please check your link and try again.
            </p>
            <small className="text-muted">
              Expected: kitchenId and foodId{" "}
              {location.pathname === "/share"
                ? "as query parameters"
                : "as URL parameters"}
            </small>
          </div>
        </div>
      </div>
    );
  }

  const { kitchen: fullKitchen, foods: allFoods } =
    useKitchenWithFoods(kitchenId);
  const [activeTab, setActiveTab] = useState("reviews");
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [specialInstructions, setSpecialInstructions] = useState("");

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const currentUser = useSelector((state) => state.auth.user);
  const [showWeChatDialog, setShowWeChatDialog] = useState(false);
  const handleWeChatDialog = (show) => setShowWeChatDialog(show);

  // Date and time picker states
  const [pickupDate, setPickupDate] = useState(
    selectedDate && dayjs(selectedDate, "M/D/YYYY").format("YYYY-MM-DD")
  );
  const [pickupTime, setPickupTime] = useState(null); // Let DateTimePicker set appropriate default

  const [availabilityStatus, setAvailabilityStatus] = useState({
    isAvailable: true,
    quantity: 1,
    orderType: "GO_GRAB",
  });

  const {
    food,
    kitchen,
    likes,
    reviews,
    reviewStats,
    loading,
    error,
    isLiked,
    toggleLike,
  } = useFoodDetailRedux(foodId, kitchenId);

  // Determine order type based on availability and selected date
  const orderType = React.useMemo(() => {
    // Get current availability
    const currentAvailability =
      food?.availability?.numAvailable || food?.numAvailable || 0;

    // PRIORITY: If food has availability > 0, it's Go&Grab regardless of date
    if (currentAvailability > 0 && !selectedDate) {
      console.log(
        "DEBUG - Setting orderType to GO_GRAB due to availability:",
        currentAvailability
      );
      return "GO_GRAB";
    }

    // Only if no availability, check for Pre-Order
    if (selectedDate) {
      console.log(
        "DEBUG - No availability, checking Pre-Order for date:",
        selectedDate
      );
      return "PRE_ORDER";
    }

    // Check if food is in preorder schedule (fallback)
    // if (kitchen?.preorderSchedule?.dates) {
    //   const preorderDates = Object.values(
    //     kitchen.preorderSchedule.dates
    //   ).flat();
    //   const hasPreorder = preorderDates.some(
    //     (item) => item.foodItemId === food?.id
    //   );
    //   if (hasPreorder) {
    //     return "PRE_ORDER";
    //   }
    // }

    return "GO_GRAB"; // Default fallback
  }, [selectedDate, food, kitchen]);

  const cartQuantity = getCartQuantity(
    foodId,
    pickupDate || selectedDate,
    orderType
  );
  // Update handleQuantityChange to use useGenericCart

  console.log("FoodDetailPage data:", {
    food,
    kitchen,
    likes,
    reviews,
    reviewStats,
    loading,
    error,
    selectedDate,
    orderType,
    pickupDate,
    pickupTime,
    urlPattern: location.pathname,
    extractedParams: { kitchenId, foodId, selectedDate },
    kitchenPreorderSchedule: kitchen?.preorderSchedule,
  });

  const getCurrentAvailability = useMemo(() => {
    let currentAvailability = 0;
    // eslint-disable-next-line no-debugger
    debugger;
    if (orderType === "GO_GRAB") {
      // For Go&Grab: Check direct food availability
      currentAvailability =
        food?.availability?.numAvailable ||
        food?.numAvailable ||
        food?.numberOfAvailableItem ||
        0;
    } else if (orderType === "PRE_ORDER") {
      // For Pre-Order: Check availability in kitchen's preorder schedule
      const scheduleForDate = kitchen?.preorderSchedule?.dates?.[pickupDate];
      if (scheduleForDate && Array.isArray(scheduleForDate)) {
        const foodInSchedule = scheduleForDate.find(
          (item) => item.foodItemId === food?.id
        );
        currentAvailability = !foodInSchedule?.isLimitedOrder
          ? foodInSchedule?.numOfAvailableItems || 0
          : 99;
      }
    }

    console.log("🔢 [FoodDetailPage] getCurrentAvailability:", {
      orderType,
      pickupDate,
      foodId: food?.id,
      currentAvailability,
      scheduleExists: !!kitchen?.preorderSchedule?.dates?.[pickupDate],
    });

    return currentAvailability;
  }, [orderType, pickupDate, food, kitchen]);
  console.log("getCurrentAvailability", getCurrentAvailability);
  // Date/Time picker handlers
  // const handleDateChange = useCallback((newDate) => {
  //   // eslint-disable-next-line no-debugger
  //   // debugger;
  //   setPickupDate(newDate);
  //   if (cartQuantity > 0) {
  //     handleCartQuantityChange({
  //       food,
  //       kitchen,
  //       newQuantity: selectedQuantity,
  //       currentQuantity: cartQuantity,
  //       selectedDate: pickupDate,
  //       selectedTime: pickupTime,
  //       specialInstructions,
  //       incomingOrderType: orderType,
  //     });
  //   }
  // }, []);

  // const handleTimeChange = useCallback(
  //   (newTime) => {
  //     setPickupTime(newTime);
  //     console.log("newTime", newTime);
  //     console.log("cartQuantity", cartQuantity);
  //     // eslint-disable-next-line no-debugger
  //     handleCartQuantityChange({
  //       food,
  //       kitchen,
  //       newQuantity: selectedQuantity,
  //       currentQuantity: cartQuantity,
  //       selectedDate: pickupDate,
  //       selectedTime: newTime,
  //       specialInstructions,
  //       incomingOrderType: orderType,
  //     });
  //   },
  //   [pickupTime]
  // );

  const handleAvailabilityChange = useCallback((availabilityData) => {
    setAvailabilityStatus(availabilityData);
  }, []);

  // Update handleAddToCart to use useGenericCart
  // const handleAddToCart = useCallback(() => {
  //   console.log(`[FoodDetailPage] Add to Cart button clicked!`);
  //   console.log(`[FoodDetailPage] Availability status:`, availabilityStatus);
  //   console.log(`[FoodDetailPage] Selected quantity:`, selectedQuantity);
  //   console.log(`[FoodDetailPage] Cart quantity:`, cartQuantity);
  //   console.log(`[FoodDetailPage] Special instructions:`, specialInstructions);

  //   // Check availability
  //   if (!availabilityStatus.isAvailable) {
  //     // showToast.error("This item is currently unavailable");
  //     console.log("This item is currently unavailable");
  //     return;
  //   }

  //   // ✅ IMPROVED: Check if item is already in cart
  //   if (cartQuantity === 0) {
  //     alert("Please use the quantity selector to add items to cart first.");
  //     return;
  //   }

  //   // ✅ NEW: Update special instructions if item is already in cart
  //   if (cartQuantity > 0 && specialInstructions.trim()) {
  //     console.log(
  //       `[FoodDetailPage] Updating special instructions for existing cart item`
  //     );

  //     if (food && kitchen) {
  //       handleCartQuantityChange({
  //         food,
  //         kitchen,
  //         newQuantity: cartQuantity, // Keep same quantity
  //         currentQuantity: cartQuantity,
  //         selectedDate: pickupDate || selectedDate,
  //         selectedTime: pickupTime,
  //         specialInstructions: specialInstructions.trim(),
  //         isPreOrder: orderType === "PRE_ORDER",
  //       });

  //       showToast.success("Special instructions updated!");
  //     }
  //   }

  //   // ✅ SUCCESS: Navigate back to foods page
  //   console.log(`[FoodDetailPage] Navigating back to foods page`);

  //   const currentPageParams = new URLSearchParams({
  //     kitchenId: kitchenId || "",
  //     foodId: foodId || "",
  //     ...(selectedDate && { date: selectedDate }),
  //   }).toString();

  //   navigate("/foods", {
  //     replace: true,
  //     state: {
  //       from: {
  //         pathname: location.pathname,
  //         search: location.search,
  //         fullUrl: `/share?${currentPageParams}`,
  //       },
  //     },
  //   });
  // }, [
  //   availabilityStatus,
  //   cartQuantity,
  //   selectedQuantity,
  //   specialInstructions,
  //   food,
  //   kitchen,
  //   pickupDate,
  //   selectedDate,
  //   pickupTime,
  //   orderType,
  //   handleCartQuantityChange,
  //   kitchenId,
  //   foodId,
  //   navigate,
  //   location,
  // ]);

  // Sync selectedQuantity with cart quantity when cart changes
  useEffect(() => {
    if (cartQuantity > 0) {
      setSelectedQuantity(cartQuantity);
    }
  }, [cartQuantity]);

  // Initialize pickup date from URL parameter
  useEffect(() => {
    if (selectedDate && !pickupDate) {
      setPickupDate(selectedDate);
    }
  }, [selectedDate, pickupDate]);

  useEffect(() => {
    const runDebugTests = async () => {
      console.log("=== DEBUGGING REVIEWS ===");
      console.log(
        "URL params - foodId:",
        foodId,
        "kitchenId:",
        kitchenId,
        "selectedDate:",
        selectedDate
      );

      // Test Firestore connection
      const connectionTest = await testFirestoreConnection();
      console.log("Connection test:", connectionTest);

      // Debug reviews query
      if (foodId) {
        const debugResult = await debugReviewsQuery(foodId);
        console.log("Debug reviews result:", debugResult);
      }
    };

    runDebugTests();
  }, [foodId, kitchenId, selectedDate]);

  console.log("🚀 ~ FoodDetailPage ~ reviewStats:", reviewStats);
  // Use dynamic review stats or fallback to static data
  const displayRating = reviewStats?.averageRating || 0;
  const totalReviewCount = reviewStats?.totalReviews || 0;
  const ratingPercentages = reviewStats?.ratingPercentages || {
    5: 90,
    4: 70,
    3: 40,
    2: 20,
    1: 8,
  };

  // Process reviews for display
  const displayReviews =
    reviews?.length > 0
      ? reviews.map((review) => ({
          id: review.id,
          image: review.userProfile || User1,
          date: review.timeStamp
            ? (() => {
                try {
                  let dateObj;
                  if (typeof review.timeStamp === "string") {
                    if (review.timeStamp.includes(" at ")) {
                      dateObj = new Date(
                        review.timeStamp
                          .replace(" at ", " ")
                          .replace(" UTC+5", "")
                      );
                    } else {
                      dateObj = new Date(review.timeStamp);
                    }
                  } else if (review.timeStamp.seconds) {
                    dateObj = new Date(review.timeStamp.seconds * 1000);
                  } else {
                    dateObj = new Date(review.timeStamp);
                  }
                  return dateObj.toLocaleDateString();
                } catch (error) {
                  console.warn("Error parsing timestamp:", review.timeStamp);
                  return "Unknown date";
                }
              })()
            : "Unknown date",
          name: review.userName || "Anonymous User",
          rating: review.rating || 5,
          description: review.message || "No comment provided",
        }))
      : [];

  const handleLikeToggle = useCallback(() => {
    if (!isAuthenticated && !currentUser) {
      console.log("🔒 Authentication required for placing order");
      localStorage.setItem(
        "page",
        JSON.stringify({
          isDetailPage: true,
          detailPageUrl: window.location.href + "&toggle=like",
        })
      );
      handleWeChatDialog(true);
      return;
    }
    toggleLike();
    console.log(`[FoodDetailPage] Food ${isLiked ? "unliked" : "liked"}`);
  }, [toggleLike, isLiked]);

  useEffect(() => {
    if (toggle === "like") {
      handleLikeToggle();
    }
  }, [toggle]);

  useEffect(() => {
    // Check if user landed directly on this page
    const isDirectLanding =
      !document.referrer || !document.referrer.includes(window.location.origin);

    if (isDirectLanding) {
      console.log("🛒 Clearing cart on direct landing to FoodDetailPage");
      dispatch(clearCart());
    }
  }, [dispatch]);

  // 🆕 SEPARATE useEffect for adding default quantity with proper conditions
  useEffect(() => {
    // Only proceed if we have all required data
    if (!food?.id || !kitchen?.id) {
      return;
    }

    // Check if user landed directly on this page
    const isDirectLanding =
      !document.referrer || !document.referrer.includes(window.location.origin);

    if (isDirectLanding && cartQuantity === 0) {
      console.log(
        "🔄 Direct landing detected - adding default quantity to cart",
        {
          foodId: food.id,
          kitchenId: kitchen.id,
          orderType,
          currentCartQuantity: cartQuantity,
        }
      );

      // Add a flag to prevent multiple executions
      const hasProcessed = sessionStorage.getItem(
        `direct-landing-processed-${food.id}`
      );

      if (!hasProcessed) {
        sessionStorage.setItem(`direct-landing-processed-${food.id}`, "true");
        console.log("getCurrentAvailability", getCurrentAvailability);
        // Use setTimeout to ensure this runs after all other state updates
        const timer = setTimeout(() => {
          handleCartQuantityChange({
            food,
            kitchen,
            newQuantity: getCurrentAvailability === 0 ? 0 : 1, // Default quantity
            currentQuantity: 0,
            selectedDate: pickupDate || dayjs().format("YYYY-MM-DD"),
            selectedTime: null,
            specialInstructions: "",
            incomingOrderType: orderType,
          });
        }, 100); // Small delay to break the update cycle

        return () => {
          clearTimeout(timer);
        };
      }
    }
  }, [food?.id, kitchen?.id, cartQuantity, getCurrentAvailability]); // ✅ Minimal dependencies to prevent infinite loop

  // 🆕 Cleanup sessionStorage when navigating away
  useEffect(() => {
    return () => {
      // Clean up the session storage when component unmounts
      if (food?.id) {
        sessionStorage.removeItem(`direct-landing-processed-${food.id}`);
      }
    };
  }, [food?.id]);

  // Add this useEffect after the existing useEffects to process and store listing data
  useEffect(() => {
    if (!fullKitchen || !allFoods || allFoods.length === 0 || !kitchenId) {
      console.log("[FoodDetailPage] Missing data for listing processing");
      return;
    }

    console.log("[FoodDetailPage] Processing and storing listing data");
    dispatch(setListingLoading(true));

    try {
      // Process Go & Grab items
      const goGrabItems = allFoods.filter((food) => {
        const numAvailable =
          food.availability?.numAvailable || food.numAvailable || 0;
        return numAvailable > 0 && food.kitchenId === kitchenId;
      });

      // Process Pre-Order items
      let preOrderItems = [];
      let availablePreorderDates = [];

      // if (fullKitchen?.preorderSchedule?.dates) {
      //   // Get available preorder dates
      //   const today = dayjs();
      //   const todayStr = today.format("YYYY-MM-DD");

      //   // Generate next 2 days
      //   const nextTwoDays = [];
      //   for (let i = 1; i <= 2; i++) {
      //     const nextDay = today.add(i, "day");
      //     const dateString = nextDay.format("YYYY-MM-DD");
      //     nextTwoDays.push(dateString);
      //   }

      //   // Filter to only include dates in preorder schedule
      //   const availableDateStrings = nextTwoDays.filter((dateStr) => {
      //     const hasSchedule = fullKitchen.preorderSchedule.dates[dateStr];
      //     const isNotToday = dateStr !== todayStr;
      //     return hasSchedule && isNotToday;
      //   });

      //   // Map to display format
      //   availablePreorderDates = availableDateStrings.map((dateString) => {
      //     const date = dayjs(dateString);
      //     return {
      //       dateString,
      //       displayDate: date.format("ddd, MMM D"),
      //       scheduleItems: fullKitchen.preorderSchedule.dates[dateString] || [],
      //     };
      //   });

      //   // Get all food IDs in preorder schedule
      //   const preorderFoodIds = new Set();
      //   Object.values(fullKitchen.preorderSchedule.dates)
      //     .flat()
      //     .forEach((item) => {
      //       preorderFoodIds.add(item.foodItemId);
      //     });

      //   // Filter foods that are in preorder schedule
      //   preOrderItems = allFoods.filter((food) => {
      //     return preorderFoodIds.has(food.id) && food.kitchenId === kitchenId;
      //   });
      // }

      // Dispatch to Redux store

      if (fullKitchen?.preorderSchedule?.dates) {
        // Get today and tomorrow dates
        const today = dayjs();
        const tomorrow = today.add(1, "day");

        const todayStr = today.format("YYYY-MM-DD");
        const tomorrowStr = tomorrow.format("YYYY-MM-DD");

        console.log(
          "📅 [FoodDetailPage] Checking preorder for today and tomorrow:",
          {
            today: todayStr,
            tomorrow: tomorrowStr,
          }
        );

        // Check schedules for both days
        const todaySchedule = fullKitchen.preorderSchedule.dates[todayStr];
        const tomorrowSchedule =
          fullKitchen.preorderSchedule.dates[tomorrowStr];

        // Collect available dates
        availablePreorderDates = [];
        const preorderFoodIds = new Set();

        // Add today's schedule if available
        if (
          todaySchedule &&
          Array.isArray(todaySchedule) &&
          todaySchedule.length > 0
        ) {
          availablePreorderDates.push({
            dateString: todayStr,
            displayDate: `Today, ${today.format("MMM D")}`,
            scheduleItems: todaySchedule,
          });

          console.log("📅 [FoodDetailPage] Today's preorder schedule found:", {
            date: todayStr,
            itemsCount: todaySchedule.length,
            items: todaySchedule.map((item) => ({
              foodItemId: item.foodItemId,
              nameOfFood: item.nameOfFood,
              numOfAvailableItems: item.numOfAvailableItems,
            })),
          });

          // Add today's food IDs
          todaySchedule.forEach((item) => {
            preorderFoodIds.add(item.foodItemId);
          });
        } else {
          console.log(
            "📅 [FoodDetailPage] No preorder schedule found for today"
          );
        }

        // Add tomorrow's schedule if available
        if (
          tomorrowSchedule &&
          Array.isArray(tomorrowSchedule) &&
          tomorrowSchedule.length > 0
        ) {
          availablePreorderDates.push({
            dateString: tomorrowStr,
            displayDate: `Tomorrow, ${tomorrow.format("MMM D")}`,
            scheduleItems: tomorrowSchedule,
          });

          console.log(
            "📅 [FoodDetailPage] Tomorrow's preorder schedule found:",
            {
              date: tomorrowStr,
              itemsCount: tomorrowSchedule.length,
              items: tomorrowSchedule.map((item) => ({
                foodItemId: item.foodItemId,
                nameOfFood: item.nameOfFood,
                numOfAvailableItems: item.numOfAvailableItems,
              })),
            }
          );

          // Add tomorrow's food IDs
          tomorrowSchedule.forEach((item) => {
            preorderFoodIds.add(item.foodItemId);
          });
        } else {
          console.log(
            "📅 [FoodDetailPage] No preorder schedule found for tomorrow"
          );
        }

        // Filter foods that are in either today's or tomorrow's preorder schedule
        if (preorderFoodIds.size > 0) {
          preOrderItems = allFoods.filter((food) => {
            return preorderFoodIds.has(food.id) && food.kitchenId === kitchenId;
          });

          console.log(
            "📅 [FoodDetailPage] Foods available for preorder (today + tomorrow):",
            {
              totalFoodsFound: preOrderItems.length,
              totalDatesAvailable: availablePreorderDates.length,
              foodIds: preOrderItems.map((food) => food.id),
              foodNames: preOrderItems.map((food) => food.name),
              availableDates: availablePreorderDates.map(
                (date) => date.displayDate
              ),
            }
          );
        } else {
          console.log(
            "📅 [FoodDetailPage] No preorder items found for today or tomorrow"
          );
          preOrderItems = [];
        }
      } else {
        console.log(
          "📅 [FoodDetailPage] No preorder schedule found in kitchen data"
        );
        availablePreorderDates = [];
        preOrderItems = [];
      }
      const listingData = {
        goGrabItems,
        preOrderItems,
        availablePreorderDates,
        kitchen: fullKitchen,
      };

      console.log("[FoodDetailPage] Dispatching listing data:", {
        goGrabCount: goGrabItems.length,
        preOrderCount: preOrderItems.length,
        datesCount: availablePreorderDates.length,
      });

      dispatch(setListingData(listingData));

      // Alert for iOS devices
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        console.log(
          "[FoodDetailPage] iOS device detected - listing data stored in Redux"
        );
      }
    } catch (error) {
      console.error("[FoodDetailPage] Error processing listing data:", error);
      dispatch(setListingLoading(false));
    }
  }, [fullKitchen, allFoods, kitchenId, dispatch]);

  useEffect(() => {
    console.log("pickupDate", pickupDate);
    console.log("pickupTime", pickupTime);
  }, [pickupDate, pickupTime]);

  if (loading) {
    return (
      <div className="container">
        <div className="mobile-container">
          <MobileLoader
            isLoading={loading}
            text="Loading food details..."
            overlay={true}
            size="medium"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="mobile-container">
        <div className="product-detail">
          <div className="padding-20">
            <h2 className="title text-center">{food?.name}</h2>
            <h2 className="text text-center">By {food?.kitchenName}</h2>
            <div className="review-info">
              <div className="left flex-0">
                <div>
                  <svg
                    width="15"
                    height="14"
                    viewBox="0 0 15 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M13.7499 4.80322L9.97336 4.26881L8.28761 0.940677C8.12458 0.667862 7.82468 0.5 7.50028 0.5C7.17588 0.5 6.87597 0.667862 6.71295 0.940677L5.02719 4.26966L1.25064 4.80322C0.920725 4.84924 0.64636 5.07363 0.543084 5.38188C0.439808 5.69013 0.525567 6.02868 0.764246 6.25497L3.49628 8.84616L2.85154 12.5053C2.79531 12.8246 2.93026 13.1472 3.19965 13.3375C3.46905 13.5279 3.82617 13.553 4.12089 13.4022L7.50028 11.6739L10.8779 13.4005C11.1726 13.5513 11.5298 13.5262 11.7992 13.3358C12.0685 13.1455 12.2035 12.8229 12.1473 12.5036L11.5025 8.84446L14.2363 6.25497C14.4744 6.02885 14.56 5.69094 14.4572 5.38312C14.3543 5.0753 14.0809 4.85087 13.7517 4.80407L13.7499 4.80322Z"
                      fill="#FBBC04"
                    />
                  </svg>
                </div>
                <div className="text">
                  <strong>{displayRating.toFixed(1)}</strong>
                </div>
              </div>
              <div className="line"></div>
              <div className="left flex-0">
                <div>
                  <svg
                    width="14"
                    height="12"
                    viewBox="0 0 14 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.41337 11.8736C7.18671 11.9536 6.81337 11.9536 6.58671 11.8736C4.65337 11.2136 0.333374 8.46023 0.333374 3.79356C0.333374 1.73356 1.99337 0.0668945 4.04004 0.0668945C5.25337 0.0668945 6.32671 0.653561 7.00004 1.56023C7.67337 0.653561 8.75337 0.0668945 9.96004 0.0668945C12.0067 0.0668945 13.6667 1.73356 13.6667 3.79356C13.6667 8.46023 9.34671 11.2136 7.41337 11.8736Z"
                      fill="#FF5555"
                    />
                  </svg>
                </div>
                <div className="text">
                  <strong>{food?.numOfLike ?? 0}</strong>
                </div>
              </div>
              <div className="line"></div>
              <div className="left flex-0">
                <div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.3067 5.9731C12.86 5.47977 12.1867 5.1931 11.2534 5.0931V4.58644C11.2534 3.6731 10.8667 2.7931 10.1867 2.17977C9.50003 1.5531 8.6067 1.25977 7.68003 1.34644C6.0867 1.49977 4.7467 3.03977 4.7467 4.70644V5.0931C3.81337 5.1931 3.14003 5.47977 2.69337 5.9731C2.0467 6.6931 2.0667 7.6531 2.14003 8.31977L2.6067 12.0331C2.7467 13.3331 3.27337 14.6664 6.14003 14.6664H9.86003C12.7267 14.6664 13.2534 13.3331 13.3934 12.0398L13.86 8.3131C13.9334 7.6531 13.9534 6.6931 13.3067 5.9731ZM7.77337 2.2731C8.44003 2.2131 9.07337 2.41977 9.5667 2.86644C10.0534 3.30644 10.3267 3.9331 10.3267 4.58644V5.0531H5.67337V4.70644C5.67337 3.51977 6.65337 2.37977 7.77337 2.2731ZM8.00003 12.3864C6.6067 12.3864 5.47337 11.2531 5.47337 9.85977C5.47337 8.46644 6.6067 7.3331 8.00003 7.3331C9.39337 7.3331 10.5267 8.46644 10.5267 9.85977C10.5267 11.2531 9.39337 12.3864 8.00003 12.3864Z"
                      fill="#3FC045"
                    />
                    <path
                      d="M7.62 11.0933C7.49334 11.0933 7.36667 11.0466 7.26667 10.9466L6.60667 10.2866C6.41334 10.0933 6.41334 9.7733 6.60667 9.57997C6.8 9.38664 7.12 9.38664 7.31334 9.57997L7.63334 9.89997L8.7 8.9133C8.9 8.72664 9.22 8.73997 9.40667 8.93997C9.59334 9.13997 9.58 9.45997 9.38 9.64664L7.96 10.96C7.86 11.0466 7.74 11.0933 7.62 11.0933Z"
                      fill="#3FC045"
                    />
                  </svg>
                </div>
                <div className="text">
                  <strong>{food?.numOfSoldItem ?? 0}</strong>
                </div>
              </div>
              <div className="line"></div>
              <div className="left">
                <div>
                  <svg
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.1667 6.00016C10.1667 6.92063 9.42051 7.66683 8.50004 7.66683C7.57957 7.66683 6.83337 6.92063 6.83337 6.00016C6.83337 5.07969 7.57957 4.3335 8.50004 4.3335C9.42051 4.3335 10.1667 5.07969 10.1667 6.00016Z"
                      stroke="#3FC045"
                    />
                    <path
                      d="M12.6481 11.3335C13.5778 12.6592 14.0225 13.3652 13.7576 13.9334C13.731 13.9904 13.6999 14.0454 13.6646 14.098C13.2816 14.6668 12.2916 14.6668 10.3118 14.6668H6.68811C4.7083 14.6668 3.71839 14.6668 3.33536 14.098C3.29999 14.0454 3.26888 13.9904 3.24232 13.9334C2.97742 13.3652 3.42213 12.6592 4.35181 11.3335"
                      stroke="#3FC045"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9.33831 11.6626C9.11344 11.8791 8.81291 12.0002 8.50017 12.0002C8.18737 12.0002 7.88684 11.8791 7.66197 11.6626C5.60291 9.66736 2.8435 7.4385 4.18918 4.20265C4.91677 2.45304 6.66333 1.3335 8.50017 1.3335C10.337 1.3335 12.0835 2.45305 12.8111 4.20265C14.1551 7.43443 11.4024 9.67423 9.33831 11.6626Z"
                      stroke="#3FC045"
                    />
                  </svg>
                </div>
                <div className="text">
                  {kitchen?.address || "Unknown location"}
                </div>
              </div>
            </div>

            <CustomSlider
              food={food}
              isLiked={isLiked}
              handleLikeToggle={handleLikeToggle}
            />

            <div className="quantity-warpper">
              <div
                className="price"
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div>
                  <span className="currency">$</span>
                  {food?.cost && parseFloat(food?.cost).toFixed(2)}
                </div>
                {getCurrentAvailability < 4 && (
                  <div className="availability-status">
                    {(() => {
                      if (getCurrentAvailability === 0) {
                        return (
                          <span className="status sold-out">Sold Out</span>
                        );
                      } else if (getCurrentAvailability <= 3) {
                        return (
                          <span className="status low-stock">
                            {getCurrentAvailability} left
                          </span>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}
              </div>

              <QuantitySelector
                food={food}
                kitchen={kitchen}
                selectedDate={
                  pickupDate ||
                  (selectedDate &&
                    dayjs(selectedDate, "M/D/YYYY").format("YYYY-MM-DD"))
                } // Use picker date first, then fallback to URL date
                minQuantity={0}
                onAvailabilityChange={handleAvailabilityChange}
                size="large"
                className="food-detail-quantity"
                orderType={orderType}
              />
            </div>
            {/* <div className="price-quantity-section">
                
              <div className="availability-status">
                {(() => {
                  const currentAvailability =
                    food?.availability?.numAvailable ||
                    food?.numAvailable ||
                    food?.numberOfAvailableItem ||
                    0;

                  console.log(
                    "🔢 [FoodDetailPage] Current availability:",
                    currentAvailability
                  );

                  if (currentAvailability === 0) {
                    return <span className="status sold-out">Sold Out</span>;
                  } else if (currentAvailability <= 3) {
                    return (
                      <span className="status low-stock">
                        {currentAvailability} left
                      </span>
                    );
                  }
                  return null; // Don't show anything if availability is > 3
                })()}
              </div>
            </div> */}
            {/* Dynamic Date Time Picker */}
            <div className="pickup-details">
              <DateTimePicker
                food={food}
                kitchen={kitchen}
                orderType={orderType}
                selectedDate={pickupDate}
                selectedTime={pickupTime}
                onDateChange={(newDate) => {
                  setPickupDate(newDate);
                  handleCartQuantityChange({
                    food,
                    kitchen,
                    newQuantity: selectedQuantity,
                    currentQuantity: cartQuantity,
                    selectedDate: newDate,
                    selectedTime: pickupTime,
                    specialInstructions,
                    incomingOrderType: orderType,
                  });
                }}
                onTimeChange={(newTime) => {
                  setPickupTime(newTime);
                  handleCartQuantityChange({
                    food,
                    kitchen,
                    newQuantity: selectedQuantity,
                    currentQuantity: cartQuantity,
                    selectedDate: pickupDate,
                    selectedTime: newTime,
                    specialInstructions,
                    incomingOrderType: orderType,
                  });
                }}
                disabled={!food || !kitchen}
                className="food-detail-picker"
              />
            </div>
          </div>

          <div className="padding-20">
            <h3 className="small-title mb-8">Special Request</h3>
            {/* <p className="body-text mb-16">
              Please let us know if you are allergic to anything or if we need
              to avoid anything.
            </p> */}
            <textarea
              className="special-instructions-input"
              placeholder="Share you preference or things to avoid (e.g. peanuts, cilantro)."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={2}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                fontSize: "14px",
                fontFamily: "inherit",
                resize: "vertical",
                marginBottom: "10px",
              }}
            />
            <div className="add-to-cart-action mt-2">
              <button
                className={`button text-bold font-size-18`}
                onClick={(e) => {
                  console.log("e", e);
                  // console.log("🔥 BUTTON CLICKED! Event:", e);
                  // console.log(
                  //   "🔥 handleAddToCart type:",
                  //   typeof handleAddToCart
                  // );
                  // if (!availabilityStatus.isAvailable) {
                  //   // alert(
                  //   //   "♡ this food to the chef that we want it! When it is added to Go&Grab or Pre-Order, you will be notified."
                  //   // );
                  //   navigate("/foods", {
                  //     replace: true,
                  //   });
                  // }
                  // handleAddToCart(e);
                  const currentPageParams = new URLSearchParams({
                    kitchenId: kitchenId || "",
                    foodId: foodId || "",
                    ...(selectedDate && { date: selectedDate }),
                  }).toString();
                  navigate("/foods", {
                    replace: true,
                    state: {
                      from: {
                        pathname: location.pathname,
                        search: location.search,
                        fullUrl: `/share?${currentPageParams}`,
                      },
                    },
                  });
                }}
                // disabled={!availabilityStatus.isAvailable}
                style={{ pointerEvents: "auto", fontSize: "18px" }}
              >
                {/* {(() => {
                  if (
                    !availabilityStatus.isAvailable ||
                    getCurrentAvailability === 0
                  ) {
                    return "What else is available?";
                  }
                  return "Add to Cart";
                })()} */}
                Show Me The Menu
              </button>
              {/* <div className="icon">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => {
                    const currentPageParams = new URLSearchParams({
                      kitchenId: kitchenId || "",
                      foodId: foodId || "",
                      ...(selectedDate && { date: selectedDate }),
                    }).toString();
                    navigate("/foods", {
                      replace: true,
                      state: {
                        from: {
                          pathname: location.pathname,
                          search: location.search,
                          fullUrl: `/share?${currentPageParams}`,
                        },
                      },
                    });
                  }}
                >
                  <path
                    d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3 6H21"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div> */}
            </div>
            <div className="custom-accordian">
              <button
                className={`button${
                  activeTab === "description" ? " active" : ""
                }`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={`button${activeTab === "reviews" ? " active" : ""}`}
                onClick={() => setActiveTab("reviews")}
              >
                Reviews
              </button>
            </div>
            <div className="accordian-content">
              {activeTab === "description" && (
                <div className="description-content">
                  {food?.description || "No description available."}
                </div>
              )}
              {activeTab === "reviews" && (
                <div className="reviews-content">
                  <div className="overall-reviews">
                    <div className="left">
                      <div className="bold">
                        {displayRating > 0 ? displayRating.toFixed(1) : "0"}
                      </div>
                      <StarRating
                        rating={displayRating}
                        size="small"
                        showRating={false}
                      />
                      <div className="body-text">
                        ({totalReviewCount}+ reviews)
                      </div>
                    </div>
                    <div className="line"></div>
                    <div className="right">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div className="review" key={rating}>
                          <div className="text">{rating}</div>
                          <div className="progress-bar">
                            <div
                              className="fill"
                              style={{ width: `${ratingPercentages[rating]}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="reviews-list">
                    {displayReviews.map((review, idx) => (
                      <div className="review-item" key={review.id || idx}>
                        <div className="header">
                          <div className="profile">
                            <img
                              src={review.image}
                              alt={review.name}
                              className="image"
                            />
                            <div className="data">
                              <div className="name">{review.name}</div>
                              <div className="rating">
                                <StarRating
                                  rating={review.rating || 5}
                                  size="small"
                                  showRating={false}
                                />
                              </div>
                              <div className="date">{review.date}</div>
                            </div>
                          </div>
                          <div className="icon"></div>
                        </div>
                        <div className="description">{review.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* WeChat Authentication Dialog */}
      {showWeChatDialog && (
        <WeChatAuthDialog onClose={() => handleWeChatDialog(false)} />
      )}
    </div>
  );
}
