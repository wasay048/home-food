import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserOrders } from "../services/orderService";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import MobileLoader from "../components/Loader/MobileLoader";
import DateTimePicker from "../components/DateTimePicker/DateTimePicker";
import dayjs from "../lib/dayjs";
import { useUserAccount } from "../hooks/useUserAccount";
import "../styles/index.css";

/**
 * Helper function to get max category ID from comma-separated string
 */
const getMaxCategoryId = (foodCategory) => {
  if (!foodCategory) return 0;
  const categories = foodCategory
    .toString()
    .split(",")
    .map((c) => parseInt(c.trim(), 10));
  return Math.max(...categories.filter((c) => !isNaN(c)), 0);
};

/**
 * Check if a date is the default "01/01/2000 0:00AM" date
 */
const isDefaultDate = (date) => {
  if (!date) return false;
  const d = date?.toDate ? date.toDate() : new Date(date);
  return (
    d.getFullYear() === 2000 &&
    d.getMonth() === 0 &&
    d.getDate() === 1 &&
    d.getHours() === 0 &&
    d.getMinutes() === 0
  );
};

/**
 * Calculate group order percentage for category 8 items using live food data
 * Formula: ((maxByGroup - numAvailable) / minByGroup) * 100
 */
const calculateGroupOrderPercentage = (foodData) => {
  if (!foodData) return null;
  const minByGroup = foodData.minByGroup || 0;
  const maxByGroup = foodData.maxByGroup || minByGroup;
  const numAvailable = foodData.numAvailable || 0;

  if (minByGroup <= 0) return null;
  const percentage = ((maxByGroup - numAvailable) / minByGroup) * 100;
  return Math.round(Math.max(0, percentage)); // Floor at 0, no cap (can exceed 100%)
};

/**
 * Determine the display case for an order item
 * orderType1: 1 = delivery, 2 = pickup
 */
const getOrderDisplayCase = (order, item) => {
  // CASE 1: Delivered items (check item-level orderStatus)
  if (item?.orderStatus === "delivered") {
    return "delivered";
  }

  // CASE 2: Delivery orders (orderType1 === 1 means delivery)
  if (item?.orderType1 === 1 || order.orderType === "delivery" || order.isDeliverydSelected) {
    return "delivery";
  }

  // For pickup orders (orderType1 === 2 or not 1)
  const foodCategory = item?.foodCategory;
  const maxCategoryId = getMaxCategoryId(foodCategory);

  // CASE 4: Category 8 → ALWAYS show group progress (with percentage and date/time picker when chef sets date)
  if (maxCategoryId === 8) {
    return "group_progress";
  }

  // CASE 3: Non-category 8 pickup orders → Show editable date/time
  return "editable_pickup";
};

