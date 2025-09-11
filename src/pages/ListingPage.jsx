import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import qrCode from "../assets/images/home-food-qr.svg";
import { useGenericCart } from "../hooks/useGenericCart";
// import Edit from "../assets/images/edit.svg";
import { QuantitySelector } from "../components/QuantitySelector/QuantitySelector";
import DateTimePicker from "../components/DateTimePicker/DateTimePicker";
import { useSelector } from "react-redux";

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
  } = useSelector((state) => state.listing);

  // Use the generic cart hook for all cart operations
  const { cartItems, getCartQuantity } = useGenericCart();

  // State for managing pickup dates and times for each food item
  const [pickupDates, setPickupDates] = useState({});
  const [pickupTimes, setPickupTimes] = useState({});

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
        "[ListingPage] iOS device detected - using pre-loaded Redux data"
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

  // Date/Time picker handlers
  const handleDateChange = useCallback(
    (foodId, newDate, isPreOrder = false) => {
      const key = isPreOrder ? `${foodId}_preorder` : foodId;
      setPickupDates((prev) => ({
        ...prev,
        [key]: newDate,
      }));
      console.log(`[ListingPage] Date changed for ${key}:`, newDate);
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
      console.log(`[ListingPage] Time changed for ${key}:`, newTime);
    },
    []
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
            (f) => f.id === scheduleItem.foodItemId
          );
          return food ? { ...food, scheduleItem } : null;
        })
        .filter(Boolean);
    },
    [kitchen, preOrderItems]
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
            getCartQuantity(food.id, dateInfo.dateString)
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
    [cartQuantities]
  );

  // if (error) {
  //   return (
  //     <div className="container">
  //       <div className="mobile-container">
  //         <div className="padding-20">
  //           <div className="text-center py-5 text-danger">Error: {error}</div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // // Show loader if still loading OR if data is not ready
  // if (loading) {
  //   return (
  //     <div className="container">
  //       <div className="mobile-container">
  //         <MobileLoader
  //           isLoading={true}
  //           text="Loading menu items..."
  //           overlay={true}
  //           size="medium"
  //         />
  //       </div>
  //     </div>
  //   );
  // }
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
            <div className="listing-page-title">More offers from HomeFresh</div>
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
                  const cartQty = getMemoizedCartQuantity(food.id);
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
                            minQuantity={0}
                            orderType={"GO_GRAB"}
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
                              minQuantity={0}
                              orderType={"PRE_ORDER"}
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
          <button
            className="action-button mb-16"
            onClick={() => {
              if (cartItems.length === 0) {
                alert(
                  "Oops! Your cart is empty. Add something delicious to get started."
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
              <img src={qrCode} alt="QR Code" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
