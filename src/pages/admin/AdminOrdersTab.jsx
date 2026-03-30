import React, { useState, useEffect, useMemo } from "react";
import { getAllAdminOrders } from "../../services/adminService";
import dayjs from "../../lib/dayjs";
import "./AdminDashboard.css";

export default function AdminOrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Grouping options
  const [groupBy, setGroupBy] = useState("kitchen"); // "kitchen", "category", or "kitchen-category"
  const [expandedGroups, setExpandedGroups] = useState({});
  const [expandedSubGroups, setExpandedSubGroups] = useState({});

  // Item filters
  const [filterCat8, setFilterCat8] = useState(false);
  const [filterStatus, setFilterStatus] = useState("inprogress");
  const [filterDate, setFilterDate] = useState("01/01/2000");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getAllAdminOrders();
        setOrders(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching admin orders:", err);
        setError("Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleGroup = (groupKey) => {
    setExpandedGroups((prev) => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  const toggleSubGroup = (subGroupKey) => {
    setExpandedSubGroups((prev) => ({
      ...prev,
      [subGroupKey]: !prev[subGroupKey],
    }));
  };

  const getMaxCategoryId = (foodCategory) => {
    if (!foodCategory) return "Uncategorized";
    const categories = foodCategory
      .toString()
      .split(",")
      .map((c) => parseInt(c.trim(), 10));
    const max = Math.max(...categories.filter((c) => !isNaN(c)), 0);
    return max > 0 ? `Category ${max}` : "Uncategorized";
  };

  const groupedOrders = useMemo(() => {
    const groups = {};
    const kitchenCaseMap = {}; // maps lowercase kitchen name to its first original casing

    const getNormalizedKitchenName = (rawName) => {
      if (!rawName) return "Unknown Kitchen";
      const trimmed = rawName.trim();
      const lower = trimmed.toLowerCase();
      if (!kitchenCaseMap[lower]) {
        kitchenCaseMap[lower] = trimmed;
      }
      return kitchenCaseMap[lower];
    };

    // --- APPLY ITEM-LEVEL FILTERS FIRST ---
    let processedOrders = orders;

    if (filterCat8) {
      processedOrders = orders
        .map((order) => {
          const matchedItems = order.orderedFoodItems?.filter((item) => {
            const maxCat = getMaxCategoryId(item.foodCategory);
            if (maxCat !== "Category 8") return false;

            const itemStatus = (item.orderStatus || order.orderStatus || "")
              .toLowerCase()
              .replace(/\s/g, "");
            const matchStatus = filterStatus.toLowerCase().replace(/\s/g, "");
            if (matchStatus && !itemStatus.includes(matchStatus)) return false;

            const pDate =
              item.pickDateString ||
              item.pickupDateString ||
              item.pickupDate ||
              item.dateString;
            const matchDate = filterDate.trim();
            if (matchDate && pDate !== matchDate) return false;

            return true;
          });

          if (matchedItems && matchedItems.length > 0) {
            // Return a shallow copy of order with the filtered items only
            return { ...order, orderedFoodItems: matchedItems };
          }
          return null; // Skip this order entirely if no items matched
        })
        .filter(Boolean); // Remove nulls
    }

    if (groupBy === "kitchen") {
      processedOrders.forEach((order) => {
        const kitchenName = getNormalizedKitchenName(order.kitchenName);
        if (!groups[kitchenName]) groups[kitchenName] = [];
        groups[kitchenName].push(order);
      });
    } else if (groupBy === "category") {
      processedOrders.forEach((order) => {
        const categoriesInOrder = order.orderedFoodItems?.map((item) =>
          getMaxCategoryId(item.foodCategory),
        ) || ["Uncategorized"];
        const distinctCategories = [...new Set(categoriesInOrder)];

        distinctCategories.forEach((cat) => {
          if (!groups[cat]) groups[cat] = [];
          if (!groups[cat].find((o) => o.id === order.id)) {
            groups[cat].push(order);
          }
        });

        if (distinctCategories.length === 0) {
          if (!groups["Uncategorized"]) groups["Uncategorized"] = [];
          groups["Uncategorized"].push(order);
        }
      });
    } else if (groupBy === "kitchen-category") {
      processedOrders.forEach((order) => {
        const kitchenName = getNormalizedKitchenName(order.kitchenName);
        if (!groups[kitchenName]) groups[kitchenName] = {};

        const categoriesInOrder = order.orderedFoodItems?.map((item) =>
          getMaxCategoryId(item.foodCategory),
        ) || ["Uncategorized"];
        const distinctCategories = [...new Set(categoriesInOrder)];

        distinctCategories.forEach((cat) => {
          if (!groups[kitchenName][cat]) groups[kitchenName][cat] = [];
          if (!groups[kitchenName][cat].find((o) => o.id === order.id)) {
            groups[kitchenName][cat].push(order);
          }
        });

        if (distinctCategories.length === 0) {
          if (!groups[kitchenName]["Uncategorized"])
            groups[kitchenName]["Uncategorized"] = [];
          groups[kitchenName]["Uncategorized"].push(order);
        }
      });
    }

    return groups;
  }, [orders, groupBy, filterCat8, filterStatus, filterDate]);

  const formatTimestamp = (ts) => {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return dayjs(d).format("MMM D, YYYY h:mm A");
  };

  const formatDateString = (dateStr) => {
    if (!dateStr || String(dateStr).trim() === "") return "";
    return `📅 ${dateStr}`;
  };

  const formatTimeString = (timeStr) => {
    if (!timeStr || String(timeStr).trim() === "") return "";
    return `⏰ ${timeStr}`;
  };

  if (loading) {
    return (
      <div className="admin-loading" style={{ marginTop: 40 }}>
        <div className="admin-spinner" />
        <div className="admin-loading-text">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-empty" style={{ marginTop: 40 }}>
        <div className="admin-empty-icon">⚠️</div>
        <div className="admin-empty-text">{error}</div>
      </div>
    );
  }

  const renderOrderList = (orderList, renderContextKey) => {
    return (
      <div
        style={{
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {orderList.map((order) => (
          <div
            key={`${renderContextKey}-${order.id}`}
            className="admin-order-card"
            style={{ marginBottom: 0 }}
          >
            <div className="admin-order-header">
              <div>
                <div className="admin-order-id">
                  Order #{order.orderID || order.id.slice(0, 8)}
                </div>
                <div className="admin-order-date">
                  {formatTimestamp(order.datePlaced)}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    color: "#8b949e",
                    marginRight: "10px",
                  }}
                >
                  👤 User: {order.userId}
                </div>
                <span className={`admin-order-status ${order.orderStatus}`}>
                  {order.orderStatus}
                </span>
              </div>
            </div>

            <div className="admin-order-body">
              <div className="admin-order-items">
                {order.orderedFoodItems?.map((item, idx) => {
                  const pDate =
                    item.pickupDateString ||
                    item.pickDateString ||
                    item.pickupDate ||
                    item.dateString;
                  const pTime = item.pickupTime || item.time || item.timeString;
                  return (
                    <div
                      key={idx}
                      className="admin-order-item"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: "4px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <span className="admin-order-item-name">
                            {item.name}
                          </span>
                          <span className="admin-order-item-qty">
                            ×{item.quantity || 1}
                          </span>
                        </div>
                        <span className="admin-order-item-price">
                          ${item.price || item.productDiscountedPrice || 0}
                        </span>
                      </div>

                      {/* Pick Date and Time details */}
                      {(pDate || pTime) && (
                        <div
                          style={{
                            display: "flex",
                            gap: "12px",
                            fontSize: "11px",
                            color: "#8b949e",
                            marginTop: "2px",
                          }}
                        >
                          {pDate && <span>{formatDateString(pDate)}</span>}
                          {pTime && <span>{formatTimeString(pTime)}</span>}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div
                className="admin-order-meta"
                style={{
                  marginTop: "12px",
                  paddingTop: "12px",
                  borderTop: "1px solid #30363d",
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ color: "#8b949e", fontSize: "13px" }}>
                  <div>
                    <strong style={{ color: "#c9d1d9" }}>Payment:</strong> $
                    {order.orderTotalCoast || order.totalPrice || 0}
                  </div>
                  <div>
                    <strong style={{ color: "#c9d1d9" }}>Type:</strong>{" "}
                    {order.pickupDeliveryType ||
                      (order.isDeliverydSelected ? "Delivery" : "Pickup")}
                  </div>
                </div>
                {order.isDeliverydSelected && (
                  <div
                    style={{
                      color: "#8b949e",
                      fontSize: "13px",
                      maxWidth: "200px",
                    }}
                  >
                    <strong style={{ color: "#c9d1d9" }}>Address:</strong>{" "}
                    {order.deliveryAddress || "N/A"}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ marginTop: 20 }}>
      {/* Controls */}
      <div
        className="admin-filters"
        style={{
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <span style={{ color: "#8b949e", fontSize: "14px" }}>
              Group By:
            </span>
            <button
              className={`admin-tab ${groupBy === "kitchen" ? "active" : ""}`}
              onClick={() => setGroupBy("kitchen")}
              style={{ margin: 0, padding: "6px 12px", minWidth: "auto" }}
            >
              Kitchen
            </button>
            <button
              className={`admin-tab ${groupBy === "kitchen-category" ? "active" : ""}`}
              onClick={() => setGroupBy("kitchen-category")}
              style={{ margin: 0, padding: "6px 12px", minWidth: "auto" }}
            >
              Kitchen &rarr; Category
            </button>
            <button
              className={`admin-tab ${groupBy === "category" ? "active" : ""}`}
              onClick={() => setGroupBy("category")}
              style={{ margin: 0, padding: "6px 12px", minWidth: "auto" }}
            >
              Category
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              flexWrap: "wrap",
              marginTop: "4px",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "#c9d1d9",
                fontSize: "14px",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              <input
                type="checkbox"
                checked={filterCat8}
                onChange={(e) => setFilterCat8(e.target.checked)}
                style={{ cursor: "pointer", width: "16px", height: "16px" }}
              />
              Filter Category 8: "In Progress" & Date
            </label>

            {filterCat8 && (
              <>
                <input
                  type="text"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  placeholder="Status (e.g. inprogress)"
                  style={{
                    padding: "6px 10px",
                    borderRadius: "4px",
                    border: "1px solid #30363d",
                    background: "#0d1117",
                    color: "#c9d1d9",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
                <input
                  type="text"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  placeholder="Date (e.g. 01/01/2000)"
                  style={{
                    padding: "6px 10px",
                    borderRadius: "4px",
                    border: "1px solid #30363d",
                    background: "#0d1117",
                    color: "#c9d1d9",
                    fontSize: "13px",
                    outline: "none",
                  }}
                />
              </>
            )}
          </div>
        </div>
        <span className="admin-result-count">
          Showing {orders.length} total orders
        </span>
      </div>

      {/* Grouped orders */}
      <div style={{ marginTop: 20 }}>
        {Object.keys(groupedOrders).length === 0 ? (
          <div className="admin-empty">
            <p>No orders found matching this view.</p>
          </div>
        ) : (
          Object.keys(groupedOrders)
            .sort()
            .map((groupKey) => {
              // the groupOrders can be an array (if groupBy=kitchen|category) or object (if kitchen-category)
              const groupData = groupedOrders[groupKey];
              const isExpanded = expandedGroups[groupKey] !== false; // default true

              // nested render
              if (groupBy === "kitchen-category") {
                const subKeys = Object.keys(groupData).sort();
                let kitchenOrderCount = 0;
                subKeys.forEach(
                  (k) => (kitchenOrderCount += groupData[k].length),
                );

                return (
                  <div
                    key={groupKey}
                    style={{
                      marginBottom: "20px",
                      background: "#161b22",
                      border: "1px solid #30363d",
                      borderRadius: "8px",
                    }}
                  >
                    <div
                      className="admin-section-header"
                      style={{
                        padding: "12px 16px",
                        margin: 0,
                        cursor: "pointer",
                        background: "rgba(13, 17, 23, 0.5)",
                        borderRadius: "8px 8px 0 0",
                      }}
                      onClick={() => toggleGroup(groupKey)}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <span style={{ fontSize: "18px" }}>
                          {isExpanded ? "▼" : "▶"}
                        </span>
                        <h2
                          className="admin-section-title"
                          style={{ margin: 0, fontSize: "16px" }}
                        >
                          {groupKey}
                          <span className="admin-section-count">
                            {kitchenOrderCount} orders in Categories
                          </span>
                        </h2>
                      </div>
                    </div>

                    {isExpanded && (
                      <div style={{ padding: "0 16px 16px 16px" }}>
                        {subKeys.map((subKey) => {
                          const subGroupKey = `${groupKey}-${subKey}`;
                          const isSubExpanded =
                            expandedSubGroups[subGroupKey] !== false;
                          const subOrderList = groupData[subKey];

                          return (
                            <div
                              key={subGroupKey}
                              style={{
                                marginTop: "16px",
                                background: "#0d1117",
                                border: "1px solid #30363d",
                                borderRadius: "8px",
                              }}
                            >
                              <div
                                className="admin-section-header"
                                style={{
                                  padding: "8px 12px",
                                  margin: 0,
                                  cursor: "pointer",
                                  background: "rgba(33, 38, 45, 0.5)",
                                  borderRadius: "8px 8px 0 0",
                                  borderBottom: isSubExpanded
                                    ? "1px solid #30363d"
                                    : "none",
                                }}
                                onClick={() => toggleSubGroup(subGroupKey)}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: "14px",
                                      color: "#8b949e",
                                    }}
                                  >
                                    {isSubExpanded ? "▼" : "▶"}
                                  </span>
                                  <h3
                                    style={{
                                      margin: 0,
                                      fontSize: "14px",
                                      color: "#c9d1d9",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {subKey}
                                    <span
                                      style={{
                                        marginLeft: "8px",
                                        background: "#30363d",
                                        padding: "2px 8px",
                                        borderRadius: "12px",
                                        fontSize: "12px",
                                        color: "#8b949e",
                                      }}
                                    >
                                      {subOrderList.length}
                                    </span>
                                  </h3>
                                </div>
                              </div>
                              {isSubExpanded &&
                                renderOrderList(subOrderList, subGroupKey)}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              // Normal flat render (kitchen or category)
              return (
                <div
                  key={groupKey}
                  style={{
                    marginBottom: "20px",
                    background: "#161b22",
                    border: "1px solid #30363d",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    className="admin-section-header"
                    style={{
                      padding: "12px 16px",
                      margin: 0,
                      cursor: "pointer",
                      background: "rgba(13, 17, 23, 0.5)",
                      borderRadius: "8px 8px 0 0",
                    }}
                    onClick={() => toggleGroup(groupKey)}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <span style={{ fontSize: "18px" }}>
                        {isExpanded ? "▼" : "▶"}
                      </span>
                      <h2
                        className="admin-section-title"
                        style={{ margin: 0, fontSize: "16px" }}
                      >
                        {groupKey}
                        <span className="admin-section-count">
                          {groupData.length}
                        </span>
                      </h2>
                    </div>
                  </div>

                  {isExpanded && renderOrderList(groupData, groupKey)}
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}