export default function MyOrdersPage() {
  const navigate = useNavigate();
  //  const currentUser = useSelector((state) => state.auth.user);
  const currentUser = { id: "5MhENXvWZ8QYsavYrvNCoFTnIA82" };
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [foodItemsData, setFoodItemsData] = useState({}); // Store live food data for category 8 items
  const [kitchenData, setKitchenData] = useState({}); // Store kitchen data for DateTimePicker
  const [pickupDates, setPickupDates] = useState({}); // Track pickup dates per item
  const [pickupTimes, setPickupTimes] = useState({}); // Track pickup times per item
  const [activeTab, setActiveTab] = useState("inProgress"); // "inProgress" or "delivered"
  
  // Account balance state
  const [accountBalance, setAccountBalance] = useState(0);
  const [cancellingItem, setCancellingItem] = useState(null); // Track which item is being cancelled
  const { getUserBalance, addToBalance } = useUserAccount();

  // Fetch account balance on mount
  useEffect(() => {
    const fetchBalance = async () => {
      if (currentUser?.id) {
        const balance = await getUserBalance(currentUser.id);
        setAccountBalance(balance);
      }
    };
    fetchBalance();
  }, [currentUser?.id, getUserBalance]);

  /**
   * Format date header based on relative date (Today, Yesterday, or formatted date)
   */
  const formatDateHeader = useCallback((datePlaced) => {
    const date = datePlaced?.toDate ? datePlaced.toDate() : new Date(datePlaced);
    const dateObj = dayjs(date);
    const today = dayjs().startOf("day");
    const yesterday = today.subtract(1, "day");
    
    if (dateObj.isSame(today, "day")) {
      return "Today";
    } else if (dateObj.isSame(yesterday, "day")) {
      return "Yesterday";
    } else {
      return dateObj.format("MMM D, YYYY");
    }
  }, []);

  /**
   * Filter orders and items based on the active tab
   * Groups items by order date (Today, Yesterday, etc.)
   * Each order may have multiple items with different statuses
   */
  const getFilteredOrderItems = useCallback(() => {
    const filteredItems = [];
    
    orders.forEach((order) => {
      order.orderedFoodItems?.forEach((item, index) => {
        const isDelivered = item.orderStatus === "delivered";
        const isCancelled = item.orderStatus === "cancelled";
        const isCompleted = isDelivered || isCancelled; // Both delivered and cancelled go to "Delivered" tab
        
        if (activeTab === "delivered" && isCompleted) {
          filteredItems.push({ order, item, index });
        } else if (activeTab === "inProgress" && !isCompleted) {
          filteredItems.push({ order, item, index });
        }
      });
    });
    
    // Sort by datePlaced (newest first)
    filteredItems.sort((a, b) => {
      const dateA = a.order.datePlaced?.toDate ? a.order.datePlaced.toDate() : new Date(a.order.datePlaced);
      const dateB = b.order.datePlaced?.toDate ? b.order.datePlaced.toDate() : new Date(b.order.datePlaced);
      return dateB - dateA; // Descending
    });
    
    // Group by date header
    const groupedByDate = {};
    filteredItems.forEach((item) => {
      const dateHeader = formatDateHeader(item.order.datePlaced);
      if (!groupedByDate[dateHeader]) {
        groupedByDate[dateHeader] = [];
      }
      groupedByDate[dateHeader].push(item);
    });
    
    return groupedByDate;
  }, [orders, activeTab, formatDateHeader]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser?.id) {
        setLoading(false);
        setError("Please log in to view your orders");
        return;
      }

      try {
        setLoading(true);
        const userOrders = await getUserOrders(currentUser.id);
        
        // Sort orders by datePlaced (newest first) as a fallback
        const sortedOrders = userOrders.sort((a, b) => {
          const dateA = a.datePlaced?.toDate ? a.datePlaced.toDate() : new Date(a.datePlaced);
          const dateB = b.datePlaced?.toDate ? b.datePlaced.toDate() : new Date(b.datePlaced);
          return dateB - dateA; // Descending order (newest first)
        });
        
        setOrders(sortedOrders);
        setError(null);

        // Fetch live food data for category 8 items
        const category8FoodIds = new Set();
        const kitchenIds = new Set();
        
        sortedOrders.forEach((order) => {
          if (order.kitchenId) {
            kitchenIds.add(order.kitchenId);
          }
          order.orderedFoodItems?.forEach((item) => {
            const maxCategoryId = getMaxCategoryId(item.foodCategory);
            if (maxCategoryId === 8 && item.foodItemId) {
              category8FoodIds.add(item.foodItemId);
            }
          });
        });

        console.log("📋 [MyOrdersPage] Category 8 food IDs:", Array.from(category8FoodIds));
        console.log("📋 [MyOrdersPage] Kitchen IDs:", Array.from(kitchenIds));

        // Fetch food data for each category 8 item - try both locations
        const foodData = {};
        for (const foodItemId of category8FoodIds) {
          try {
            // First try the top-level foodItems collection
            let foodRef = doc(db, "foodItems", foodItemId);
            let foodDoc = await getDoc(foodRef);
            
            // If not found, try kitchen subcollection
            if (!foodDoc.exists()) {
              for (const kitchenId of kitchenIds) {
                foodRef = doc(db, "kitchens", kitchenId, "foodItems", foodItemId);
                foodDoc = await getDoc(foodRef);
                if (foodDoc.exists()) {
                  console.log(`✅ Found in kitchen ${kitchenId} subcollection`);
                  break;
                }
              }
            }
            
            if (foodDoc.exists()) {
              const data = foodDoc.data();
              foodData[foodItemId] = data;
              console.log(`✅ Food data for ${foodItemId}:`, {
                name: data.name,
                minByGroup: data.minByGroup,
                maxByGroup: data.maxByGroup,
                numAvailable: data.numAvailable,
              });
            } else {
              console.warn(`⚠️ Food item ${foodItemId} not found in any location`);
            }
          } catch (err) {
            console.error(`Error fetching food item ${foodItemId}:`, err);
          }
        }
        setFoodItemsData(foodData);

        // Fetch kitchen data
        const kitchens = {};
        for (const kitchenId of kitchenIds) {
          try {
            const kitchenRef = doc(db, "kitchens", kitchenId);
            const kitchenDoc = await getDoc(kitchenRef);
            if (kitchenDoc.exists()) {
              kitchens[kitchenId] = { id: kitchenId, ...kitchenDoc.data() };
              console.log(`✅ Kitchen data for ${kitchenId}:`, kitchens[kitchenId].name);
            }
          } catch (err) {
            console.error(`Error fetching kitchen ${kitchenId}:`, err);
          }
        }
        setKitchenData(kitchens);

        // Initialize pickup dates and times from order items
        const initialDates = {};
        const initialTimes = {};
        sortedOrders.forEach((order) => {
          order.orderedFoodItems?.forEach((item, index) => {
            const key = `${order.id}-${index}`;
            
            // For category 8 items with pickupDateString, use that as source of truth
            if (item.pickupDateString && !["01,01,2000", "01/01/2000"].includes(item.pickupDateString)) {
              // Parse pickupDateString - handle both "MM,DD,YYYY" and "MM/DD/YYYY" formats
              const parsedDate = item.pickupDateString.includes("/") 
                ? dayjs(item.pickupDateString, "MM/DD/YYYY") 
                : dayjs(item.pickupDateString, "MM,DD,YYYY");
              initialDates[key] = parsedDate.format("YYYY-MM-DD");
            } else {
              // Fallback to pickupDate timestamp
              const pickupDate = item.pickupDate?.toDate 
                ? item.pickupDate.toDate() 
                : new Date(item.pickupDate);
              initialDates[key] = dayjs(pickupDate).format("YYYY-MM-DD");
            }
            initialTimes[key] = item.pickupTime || null;
          });
        });
        setPickupDates(initialDates);
        setPickupTimes(initialTimes);

      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser?.id]);

  const formatDate = (date) => {
    if (!date) return "";
    const d = date?.toDate ? date.toDate() : new Date(date);
    return dayjs(d).format("MMM D, YYYY");
  };

  const formatTime = (time) => {
    if (!time) return "";
    return time;
  };

  // State for tracking edits
  const [editingItems, setEditingItems] = useState({});
  const [savingItems, setSavingItems] = useState({});

  // Handle date change for an order item (DateTimePicker uses YYYY-MM-DD format)
  const handlePickupDateChange = useCallback((orderId, itemIndex, newDate) => {
    const key = `${orderId}-${itemIndex}`;
    // Update pickup dates state
    setPickupDates((prev) => ({
      ...prev,
      [key]: newDate,
    }));
    // Track edit for saving
    setEditingItems((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        pickupDateString: dayjs(newDate).format("MM,DD,YYYY"),
        pickupDate: dayjs(newDate).toDate(),
      },
    }));
    // Clear time when date changes
    setPickupTimes((prev) => ({
      ...prev,
      [key]: null,
    }));
  }, []);

  // Handle time change for an order item
  const handlePickupTimeChange = useCallback((orderId, itemIndex, newTime) => {
    const key = `${orderId}-${itemIndex}`;
    // Update pickup times state
    setPickupTimes((prev) => ({
      ...prev,
      [key]: newTime,
    }));
    // Track edit for saving
    setEditingItems((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        pickupTime: newTime,
      },
    }));
  }, []);

  // Save changes to Firestore
  const savePickupChanges = useCallback(async (orderId, itemIndex, order) => {
    const key = `${orderId}-${itemIndex}`;
    const edits = editingItems[key];
    
    if (!edits) {
      console.log("No edits to save for", key);
      return;
    }

    setSavingItems((prev) => ({ ...prev, [key]: true }));

    try {
      // Update the orderedFoodItems array in Firestore
      const updatedItems = [...order.orderedFoodItems];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        pickupDate: edits.pickupDate || updatedItems[itemIndex].pickupDate,
        pickupDateString: edits.pickupDateString || updatedItems[itemIndex].pickupDateString,
        pickupTime: edits.pickupTime || updatedItems[itemIndex].pickupTime,
      };

      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, {
        orderedFoodItems: updatedItems,
      });

      console.log("✅ Successfully updated pickup time for order", orderId);
      
      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === orderId ? { ...o, orderedFoodItems: updatedItems } : o
        )
      );

      // Clear editing state for this item
      setEditingItems((prev) => {
        const newState = { ...prev };
        delete newState[key];
        return newState;
      });

      alert("Pickup time updated successfully!");
    } catch (err) {
      console.error("Error updating pickup time:", err);
      alert("Failed to update pickup time. Please try again.");
    } finally {
      setSavingItems((prev) => ({ ...prev, [key]: false }));
    }
  }, [editingItems]);

  // Get current value for editing (either from editingItems or original item)
  const getEditValue = useCallback((orderId, itemIndex, item, field) => {
    const key = `${orderId}-${itemIndex}`;
    const edits = editingItems[key];
    if (edits && edits[field] !== undefined) {
      return edits[field];
    }
    return item[field];
  }, [editingItems]);

  // Check if item has unsaved changes
  const hasChanges = useCallback((orderId, itemIndex) => {
    const key = `${orderId}-${itemIndex}`;
    return !!editingItems[key];
  }, [editingItems]);

  /**
   * Handle cancellation of category 8 order items
   * Refunds the prepaid amount to user's account balance
   * Reverts the food quantity in the kitchen
   */
  const handleCancelOrder = useCallback(async (order, item, itemIndex) => {
    const key = `${order.id}-${itemIndex}`;
    
    // Confirm cancellation
    const confirmed = window.confirm(
      `Are you sure you want to cancel your order for "${item.name}"?\n\n` +
      `You will receive a credit of $${(item.price * (item.quantity || 1)).toFixed(2)} to your account balance.`
    );
    
    if (!confirmed) return;
    
    setCancellingItem(key);
    
    try {
      // Calculate refund amount
      const refundAmount = item.price * (item.quantity || 1);
      const cancelledQuantity = item.quantity || 1;
      
      // Update order item status in Firestore
      const orderRef = doc(db, "orders", order.id);
      const orderSnap = await getDoc(orderRef);
      
      if (!orderSnap.exists()) {
        throw new Error("Order not found");
      }
      
      const orderData = orderSnap.data();
      const updatedItems = [...(orderData.orderedFoodItems || [])];
      
      if (updatedItems[itemIndex]) {
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          orderStatus: "cancelled",
          cancelledAt: new Date(),
          refundAmount: refundAmount,
        };
      }
      
      await updateDoc(orderRef, { orderedFoodItems: updatedItems });
      
      // Revert food quantity in the kitchen
      const foodItemId = item.foodItemId;
      const kitchenId = item.kitchenId || order.kitchenId;
      
      if (foodItemId && kitchenId) {
        // Try kitchen-specific path first, then global path
        let foodRef = doc(db, "kitchens", kitchenId, "foodItems", foodItemId);
        let foodSnap = await getDoc(foodRef);
        
        if (!foodSnap.exists()) {
          // Fallback to global foodItems collection
          foodRef = doc(db, "foodItems", foodItemId);
          foodSnap = await getDoc(foodRef);
        }
        
        if (foodSnap.exists()) {
          const currentNumAvailable = foodSnap.data().numAvailable || 0;
          const newNumAvailable = currentNumAvailable + cancelledQuantity;
          
          await updateDoc(foodRef, { numAvailable: newNumAvailable });
          console.log("✅ Reverted food quantity:", { 
            foodItemId, 
            previousAvailable: currentNumAvailable, 
            cancelledQuantity, 
            newAvailable: newNumAvailable 
          });
        } else {
          console.warn("⚠️ Could not find food item to revert quantity:", foodItemId);
        }
      }
      
      // Add refund to user's account balance
      const balanceResult = await addToBalance(currentUser.id, refundAmount);
      
      if (balanceResult.success) {
        setAccountBalance(balanceResult.newBalance);
      }
      
      // Update local state
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === order.id ? { ...o, orderedFoodItems: updatedItems } : o
        )
      );
      
      alert(`Order cancelled successfully!\n$${refundAmount.toFixed(2)} has been added to your account balance.`);
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("Failed to cancel order. Please try again.");
    } finally {
      setCancellingItem(null);
    }
  }, [currentUser?.id, addToBalance]);

  if (loading) {
    return (
      <div className="container">
        <div className="mobile-container">
          <MobileLoader
            isLoading={loading}
            text="Loading your orders..."
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
        <div className="my-orders-page">
          {/* Header */}
          <div className="my-orders-header">
            <button
              className="back-button"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="#333"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <h1 className="page-title">My Orders</h1>
            <div style={{ width: "24px" }}></div>
          </div>

          {/* Account Balance Card */}
          {currentUser && (
            <div className="account-balance-card">
              <div className="balance-label">Account Balance</div>
              <div className="balance-amount">${accountBalance.toFixed(2)}</div>
            </div>
          )}

          {/* Tabs - only show when logged in */}
          {currentUser && (
            <div className="order-tabs">
              <button
                className={`order-tab ${activeTab === "inProgress" ? "active" : ""}`}
                onClick={() => setActiveTab("inProgress")}
              >
                In Progress
              </button>
              <button
                className={`order-tab ${activeTab === "delivered" ? "active" : ""}`}
                onClick={() => setActiveTab("delivered")}
              >
                Delivered
              </button>
            </div>
          )}

          {/* Error State */}
          {/* Not logged in state */}
          {!currentUser && (
            <div className="orders-empty">
              <p>Place order to view the details</p>
              <button
                className="button"
                onClick={() => navigate("/foods")}
              >
                Browse Menu
              </button>
            </div>
          )}

          {/* Error State (only for logged in users) */}
          {currentUser && error && (
            <div className="orders-error">
              <p>{error}</p>
            </div>
          )}

          {/* Empty State for current tab */}
          {currentUser && !error && Object.keys(getFilteredOrderItems()).length === 0 && orders.length > 0 && (
            <div className="orders-empty">
              <p>No {activeTab === "delivered" ? "delivered" : "in progress"} orders.</p>
            </div>
          )}

          {/* Empty State - No orders at all */}
          {currentUser && !error && orders.length === 0 && (
            <div className="orders-empty">
              <p>You haven't placed any orders yet.</p>
              <button
                className="button"
                onClick={() => navigate("/foods")}
              >
                Browse Menu
              </button>
            </div>
          )}

          {/* Orders List - Using grouped items by date */}
          {currentUser && !error && Object.keys(getFilteredOrderItems()).length > 0 && (
            <div className="orders-list">
              {Object.entries(getFilteredOrderItems()).map(([dateHeader, items]) => (
                <div key={dateHeader} className="orders-date-group">
                  {/* Date Header */}
                  <div 
                    className="date-header"
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#333",
                      padding: "12px 0 8px 0",
                      borderBottom: "1px solid #eee",
                      marginBottom: "8px",
                    }}
                  >
                    {dateHeader}
                  </div>
                  
                  {/* Items for this date */}
                  {items.map(({ order, item, index }) => {
                const displayCase = getOrderDisplayCase(order, item);

                return (
                  <div
                    key={`${order.id}-${index}`}
                    className={`order-card ${displayCase === "delivered" ? "delivered" : ""}`}
                    style={{ marginBottom: "12px" }}
                  >
                        {/* Delivered Overlay */}
                        {displayCase === "delivered" && (
                          <div className="delivered-overlay"></div>
                        )}

                        <div className="order-card-content">
                          {/* Food Image */}
                          <div className="order-item-image">
                            <img
                              src={item.imageUrl || "/placeholder-food.png"}
                              alt={item.name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/placeholder-food.png";
                              }}
                            />
                          </div>

                          {/* Food Details */}
                          <div className="order-item-details">
                            <h3 className="item-name">{item.name}</h3>
                            <p className="item-price">${item.price?.toFixed(2) || "0.00"}</p>
                          </div>

                          {/* Order Info (Right Side) */}
                          <div className="order-item-info">
                            <div className="quantity">x{item.quantity || 1}</div>

                            {/* CASE 1: Delivered */}
                            {displayCase === "delivered" && (
                              <div className="status-tag delivered-tag">Delivered</div>
                            )}

                            {/* CASE 2: Delivery */}
                            {displayCase === "delivery" && (
                              <div className="delivery-info">
                                <div className="delivery-date">
                                  {formatDate(item.pickupDate)}
                                </div>
                                <div className="delivery-time">
                                  before 6:00 PM
                                </div>
                              </div>
                            )}

                            {/* CASE 3: Editable Pickup - Showing static display (DateTimePicker temporarily hidden) */}
                            {displayCase === "editable_pickup" && (
                              <div className="delivery-info">
                                <div className="delivery-date">
                                  {formatDate(item.pickupDate)}
                                </div>
                                <div className="delivery-time">
                                  {formatTime(item.pickupTime) || "Pickup"}
                                </div>
                              </div>
                            )}

                            {/* 
                            ===== TEMPORARILY HIDDEN - DateTimePicker for editable pickup =====
                            To restore: uncomment this block and remove the static display above
                            
                            {displayCase === "editable_pickup" && (
                              <div className="pickup-time-section">
                                <DateTimePicker
                                  food={{
                                    id: item.foodItemId,
                                    name: item.name,
                                    foodCategory: item.foodCategory,
                                    orderType: item.orderType1,
                                  }}
                                  kitchen={kitchenData[order.kitchenId] || { id: order.kitchenId }}
                                  orderType="GO_GRAB"
                                  selectedDate={pickupDates[`${order.id}-${index}`] || null}
                                  selectedTime={pickupTimes[`${order.id}-${index}`] || null}
                                  onDateChange={(newDate) => handlePickupDateChange(order.id, index, newDate)}
                                  onTimeChange={(newTime) => handlePickupTimeChange(order.id, index, newTime)}
                                  disabled={false}
                                  className="listing-page-picker"
                                  dateLabel="Pickup Date"
                                  timeLabel="Pickup Time"
                                  isDeliveryMode={false}
                                  fulfillmentType={item.orderType1 || 2}
                                />
                                {hasChanges(order.id, index) && (
                                  <button
                                    className="save-pickup-btn"
                                    onClick={() => savePickupChanges(order.id, index, order)}
                                    disabled={savingItems[`${order.id}-${index}`]}
                                  >
                                    {savingItems[`${order.id}-${index}`] ? "Saving..." : "Save"}
                                  </button>
                                )}
                              </div>
                            )}
                            ===== END TEMPORARILY HIDDEN =====
                            */}

                            {/* CASE 4: Group Progress */}
                            {displayCase === "group_progress" && (
                              <div className="group-progress">
                                <span className="progress-label">Group Order</span>
                                <span className="progress-value">
                                Filled {calculateGroupOrderPercentage(foodItemsData[item.foodItemId]) || 0}%
                                </span>
                                {/* Show wholesale message only for default date - placed below the percentage */}
                                {item.pickupDateString && ["01,01,2000", "01/01/2000"].includes(item.pickupDateString) && (
                                  <span style={{ fontSize: "10px", color: "#666", display: "block", marginTop: "4px", whiteSpace: "normal", lineHeight: "1.3" }}>
                                    Need more orders to meet wholesale volume
                                  </span>
                                )}
                                {/* Show editable date/time when chef has set a pickup date (non-default) AND not cancelled */}
                                {item.pickupDateString && !["01,01,2000", "01/01/2000"].includes(item.pickupDateString) && item.orderStatus !== "cancelled" && (
                                  <div className="ready-pickup-section" style={{ marginTop: "8px" }}>
                                    <span style={{ fontSize: "12px", color: "#3fc045", fontWeight: "500", display: "block", marginBottom: "8px" }}>
                                      Ready for pick up on:
                                    </span>
                                    {/* Using DateTimePicker structure for iOS compatibility */}
                                    <div className="date-time-picker listing-page-picker" style={{ flexDirection: "column", gap: "6px", maxWidth: "140px" }}>
                                      {/* Date Picker Field */}
                                      <div className="picker-field" style={{ marginBottom: "0" }}>
                                        <label className="picker-label">Pickup Date</label>
                                        <select
                                          className="picker-select date-select"
                                          style={{ width: "100%" }}
                                          value={pickupDates[`${order.id}-${index}`] || (item.pickupDateString.includes("/") ? dayjs(item.pickupDateString, "MM/DD/YYYY").format("YYYY-MM-DD") : dayjs(item.pickupDateString, "MM,DD,YYYY").format("YYYY-MM-DD"))}
                                          onChange={(e) => handlePickupDateChange(order.id, index, e.target.value)}
                                          disabled={item.orderStatus === "cancelled"}
                                        >
                                          {/* Only chef date + next day (within 24 hours) - use CHEF's original date */}
                                          {(() => {
                                            // Use chefPickupDateString as the source of truth for date range calculation
                                            const chefDateStr = item.chefPickupDateString || item.pickupDateString;
                                            // Parse date - handle both "MM,DD,YYYY" and "MM/DD/YYYY" formats
                                            const chefDate = chefDateStr.includes("/") 
                                              ? dayjs(chefDateStr, "MM/DD/YYYY") 
                                              : dayjs(chefDateStr, "MM,DD,YYYY");
                                            const dates = [
                                              { value: chefDate.format("YYYY-MM-DD"), label: chefDate.format("MMM D, YYYY") },
                                              { value: chefDate.add(1, "day").format("YYYY-MM-DD"), label: chefDate.add(1, "day").format("MMM D, YYYY") },
                                            ];
                                            return dates.map((d) => (
                                              <option key={d.value} value={d.value}>{d.label}</option>
                                            ));
                                          })()}
                                        </select>
                                      </div>
                                      {/* Time Picker Field */}
                                      <div className="picker-field" style={{ marginBottom: "0" }}>
                                        <label className="picker-label">Pickup Time</label>
                                        <select
                                          className="picker-select time-select"
                                          style={{ width: "100%" }}
                                          value={pickupTimes[`${order.id}-${index}`] || item.pickupTime || ""}
                                          onChange={(e) => handlePickupTimeChange(order.id, index, e.target.value)}
                                          disabled={item.orderStatus === "cancelled"}
                                        >
                                          <option value="" disabled>Select time</option>
                                          {(() => {
                                            // Use CHEF's original date/time as the source of truth for 24-hour window
                                            const rawChefTime = item.chefPickupTime || item.pickupTime || "12:00 PM";
                                            const chefTime = rawChefTime.replace(/^0/, ""); // Remove leading zero
                                            const chefDateStr = item.chefPickupDateString || item.pickupDateString;
                                            // Parse date - handle both "MM,DD,YYYY" and "MM/DD/YYYY" formats
                                            const parsedChefDate = chefDateStr.includes("/") 
                                              ? dayjs(chefDateStr, "MM/DD/YYYY") 
                                              : dayjs(chefDateStr, "MM,DD,YYYY");
                                            
                                            // Create chef datetime - try multiple formats
                                            let chefDateTime = dayjs(`${parsedChefDate.format("YYYY-MM-DD")} ${chefTime}`, "YYYY-MM-DD h:mm A");
                                            if (!chefDateTime.isValid()) {
                                              // Fallback: try with HH:mm format
                                              chefDateTime = dayjs(`${parsedChefDate.format("YYYY-MM-DD")} ${rawChefTime}`, "YYYY-MM-DD HH:mm A");
                                            }
                                            if (!chefDateTime.isValid()) {
                                              // Final fallback: use noon
                                              chefDateTime = parsedChefDate.hour(12).minute(0);
                                            }
                                            
                                            const maxDateTime = chefDateTime.add(24, "hours");
                                            
                                            // Get selected date - default to chef's date if not set
                                            const currentPickupDate = pickupDates[`${order.id}-${index}`];
                                            const selectedDateStr = currentPickupDate || parsedChefDate.format("YYYY-MM-DD");
                                            const selectedDate = dayjs(selectedDateStr);
                                            
                                            // Check if selected date is chef's day - compare actual dates
                                            const isChefDay = selectedDate.format("YYYY-MM-DD") === parsedChefDate.format("YYYY-MM-DD");
                                            
                                            const timeSlots = [];
                                            let startSlot = isChefDay 
                                              ? chefDateTime 
                                              : selectedDate.startOf("day");
                                            
                                            let endSlot = selectedDate.isSame(maxDateTime, "day")
                                              ? maxDateTime
                                              : selectedDate.endOf("day").hour(23).minute(45);
                                            
                                            if (endSlot.isAfter(maxDateTime)) {
                                              endSlot = maxDateTime;
                                            }
                                            
                                            let currentSlot = startSlot;
                                            while (currentSlot.isBefore(endSlot) || currentSlot.isSame(endSlot)) {
                                              const timeStr = currentSlot.format("h:mm A");
                                              timeSlots.push({ value: timeStr, label: timeStr });
                                              currentSlot = currentSlot.add(15, "minutes");
                                            }
                                            
                                            return timeSlots.map((t) => (
                                              <option key={t.value} value={t.value}>{t.label}</option>
                                            ));
                                          })()}
                                        </select>
                                      </div>
                                    </div>
                                    {/* Save button if changes were made */}
                                    {hasChanges(order.id, index) && (
                                      <button
                                        className="save-pickup-btn"
                                        style={{
                                          marginTop: "8px",
                                          padding: "10px 12px",
                                          fontSize: "14px",
                                          backgroundColor: "#3fc045",
                                          color: "#fff",
                                          border: "none",
                                          borderRadius: "8px",
                                          cursor: "pointer",
                                          width: "100%",
                                          fontWeight: "500",
                                        }}
                                        onClick={() => savePickupChanges(order.id, index, order)}
                                        disabled={savingItems[`${order.id}-${index}`]}
                                      >
                                        {savingItems[`${order.id}-${index}`] ? "Saving..." : "Save Changes"}
                                      </button>
                                    )}
                                  </div>
                                )}
                                {/* Cancel Order Button for category 8 items - show for ALL category 8 items */}
                                {item.orderStatus !== "cancelled" && item.orderStatus !== "delivered" && (
                                  <button
                                    className="cancel-order-btn"
                                    style={{ marginTop: "8px" }}
                                    onClick={() => handleCancelOrder(order, item, index)}
                                    disabled={cancellingItem === `${order.id}-${index}`}
                                  >
                                    {cancellingItem === `${order.id}-${index}` ? "Cancelling..." : "Cancel Order"}
                                  </button>
                                )}
                                {/* Cancelled Status */}
                                {item.orderStatus === "cancelled" && (
                                  <div className="status-tag cancelled-tag" style={{ marginTop: "8px" }}>
                                    Order Cancelled - Refunded ${(item.refundAmount || item.price * (item.quantity || 1)).toFixed(2)}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* CASE 5: Error */}
                            {displayCase === "error" && (
                              <div className="status-tag error-tag">
                                Error: Unknown order state
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
