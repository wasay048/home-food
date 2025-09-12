import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import { clearCart } from "../store/slices/cartSlice";
import { showToast } from "../utils/toast";
import { QuantitySelector } from "../components/QuantitySelector/QuantitySelector";

import { useKitchenWithFoods } from "../hooks/useKitchenListing";
import { useGenericCart } from "../hooks/useGenericCart";

export default function OrderPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // Get cart items from Redux
  const cartItems = useSelector((state) => state.cart.items);

  // Use generic cart hook for reliable quantity updates
  const { getCartQuantity } = useGenericCart();

  // State for tracking which items are in edit mode for pickup date/time
  const [editModeItems, setEditModeItems] = useState(new Set());

  const [showRemoveAllDialog, setShowRemoveAllDialog] = useState(false);

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

  const getItemCartQuantity = useCallback(
    (foodId, selectedDate = null, orderType) => {
      return getCartQuantity(foodId, selectedDate, orderType);
    },
    [getCartQuantity]
  );
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
      if (orderType === "GO_GRAB" || orderType === "Go&Grab") {
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
        orderType === "Pre-Order" ||
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

    const tax = subtotal * 0; // 0% tax rate
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

  const handleRemoveAll = () => {
    setShowRemoveAllDialog(true);
  };

  const confirmRemoveAll = () => {
    dispatch(clearCart());
    showToast.info("Cart cleared successfully");
    setShowRemoveAllDialog(false);
  };

  const cancelRemoveAll = () => {
    setShowRemoveAllDialog(false);
  };

  // Format date for display
  const formatDate = (dateString) => {
    return dayjs(dateString).format("MMM D ddd");
  };

  const totalItemsCount = cartItems?.length || 0;

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
            <div className="title">Order</div>
          </div>
          <div className="order-count">
            <div>
              {totalItemsCount} Item{totalItemsCount !== 1 ? "s" : ""} in Cart
            </div>
            <div>
              <Link style={{ color: "#3fc045" }} onClick={handleRemoveAll}>
                Remove all
              </Link>
            </div>
          </div>
          {/* Kitchen Info */}
          {/* {cartItems.length > 0 && cartItems[0].kitchen && (
            <h2 className="small-title mb-2">{cartItems[0].kitchen.name}</h2>
          )} */}

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
                      const cartQty = getItemCartQuantity(
                        item.foodId,
                        null,
                        "GO_GRAB"
                      );
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
                                minQuantity={0}
                                orderType="GO_GRAB"
                              />
                            </div>
                            <div className="title">
                              {item.selectedDate
                                ? dayjs(item.selectedDate).format(
                                    "MMMM D, YYYY"
                                  )
                                : dayjs().format("MMMM D, YYYY")}{" "}
                            </div>
                            <div className="bottom">
                              <div className="time">
                                at{" "}
                                {item?.selectedTime
                                  ? dayjs(item?.selectedTime, "h:mm A").format(
                                      "h:mm A"
                                    )
                                  : "5:30 PM"}
                              </div>
                            </div>
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
                        const cartQty = getItemCartQuantity(
                          item.foodId,
                          date,
                          "PRE_ORDER"
                        );
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
                                  minQuantity={0}
                                  orderType="PRE_ORDER"
                                />
                              </div>
                              <div className="title">
                                {dayjs(item.selectedDate).format(
                                  "MMMM D, YYYY"
                                )}{" "}
                              </div>
                              <div className="bottom">
                                <div className="time">
                                  at{" "}
                                  {item?.selectedTime
                                    ? dayjs(
                                        item?.selectedTime,
                                        "h:mm A"
                                      ).format("h:mm A")
                                    : "5:30 PM"}
                                </div>
                              </div>
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
                  <span>Tax (0%):</span>
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
      {showRemoveAllDialog && (
        <div className="modal-overlay" onClick={cancelRemoveAll}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Remove All Items</h3>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to remove all items from your cart? This
                action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={cancelRemoveAll}
                style={{
                  padding: "10px 20px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: "white",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={confirmRemoveAll}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "4px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  cursor: "pointer",
                  width: "100%",
                }}
              >
                Remove All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
