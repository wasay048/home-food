import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getUserOrders } from "../services/orderService";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import MobileLoader from "../components/Loader/MobileLoader";
import DateTimePicker from "../components/DateTimePicker/DateTimePicker";
import dayjs from "../lib/dayjs";
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
  return Math.round(Math.min(100, Math.max(0, percentage)));
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
  const pickupDate = item?.pickupDate;
  const isDefault = isDefaultDate(pickupDate);

  // CASE 3: Pickup orders where category != 8 OR pickup date != default → Show editable date/time
  if (maxCategoryId !== 8 || !isDefault) {
    return "editable_pickup";
  }

  // CASE 4: Category 8 with default date → Show group progress
  if (maxCategoryId === 8 && isDefault) {
    return "group_progress";
  }

  // CASE 5: Error case
  return "error";
};

export default function MyOrdersPage() {
  const navigate = useNavigate();
   const currentUser = useSelector((state) => state.auth.user);
  // const currentUser = { id: "5MhENXvWZ8QYsavYrvNCoFTnIA82" };
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [foodItemsData, setFoodItemsData] = useState({}); // Store live food data for category 8 items
  const [kitchenData, setKitchenData] = useState({}); // Store kitchen data for DateTimePicker
  const [pickupDates, setPickupDates] = useState({}); // Track pickup dates per item
  const [pickupTimes, setPickupTimes] = useState({}); // Track pickup times per item
  const [activeTab, setActiveTab] = useState("inProgress"); // "inProgress" or "delivered"

  /**
   * Filter orders and items based on the active tab
   * Each order may have multiple items with different statuses
   */
  const getFilteredOrderItems = useCallback(() => {
    const filteredItems = [];
    
    orders.forEach((order) => {
      order.orderedFoodItems?.forEach((item, index) => {
        const isDelivered = item.orderStatus === "delivered";
        
        if (activeTab === "delivered" && isDelivered) {
          filteredItems.push({ order, item, index });
        } else if (activeTab === "inProgress" && !isDelivered) {
          filteredItems.push({ order, item, index });
        }
      });
    });
    
    return filteredItems;
  }, [orders, activeTab]);

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
            // Convert pickupDate to YYYY-MM-DD format for DateTimePicker
            const pickupDate = item.pickupDate?.toDate 
              ? item.pickupDate.toDate() 
              : new Date(item.pickupDate);
            initialDates[key] = dayjs(pickupDate).format("YYYY-MM-DD");
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
          {currentUser && !error && getFilteredOrderItems().length === 0 && orders.length > 0 && (
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

          {/* Orders List - Using filtered items */}
          {currentUser && !error && getFilteredOrderItems().length > 0 && (
            <div className="orders-list">
              {getFilteredOrderItems().map(({ order, item, index }) => {
                const displayCase = getOrderDisplayCase(order, item);

                return (
                  <div
                    key={`${order.id}-${index}`}
                    className={`order-card ${displayCase === "delivered" ? "delivered" : ""}`}
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

                            {/* CASE 3: Editable Pickup - Using existing DateTimePicker */}
                            {displayCase === "editable_pickup" && (
                              <div className="pickup-selectors">
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
                                  className="my-orders-picker"
                                  dateLabel="Pickup Date"
                                  timeLabel="Pickup Time"
                                  isDeliveryMode={false}
                                  fulfillmentType={item.orderType1 || 2}
                                />
                                {/* Save button - only show if there are changes */}
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

                            {/* CASE 4: Group Progress */}
                            {displayCase === "group_progress" && (
                              <div className="group-progress">
                                <span className="progress-label">Group Order</span>
                                <span className="progress-value">
                                  Filled {calculateGroupOrderPercentage(foodItemsData[item.foodItemId]) || 0}%
                                </span>
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
          )}
        </div>
      </div>
    </div>
  );
}
