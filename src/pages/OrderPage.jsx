import React, { useMemo, useState, useCallback, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import {
  clearCart,
  updatePickupDetailsLocally,
} from "../store/slices/cartSlice";
import { showToast } from "../utils/toast";
import QuantitySelector from "../components/QuantitySelector/QuantitySelector";
import DateTimePicker from "../components/DateTimePicker/DateTimePicker";
import Edit from "../assets/images/edit.svg";
import { useKitchenWithFoods } from "../hooks/useKitchenListing";
import { useGenericCart } from "../hooks/useGenericCart";

export default function OrderPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // Get cart items from Redux
  const cartItems = useSelector((state) => state.cart.items);

  // Use generic cart hook for reliable quantity updates
  const { handleQuantityChange } = useGenericCart();

  // State for tracking which items are in edit mode for pickup date/time
  const [editModeItems, setEditModeItems] = useState(new Set());
  const [tempPickupDates, setTempPickupDates] = useState({});
  const [tempPickupTimes, setTempPickupTimes] = useState({});

  // Handle navigation from PaymentPage edit functionality
  useEffect(() => {
    if (location.state?.editItem) {
      const itemToEdit = location.state.editItem;
      setEditModeItems(new Set([itemToEdit]));

      // Clear the location state to prevent re-triggering
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Get kitchen data for availability information
  const kitchenId = cartItems.length > 0 ? cartItems[0].kitchenId : null;
  const {
    kitchen,
    foods,
    loading: kitchenLoading,
  } = useKitchenWithFoods(kitchenId);

  // Debug logging
  console.log("OrderPage - Kitchen data:", {
    kitchenId,
    hasKitchen: !!kitchen,
    foodsCount: foods.length,
    kitchenLoading,
  });

  // Create a map of food data for quick lookup
  const foodDataMap = useMemo(() => {
    const map = new Map();
    foods.forEach((food) => {
      map.set(food.id, food);
    });
    return map;
  }, [foods]);

  // Helper function to get enriched food data with availability
  const getEnrichedFoodData = (cartItem) => {
    const fullFoodData = foodDataMap.get(cartItem.foodId);

    console.log(`OrderPage - Getting food data for ${cartItem.foodId}:`, {
      hasFullData: !!fullFoodData,
      fullFoodData: fullFoodData
        ? {
            id: fullFoodData.id,
            name: fullFoodData.name,
            availability: fullFoodData.availability,
            numAvailable: fullFoodData.numAvailable,
          }
        : null,
    });

    if (fullFoodData) {
      // Return full food data from kitchen with actual availability
      return fullFoodData;
    }

    // Fallback: create food object from cart item data
    const fallbackData = {
      id: cartItem.foodId,
      name: cartItem.food?.name,
      cost: cartItem.food?.cost,
      imageUrl: cartItem.food?.imageUrl,
      kitchenId: cartItem.kitchenId,
      description: cartItem.food?.description,
      // Default availability - will show "Add to cart" without restrictions
      availability: { numAvailable: 99 },
      numAvailable: 99,
    };

    console.log(
      `OrderPage - Using fallback data for ${cartItem.foodId}:`,
      fallbackData
    );
    return fallbackData;
  };

  // Group cart items by type and date
  const groupedCartItems = useMemo(() => {
    const groups = {
      grabAndGo: [],
      preOrders: {},
    };

    cartItems.forEach((item) => {
      // Determine order type: Go&Grab vs Pre-Order
      // Priority: pickupDetails.orderType > orderType > isPreOrder flag > selectedDate presence
      const orderType =
        item.pickupDetails?.orderType ||
        item.orderType ||
        (item.isPreOrder ? "PRE_ORDER" : "GO_GRAB");

      if (orderType === "GO_GRAB") {
        // Go&Grab items - immediate pickup today
        groups.grabAndGo.push({
          ...item,
          // Ensure we have pickup details for display
          displayPickupTime: item.pickupDetails?.display || "Pick up today",
          displayPickupClock:
            item.pickupDetails?.time ||
            dayjs().add(30, "minutes").format("h:mm A"),
        });
      } else if (
        orderType === "PRE_ORDER" ||
        item.isPreOrder ||
        item.selectedDate
      ) {
        // Pre-Order items - scheduled pickup on specific dates
        const dateKey = item.selectedDate || item.pickupDetails?.date;
        if (dateKey) {
          if (!groups.preOrders[dateKey]) {
            groups.preOrders[dateKey] = [];
          }
          groups.preOrders[dateKey].push({
            ...item,
            // Ensure we have pickup details for display
            displayPickupTime:
              item.pickupDetails?.display ||
              `Pick up ${dayjs(dateKey).format("MMM D ddd")}`,
            displayPickupClock: item.pickupDetails?.time || "6:30 PM",
          });
        }
      } else {
        // Fallback: if no clear classification, treat as Go&Grab
        groups.grabAndGo.push({
          ...item,
          displayPickupTime: item.pickupDetails?.display || "Pick up today",
          displayPickupClock:
            item.pickupDetails?.time ||
            dayjs().add(30, "minutes").format("h:mm A"),
        });
      }
    });

    // Sort preOrder dates to ensure consistent ordering
    const sortedPreOrders = {};
    Object.keys(groups.preOrders)
      .sort((a, b) => dayjs(a).diff(dayjs(b)))
      .forEach((date) => {
        sortedPreOrders[date] = groups.preOrders[date];
      });
    groups.preOrders = sortedPreOrders;

    return groups;
  }, [cartItems]);

  // Calculate totals with enhanced price data
  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((total, item) => {
      // Try to get the most accurate price data
      const enrichedFood = foodDataMap.get(item.foodId);
      const cost = enrichedFood?.cost || item.food?.cost || 0;
      const numericCost = typeof cost === "string" ? parseFloat(cost) : cost;

      console.log(`OrderPage - Pricing calculation for ${item.foodId}:`, {
        itemName: item.food?.name,
        quantity: item.quantity,
        originalCost: item.food?.cost,
        enrichedCost: enrichedFood?.cost,
        finalCost: numericCost,
        lineTotal: numericCost * item.quantity,
      });

      return total + numericCost * item.quantity;
    }, 0);

    const tax = subtotal * 0.0725; // 7.25% tax rate
    const total = subtotal + tax;

    console.log("OrderPage - Total calculation:", {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      cartItemsCount: cartItems.length,
    });

    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
    };
  }, [cartItems, foodDataMap]);

  // Helper to get cart quantity for a food item
  const getCartQuantity = (foodId, selectedDate = null) => {
    return cartItems
      .filter(
        (item) =>
          item.foodId === foodId &&
          (!selectedDate || item.selectedDate === selectedDate)
      )
      .reduce((total, item) => total + item.quantity, 0);
  };

  // Handle remove all
  const handleRemoveAll = () => {
    dispatch(clearCart());
    showToast.info("Cart cleared successfully");
  };

  // Format date for display
  const formatDate = (dateString) => {
    return dayjs(dateString).format("MMM D ddd");
  };

  // Handler functions for edit mode
  const handleEditClick = useCallback(
    (itemKey) => {
      setEditModeItems((prev) => new Set([...prev, itemKey]));

      // Initialize temp values with current cart item values
      const item = cartItems.find(
        (item) => `${item.foodId}-${item.selectedDate || "grab"}` === itemKey
      );

      if (item) {
        setTempPickupDates((prev) => ({
          ...prev,
          [itemKey]: item.selectedDate || dayjs().format("YYYY-MM-DD"),
        }));
        setTempPickupTimes((prev) => ({
          ...prev,
          [itemKey]:
            item.pickupDetails?.time ||
            dayjs().add(30, "minute").format("HH:mm"),
        }));
      }
    },
    [cartItems]
  );

  const handleCancelEdit = useCallback((itemKey) => {
    setEditModeItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(itemKey);
      return newSet;
    });

    // Clear temp values
    setTempPickupDates((prev) => {
      const newDates = { ...prev };
      delete newDates[itemKey];
      return newDates;
    });
    setTempPickupTimes((prev) => {
      const newTimes = { ...prev };
      delete newTimes[itemKey];
      return newTimes;
    });
  }, []);

  const handleSaveEdit = useCallback(
    (itemKey) => {
      const newDate = tempPickupDates[itemKey];
      const newTime = tempPickupTimes[itemKey];

      if (newDate && newTime) {
        // Determine order type based on date
        const isToday = dayjs(newDate).isSame(dayjs(), "day");
        const orderType = isToday ? "Go&Grab" : "Pre-Order";

        // Update Redux store with new pickup details
        dispatch(
          updatePickupDetailsLocally({
            cartItemId: itemKey,
            pickupDetails: {
              date: newDate,
              time: newTime,
              display: `${dayjs(newDate).format("MMM DD, YYYY")} at ${newTime}`,
              orderType: orderType,
            },
          })
        );

        console.log("Saving pickup details for item:", itemKey, {
          date: newDate,
          time: newTime,
          orderType: orderType,
        });
      }

      // Exit edit mode
      setEditModeItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });

      showToast.success("Pickup time updated successfully");

      // If we came from PaymentPage, navigate back after a short delay
      if (location.state?.returnTo === "/payment") {
        setTimeout(() => {
          navigate("/payment");
        }, 1000); // Give time for toast to show
      }
    },
    [tempPickupDates, tempPickupTimes, dispatch, location.state, navigate]
  );

  const handleDateChange = useCallback((itemKey, newDate) => {
    setTempPickupDates((prev) => ({
      ...prev,
      [itemKey]: newDate,
    }));
  }, []);

  const handleTimeChange = useCallback((itemKey, newTime) => {
    setTempPickupTimes((prev) => ({
      ...prev,
      [itemKey]: newTime,
    }));
  }, []);

  const totalItemsCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div className="container">
      <div className="mobile-container">
        <div className="padding-20">
          <div className="back-link-title">
            <Link className="back-link" to="/foods">
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
            </Link>
            <div className="title">
              Order ({totalItemsCount} Item{totalItemsCount !== 1 ? "s" : ""})
            </div>
          </div>

          {/* Kitchen Info */}
          {cartItems.length > 0 && cartItems[0].kitchen && (
            <h2 className="small-title mb-2">{cartItems[0].kitchen.name}</h2>
          )}

          {cartItems.length === 0 ? (
            <div className="text-center py-5">
              <p>Your cart is empty</p>
              <Link
                to="/foods"
                className="action-button"
                style={{
                  textDecoration: "none",
                  display: "inline-block",
                  padding: "12px 24px",
                  marginTop: "16px",
                }}
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              {/* Go&Grab Section - Show first if items exist */}
              {groupedCartItems.grabAndGo.length > 0 && (
                <>
                  <h2 className="small-title mb-20">Go&Grab</h2>
                  <div className="menu-listing">
                    {groupedCartItems.grabAndGo.map((item, index) => {
                      const cartQty = getCartQuantity(item.foodId);
                      return (
                        <div
                          key={`grab-${item.foodId}-${index}`}
                          className="menu-list"
                        >
                          <div className="left">
                            <div className="image">
                              <img
                                src={
                                  item.food?.imageUrl ||
                                  "/src/assets/images/product.png"
                                }
                                alt={item.food?.name || "Food item"}
                                onError={(e) => {
                                  e.target.src =
                                    "/src/assets/images/product.png";
                                }}
                              />
                            </div>
                            <div className="data">
                              <div className="title">
                                {item.food?.name || "Unknown Item"}
                              </div>
                              <div className="text">
                                {item.food?.description ||
                                  "This dish features tender, juicy flavors"}
                              </div>
                              <div className="price">
                                $ {item.food?.cost || "0.00"}
                              </div>
                            </div>
                          </div>

                          <div className="quantity-warpper">
                            <div className="right mb-1">
                              <QuantitySelector
                                food={getEnrichedFoodData(item)}
                                kitchen={kitchen || item.kitchen}
                                selectedDate={null}
                                size="small"
                                initialQuantity={cartQty}
                                onQuantityChange={async (newQuantity) => {
                                  const currentQty = getCartQuantity(
                                    item.foodId
                                  );
                                  const enrichedFood =
                                    getEnrichedFoodData(item);

                                  await handleQuantityChange({
                                    food: enrichedFood,
                                    kitchen: kitchen || item.kitchen,
                                    newQuantity,
                                    currentQuantity: currentQty,
                                    selectedDate: null,
                                    specialInstructions:
                                      item.specialInstructions || "",
                                    isPreOrder: false,
                                  });
                                }}
                              />
                            </div>
                            {(() => {
                              const itemKey = `${item.foodId}-grab`;
                              const isInEditMode = editModeItems.has(itemKey);

                              if (isInEditMode) {
                                return (
                                  <div className="pickup-edit-section">
                                    <DateTimePicker
                                      food={getEnrichedFoodData(item)}
                                      kitchen={kitchen || item.kitchen}
                                      orderType="GO_GRAB"
                                      selectedDate={
                                        tempPickupDates[itemKey] ||
                                        dayjs().format("YYYY-MM-DD")
                                      }
                                      selectedTime={
                                        tempPickupTimes[itemKey] ||
                                        dayjs()
                                          .add(30, "minute")
                                          .format("HH:mm")
                                      }
                                      onDateChange={(newDate) =>
                                        handleDateChange(itemKey, newDate)
                                      }
                                      onTimeChange={(newTime) =>
                                        handleTimeChange(itemKey, newTime)
                                      }
                                      className="listing-page-picker"
                                      dateLabel="Pick up date:"
                                      timeLabel="Pick up time:"
                                    />
                                    <div
                                      className="edit-actions"
                                      style={{
                                        display: "flex",
                                        gap: "8px",
                                        marginTop: "8px",
                                      }}
                                    >
                                      <button
                                        onClick={() => handleSaveEdit(itemKey)}
                                        style={{
                                          flex: 1,
                                          padding: "6px 12px",
                                          backgroundColor: "#4CAF50",
                                          color: "white",
                                          border: "none",
                                          borderRadius: "4px",
                                          fontSize: "12px",
                                          cursor: "pointer",
                                        }}
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleCancelEdit(itemKey)
                                        }
                                        style={{
                                          flex: 1,
                                          padding: "6px 12px",
                                          backgroundColor: "#f8f9fa",
                                          color: "#6c757d",
                                          border: "1px solid #dee2e6",
                                          borderRadius: "4px",
                                          fontSize: "12px",
                                          cursor: "pointer",
                                        }}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                );
                              } else {
                                return (
                                  <>
                                    <div className="title">
                                      {item.displayPickupTime}
                                    </div>
                                    <div className="bottom">
                                      <div className="time">
                                        {item.displayPickupClock}
                                      </div>
                                      <div
                                        className="icon"
                                        onClick={() => handleEditClick(itemKey)}
                                        style={{ cursor: "pointer" }}
                                      >
                                        <img
                                          src={Edit}
                                          alt="Edit pickup time"
                                        />
                                      </div>
                                    </div>
                                  </>
                                );
                              }
                            })()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Pre-Order Sections - Show after Go&Grab */}
              {Object.entries(groupedCartItems.preOrders).map(
                ([date, items]) => (
                  <div key={date}>
                    <h2 className="small-title mb-16">
                      Pre-order for {formatDate(date)}
                    </h2>
                    <div className="menu-listing">
                      {items.map((item, index) => {
                        const cartQty = getCartQuantity(item.foodId, date);
                        return (
                          <div
                            key={`preorder-${item.foodId}-${date}-${index}`}
                            className="menu-list"
                          >
                            <div className="left">
                              <div className="image">
                                <img
                                  src={
                                    item.food?.imageUrl ||
                                    "/src/assets/images/product.png"
                                  }
                                  alt={item.food?.name || "Food item"}
                                  onError={(e) => {
                                    e.target.src =
                                      "/src/assets/images/product.png";
                                  }}
                                />
                              </div>
                              <div className="data">
                                <div className="title">
                                  {item.food?.name || "Unknown Item"}
                                </div>
                                <div className="text">
                                  {item.food?.description ||
                                    "This dish features tender, juicy flavors"}
                                </div>
                                <div className="price">
                                  $ {item.food?.cost || "0.00"}
                                </div>
                              </div>
                            </div>

                            <div className="quantity-warpper">
                              <div className="right mb-1">
                                <QuantitySelector
                                  food={getEnrichedFoodData(item)}
                                  kitchen={kitchen || item.kitchen}
                                  selectedDate={date}
                                  size="small"
                                  initialQuantity={cartQty}
                                  onQuantityChange={async (newQuantity) => {
                                    const currentQty = getCartQuantity(
                                      item.foodId,
                                      date
                                    );
                                    const enrichedFood =
                                      getEnrichedFoodData(item);

                                    await handleQuantityChange({
                                      food: enrichedFood,
                                      kitchen: kitchen || item.kitchen,
                                      newQuantity,
                                      currentQuantity: currentQty,
                                      selectedDate: date,
                                      specialInstructions:
                                        item.specialInstructions || "",
                                      isPreOrder: true,
                                    });
                                  }}
                                />
                              </div>
                              {(() => {
                                const itemKey = `${item.foodId}-${date}`;
                                const isInEditMode = editModeItems.has(itemKey);

                                if (isInEditMode) {
                                  return (
                                    <div className="pickup-edit-section">
                                      <DateTimePicker
                                        food={getEnrichedFoodData(item)}
                                        kitchen={kitchen || item.kitchen}
                                        orderType="PRE_ORDER"
                                        selectedDate={
                                          tempPickupDates[itemKey] || date
                                        }
                                        selectedTime={
                                          tempPickupTimes[itemKey] || "18:30"
                                        }
                                        onDateChange={(newDate) =>
                                          handleDateChange(itemKey, newDate)
                                        }
                                        onTimeChange={(newTime) =>
                                          handleTimeChange(itemKey, newTime)
                                        }
                                        className="listing-page-picker"
                                        dateLabel="Pick up date:"
                                        timeLabel="Pick up time:"
                                      />
                                      <div
                                        className="edit-actions"
                                        style={{
                                          display: "flex",
                                          gap: "8px",
                                          marginTop: "8px",
                                        }}
                                      >
                                        <button
                                          onClick={() =>
                                            handleSaveEdit(itemKey)
                                          }
                                          style={{
                                            flex: 1,
                                            padding: "6px 12px",
                                            backgroundColor: "#4CAF50",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            fontSize: "12px",
                                            cursor: "pointer",
                                          }}
                                        >
                                          Save
                                        </button>
                                        <button
                                          onClick={() =>
                                            handleCancelEdit(itemKey)
                                          }
                                          style={{
                                            flex: 1,
                                            padding: "6px 12px",
                                            backgroundColor: "#f8f9fa",
                                            color: "#6c757d",
                                            border: "1px solid #dee2e6",
                                            borderRadius: "4px",
                                            fontSize: "12px",
                                            cursor: "pointer",
                                          }}
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  );
                                } else {
                                  return (
                                    <>
                                      <div className="title">
                                        {item.displayPickupTime}
                                      </div>
                                      <div className="bottom">
                                        <div className="time">
                                          {item.displayPickupClock}
                                        </div>
                                        <div
                                          className="icon"
                                          onClick={() =>
                                            handleEditClick(itemKey)
                                          }
                                          style={{ cursor: "pointer" }}
                                        >
                                          <img
                                            src={Edit}
                                            alt="Edit pickup time"
                                          />
                                        </div>
                                      </div>
                                    </>
                                  );
                                }
                              })()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              )}

              {/* Order Summary */}
              <div
                className="order-summary"
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "16px",
                  borderRadius: "8px",
                  marginTop: "24px",
                  marginBottom: "16px",
                }}
              >
                <div
                  className="summary-row"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span>
                    Subtotal ({totalItemsCount} item
                    {totalItemsCount !== 1 ? "s" : ""}):
                  </span>
                  <span>${totals.subtotal}</span>
                </div>
                <div
                  className="summary-row"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span>Tax (7.25%):</span>
                  <span>${totals.tax}</span>
                </div>
                <div
                  className="summary-row"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "600",
                    fontSize: "16px",
                    borderTop: "1px solid #dee2e6",
                    paddingTop: "8px",
                  }}
                >
                  <span>Total:</span>
                  <span>${totals.total}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                <button
                  onClick={handleRemoveAll}
                  style={{
                    flex: "1",
                    padding: "12px 16px",
                    backgroundColor: "#f8f9fa",
                    border: "1px solid #dee2e6",
                    borderRadius: "8px",
                    color: "#6c757d",
                    cursor: "pointer",
                  }}
                >
                  Clear Cart
                </button>
                <button
                  className="action-button"
                  onClick={() => navigate("/checkout")}
                  style={{ flex: "2" }}
                >
                  Check Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
