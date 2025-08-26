import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import qrCode from "../assets/images/home-food-qr.svg";
import dayjs from "dayjs";
import {
  useKitchenWithFoods,
  useAllKitchensWithFoods,
} from "../hooks/useKitchenListing";
import { useGenericCart } from "../hooks/useGenericCart";
// import Edit from "../assets/images/edit.svg";
import QuantitySelector from "../components/QuantitySelector/QuantitySelector";
import MobileLoader from "../components/Loader/MobileLoader";
import DateTimePicker from "../components/DateTimePicker/DateTimePicker";

export default function ListingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { kitchenId } = useParams(); // Get kitchenId from URL if available

  // Function to go back to previous page in history
  const handleGoBack = () => {
    // Check if we have state from FoodDetailPage with the exact params
    if (location.state?.from?.fullUrl) {
      console.log(
        "Going back to FoodDetailPage with params:",
        location.state.from.fullUrl
      );
      navigate(location.state.from.fullUrl);
      return;
    }

    // Check if we have any location state indicating where we came from
    if (location.state?.from?.pathname) {
      console.log(
        "Going back to:",
        location.state.from.pathname + (location.state.from.search || "")
      );
      navigate(
        location.state.from.pathname + (location.state.from.search || "")
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

  // Use the generic cart hook for all cart operations
  const { cartItems, getCartQuantity, handleQuantityChange } = useGenericCart();

  // State for managing pickup dates and times for each food item
  const [pickupDates, setPickupDates] = useState({});
  const [pickupTimes, setPickupTimes] = useState({});

  // Get the current kitchen ID from the food data (using the first food item)
  const { allFoods: allFoodsFromAllKitchens } = useAllKitchensWithFoods(10);
  const currentKitchenId =
    kitchenId ||
    (allFoodsFromAllKitchens.length > 0
      ? allFoodsFromAllKitchens[0].kitchenId
      : null);

  // Get specific kitchen data using the determined kitchen ID
  const { kitchen, foods, loading, error } =
    useKitchenWithFoods(currentKitchenId);
  console.log("🚀 ~ ListingPage ~ foods:", foods);

  // Debug logging
  useEffect(() => {
    if (kitchen && foods.length > 0) {
      console.log("[ListingPage] Kitchen data:", kitchen);
      console.log("[ListingPage] Foods data:", foods);
      console.log("[ListingPage] Preorder schedule:", kitchen.preorderSchedule);
    }
  }, [kitchen, foods]);

  // Helper function to get available preorder dates from kitchen schedule
  const getAvailablePreorderDates = () => {
    if (!kitchen?.preorderSchedule?.dates) return [];

    // Use dayjs for reliable date handling
    const today = dayjs();
    const todayStr = today.format("YYYY-MM-DD");

    console.log(
      "🔥🔥🔥 [PREORDER DATES DEBUG] Using dayjs - Current date (today):",
      todayStr
    );
    console.log(
      "🔥🔥🔥 [PREORDER DATES DEBUG] Raw dayjs object:",
      today.toString()
    );

    // Generate the next 2 days after today using dayjs
    const nextTwoDays = [];
    for (let i = 1; i <= 2; i++) {
      const nextDay = today.add(i, "day");
      const dateString = nextDay.format("YYYY-MM-DD");
      nextTwoDays.push(dateString);
    }

    console.log(
      "🔥🔥🔥 [PREORDER DATES DEBUG] Next 2 days after today (should be 2025-08-23, 2025-08-24):",
      nextTwoDays
    );
    console.log(
      "🔥🔥🔥 [PREORDER DATES DEBUG] All dates in preorder schedule:",
      Object.keys(kitchen.preorderSchedule.dates)
    );

    // Filter to only include dates that exist in the preorder schedule AND are in our next 2 days
    // EXPLICITLY exclude today's date
    const availableDates = nextTwoDays.filter((dateStr) => {
      const hasSchedule = kitchen.preorderSchedule.dates[dateStr];
      const isNotToday = dateStr !== todayStr;
      console.log(
        `🔥🔥🔥 [PREORDER DATES DEBUG] Date ${dateStr}: has schedule=${!!hasSchedule}, is not today=${isNotToday}, today is=${todayStr}`
      );
      return hasSchedule && isNotToday;
    });

    console.log(
      "🔥🔥🔥 [PREORDER DATES DEBUG] Final available preorder dates (should only be 23 & 24):",
      availableDates
    );

    const finalResult = availableDates.map((dateString) => {
      const date = dayjs(dateString);
      const displayDate = date.format("ddd, MMM D");
      console.log(
        `🔥🔥🔥 [PREORDER DATES DEBUG] Mapping ${dateString} to display: ${displayDate}`
      );
      return {
        dateString,
        displayDate,
      };
    });

    console.log(
      "🔥🔥🔥 [PREORDER DATES DEBUG] Final result returned:",
      finalResult
    );
    return finalResult;
  };

  // Separate foods into Go & Grab and Pre-order items
  const { goGrabItems, preOrderItems } = useMemo(() => {
    if (!foods.length) {
      return { goGrabItems: [], preOrderItems: [] };
    }

    // Filter foods to only include items from current kitchen
    const currentKitchenFoods = foods.filter(
      (food) => food.kitchenId === currentKitchenId
    );

    console.log(
      "[ListingPage] All foods for current kitchen:",
      currentKitchenFoods
    );

    // Go & Grab: items with numAvailable > 0 (check both possible locations)
    const goGrab = currentKitchenFoods.filter((food) => {
      const numAvailable =
        food.availability?.numAvailable || food.numAvailable || 0;
      console.log(
        `[ListingPage] ${food.name} - numAvailable: ${numAvailable} (from ${
          food.availability?.numAvailable ? "availability" : "direct"
        })`
      );
      return numAvailable > 0;
    });

    // Pre-order: items that are in preorder schedule (regardless of current availability)
    let preOrder = [];
    if (kitchen?.preorderSchedule?.dates) {
      const preorderDates = kitchen.preorderSchedule.dates;
      const preorderFoodIds = new Set();

      // Get all food IDs that appear in any preorder schedule
      Object.values(preorderDates)
        .flat()
        .forEach((item) => {
          preorderFoodIds.add(item.foodItemId);
        });

      console.log(
        "[ListingPage] Preorder food IDs from schedule:",
        Array.from(preorderFoodIds)
      );

      // Include all foods that are in preorder schedule
      preOrder = currentKitchenFoods.filter((food) => {
        const isInPreorder = preorderFoodIds.has(food.id);
        console.log(
          `[ListingPage] ${food.name} (${food.id}) - in preorder: ${isInPreorder}`
        );
        return isInPreorder;
      });
    }

    console.log(
      `[ListingPage] Kitchen: ${currentKitchenId}, Total Foods: ${currentKitchenFoods.length}, Go&Grab: ${goGrab.length}, Pre-order: ${preOrder.length}`
    );
    console.log(
      "[ListingPage] Go&Grab items:",
      goGrab.map((f) => ({
        id: f.id,
        name: f.name,
        numAvailable: f.availability?.numAvailable || f.numAvailable,
      }))
    );
    console.log(
      "[ListingPage] Pre-order items:",
      preOrder.map((f) => ({ id: f.id, name: f.name }))
    );

    return { goGrabItems: goGrab, preOrderItems: preOrder };
  }, [foods, kitchen, currentKitchenId]);
  console.log("🚀 ~ ListingPage ~ goGrabItems:", goGrabItems);
  console.log("🚀 ~ ListingPage ~ preOrderItems:", preOrderItems);

  // Date/Time picker handlers
  const handleDateChange = useCallback(
    (foodId, newDate, isPreOrder = false) => {
      const key = isPreOrder ? `${foodId}_preorder` : foodId;
      setPickupDates((prev) => ({
        ...prev,
        [key]: newDate,
      }));
      console.log("📅 [ListingPage] Date changed:", {
        foodId,
        newDate,
        isPreOrder,
      });
    },
    []
  );

  const handleTimeChange = useCallback(
    (foodId, newTime, isPreOrder = false) => {
      const key = isPreOrder ? `${foodId}_preorder` : foodId;
      setPickupTimes((prev) => ({
        ...prev,
        [key]: newTime,
      }));
      console.log("⏰ [ListingPage] Time changed:", {
        foodId,
        newTime,
        isPreOrder,
      });
    },
    []
  );

  // Get preorder items for a specific date
  const getPreOrderItemsForDate = (dateString) => {
    if (!kitchen?.preorderSchedule?.dates?.[dateString]) return [];

    const scheduleItems = kitchen.preorderSchedule.dates[dateString];
    return scheduleItems
      .map((scheduleItem) => {
        const food = preOrderItems.find(
          (f) => f.id === scheduleItem.foodItemId
        );
        return food ? { ...food, scheduleItem } : null;
      })
      .filter(Boolean);
  };

  const availablePreorderDates = getAvailablePreorderDates();

  // Check if data is fully loaded
  const isDataLoaded = !loading && kitchen && foods.length > 0;

  if (error) {
    return (
      <div className="container">
        <div className="mobile-container">
          <div className="padding-20">
            <div className="text-center py-5 text-danger">Error: {error}</div>
          </div>
        </div>
      </div>
    );
  }

  // Show loader if still loading OR if data is not ready
  if (loading || !isDataLoaded) {
    return (
      <div className="container">
        <div className="mobile-container">
          <MobileLoader
            isLoading={true}
            text="Loading menu items..."
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
            <div className="title">More offers from HomeFresh</div>
          </div>

          {/* Kitchen Info */}
          <h2 className="small-title mb-2">
            {kitchen?.name || "Coco&apos;s Kitchen"}
          </h2>

          {/* Go & Grab Section */}
          {goGrabItems.length > 0 && (
            <>
              <h2 className="small-title mb-20">Grab & Go</h2>
              <div className="menu-listing">
                {goGrabItems.map((food) => {
                  const cartQty = getCartQuantity(food.id);
                  return (
                    <div key={food.id} className="menu-list">
                      <div className="left">
                        <div className="image">
                          <img
                            src={
                              food.imageUrl || "/src/assets/images/product.png"
                            }
                            alt={food.name}
                            onError={(e) => {
                              e.target.src = "/src/assets/images/product.png";
                            }}
                          />
                        </div>
                        <div className="data">
                          <div className="title">{food.name}</div>
                          <div className="text">
                            {food.description ||
                              "This dish features tender, juicy flavors"}
                          </div>
                          <div className="price">$ {food.cost}</div>
                        </div>
                      </div>

                      <div className="quantity-warpper">
                        <div className="right mb-1">
                          <QuantitySelector
                            food={food}
                            kitchen={kitchen}
                            selectedDate={null}
                            size="small"
                            initialQuantity={cartQty}
                            onQuantityChange={async (newQuantity) => {
                              const currentQty = getCartQuantity(food.id);
                              const selectedDate = pickupDates[food.id];
                              const selectedTime = pickupTimes[food.id];
                              const isToday = selectedDate
                                ? dayjs(selectedDate).isSame(dayjs(), "day")
                                : true;

                              await handleQuantityChange({
                                food,
                                kitchen,
                                newQuantity,
                                currentQuantity: currentQty,
                                selectedDate: selectedDate,
                                selectedTime: selectedTime,
                                specialInstructions: "",
                                isPreOrder: !isToday,
                              });
                            }}
                          />
                        </div>
                        <div className="pickup-time-section">
                          <DateTimePicker
                            food={food}
                            kitchen={kitchen}
                            orderType="GO_GRAB"
                            selectedDate={pickupDates[food.id]}
                            selectedTime={pickupTimes[food.id]}
                            onDateChange={(newDate) =>
                              handleDateChange(food.id, newDate, false)
                            }
                            onTimeChange={(newTime) =>
                              handleTimeChange(food.id, newTime, false)
                            }
                            disabled={!food || !kitchen}
                            className="listing-page-picker"
                            dateLabel=""
                            timeLabel=""
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Pre-order Sections */}
          {availablePreorderDates.map((dateInfo) => {
            const preOrderItemsForDate = getPreOrderItemsForDate(
              dateInfo.dateString
            );

            if (preOrderItemsForDate.length === 0) return null;

            return (
              <div key={dateInfo.dateString}>
                <h2 className="small-title mb-16">
                  Pre-order for {dateInfo.displayDate}
                </h2>
                <div className="menu-listing">
                  {preOrderItemsForDate.map((food) => {
                    const cartQty = getCartQuantity(
                      food.id,
                      dateInfo.dateString
                    );
                    // const availableTimes = food.scheduleItem
                    //   ?.availableTimes || ["6:22 PM"];

                    return (
                      <div
                        key={`${food.id}-${dateInfo.dateString}`}
                        className="menu-list"
                      >
                        <div className="left">
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
                            <div className="text">
                              {food.description ||
                                "This dish features tender, juicy flavors"}
                            </div>
                            <div className="price">$ {food.cost}</div>
                          </div>
                        </div>

                        <div className="quantity-warpper">
                          <div className="right mb-1">
                            <QuantitySelector
                              food={food}
                              kitchen={kitchen}
                              selectedDate={dateInfo.dateString}
                              size="small"
                              initialQuantity={cartQty}
                              onQuantityChange={async (newQuantity) => {
                                const currentQty = getCartQuantity(
                                  food.id,
                                  dateInfo.dateString
                                );
                                const selectedTime =
                                  pickupTimes[`${food.id}_preorder`];

                                await handleQuantityChange({
                                  food,
                                  kitchen,
                                  newQuantity,
                                  currentQuantity: currentQty,
                                  selectedDate: dateInfo.dateString,
                                  selectedTime: selectedTime,
                                  specialInstructions: "",
                                  isPreOrder: true,
                                });
                              }}
                            />
                          </div>
                          <div className="pickup-time-section">
                            <DateTimePicker
                              food={food}
                              kitchen={kitchen}
                              orderType="PRE_ORDER"
                              selectedDate={
                                pickupDates[`${food.id}_preorder`] ||
                                dateInfo.dateString
                              }
                              selectedTime={pickupTimes[`${food.id}_preorder`]}
                              onDateChange={(newDate) =>
                                handleDateChange(food.id, newDate, true)
                              }
                              onTimeChange={(newTime) =>
                                handleTimeChange(food.id, newTime, true)
                              }
                              disabled={!food || !kitchen}
                              className="listing-page-picker"
                              dateLabel=""
                              timeLabel=""
                            />
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
          {cartItems.length > 0 && (
            <button
              className="action-button mb-16"
              onClick={() => navigate("/order")}
            >
              Continue to View Cart
            </button>
          )}

          {/* QR Code Section */}
          <div className="scanner-bottom mb-16">
            <div className="text">
              Full menus from your local home kitchens can be found in the
              HomeFresh app, available in the iOS App Store.
            </div>
            <div className="qr">
              <img src={qrCode} alt="QR Code" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
