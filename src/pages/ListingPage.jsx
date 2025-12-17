import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import qrCode from "../assets/images/home-food-qr.svg";
import scooterRider from "../assets/scooter-rider.png";
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
  const { cartItems, getCartQuantity, getCartItem } = useGenericCart();

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
            (f) => f.id === scheduleItem.foodItemId
          );
          return food ? { ...food, scheduleItem } : null;
        })
        .filter(Boolean);
    },
    [kitchen, preOrderItems]
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
              item.selectedDate === dateInfo.dateString
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

  useEffect(() => {
    console.log("pickeup pickupDates updated:", pickupDates);
    console.log("pickeup pickupTimes updated time:", pickupTimes);
  }, [pickupDates, pickupTimes]);

  console.log(
    "Rendering ListingPage with state:",
    cartItems.map((item) => item.foodId)
  );

  const getPickupDate = useCallback(
    (foodId, isPreOrder = false, fallbackDate = null) => {
      const key = isPreOrder ? `${foodId}_preorder` : foodId;
      return pickupDates[key] || fallbackDate;
    },
    [pickupDates]
  );

  // ✅ ENHANCED: Helper function to get pickup time
  const getPickupTime = useCallback(
    (foodId, isPreOrder = false) => {
      const key = isPreOrder ? `${foodId}_preorder` : foodId;
      return pickupTimes[key] || null;
    },
    [pickupTimes]
  );

  useEffect(() => {
    console.log("🗓️ [ListingPage] Pickup dates updated:", pickupDates);
    console.log("⏰ [ListingPage] Pickup times updated:", pickupTimes);
  }, [pickupDates, pickupTimes]);

  console.log(
    "Rendering ListingPage with state:",
    cartItems.map((item) => item.foodId)
  );
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
                  const currentPickupDate = getPickupDate(food.id, false);
                  const currentPickupTime = getPickupTime(food.id, false);
                  return (
                    <div key={food.id} className="menu-list">
                      <div
                        className="left"
                        onClick={() =>
                          window.open(
                            `/share?kitchenId=${kitchen?.id}&foodId=${food.id}`,
                            "_blank"
                          )
                        }
                        style={{ cursor: "pointer" }}
                      >
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
                          {(() => {
                            const cartItem = getCartItem(food.id);
                            return cartItem?.specialInstructions ? (
                              <div className="text" style={{ marginTop: "4px", fontStyle: "italic" }}>
                                Special Instruction: {cartItem.specialInstructions}
                              </div>
                            ) : null;
                          })()}
                        </div>
                      </div>

                      <div className="quantity-warpper">
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
                        <div className="pickup-time-section">
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
                    const currentPickupDate = getPickupDate(
                      food.id,
                      true,
                      dateInfo.dateString
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
                                "M/D/YYYY"
                              )}`,
                              "_blank"
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
                            <div className="text">
                              {food.description ||
                                "This dish features tender, juicy flavors"}
                            </div>
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
                            {(() => {
                              const cartItem = cartItems.find(
                                (item) =>
                                  item.foodId === food.id &&
                                  item.selectedDate === dateInfo.dateString
                              );
                              return cartItem?.specialInstructions ? (
                                <div className="text" style={{ marginTop: "4px", fontStyle: "italic" }}>
                                  Special Instruction: {cartItem.specialInstructions}
                                </div>
                              ) : null;
                            })()}
                          </div>
                        </div>

                        <div className="quantity-warpper">
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
                          <div className="pickup-time-section">
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
