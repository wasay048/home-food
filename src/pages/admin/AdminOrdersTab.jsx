import React, { useState, useEffect, useMemo } from "react";
import { getAllAdminOrders } from "../../services/adminService";
import dayjs from "../../lib/dayjs";
import "./AdminDashboard.css";

// ─── Item classification ────────────────────────────────────────────────
// Each order line is exactly one of these four shapes. The classifier is
// the single source of truth for both per-item badges and the "Order Type"
// filter / grouping below.
const CLASSIFICATIONS = {
  pickup_now: { label: "Pickup Now", color: "#3fb950", bg: "rgba(63, 185, 80, 0.15)" },
  groupbuy: { label: "Group Buy", color: "#e74c3c", bg: "rgba(231, 76, 60, 0.15)" },
  preorder: { label: "Pre-Order", color: "#58a6ff", bg: "rgba(88, 166, 255, 0.15)" },
  regular: { label: "Go & Grab", color: "#d29922", bg: "rgba(210, 153, 34, 0.15)" },
};

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "inProgress", label: "In Progress" },
  { value: "pendingApproval", label: "Pending Approval" },
  { value: "approved", label: "Approved" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const getMaxCategoryIdRaw = (foodCategory) => {
  if (foodCategory == null || foodCategory === "") return 0;
  const categories = String(foodCategory)
    .split(",")
    .map((c) => parseInt(c.trim(), 10));
  return Math.max(...categories.filter((c) => !isNaN(c)), 0);
};

const classifyItem = (item) => {
  if (!item) return "regular";
  if (item.pickupNow) return "pickup_now";
  if (item.orderType === "preorder") return "preorder";
  if (getMaxCategoryIdRaw(item.foodCategory) === 8) return "groupbuy";
  return "regular";
};

export default function AdminOrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Grouping options
  const [groupBy, setGroupBy] = useState("kitchen"); // kitchen | category | kitchen-category | classification
  const [expandedGroups, setExpandedGroups] = useState({});
  const [expandedSubGroups, setExpandedSubGroups] = useState({});

  // ─── Filters ─────────────────────────────────────────────────────────
  // classificationFilter: limits the *items* rendered inside each order.
  //   "all" preserves every line; any other value drops items not matching.
  // statusFilter: matches the order-level orderStatus (loose contains).
  // pickupDateFilter: matches item.pickupDateString (e.g. "05,12,2026").
  // searchQuery: substring match against order ID, user ID, kitchen name,
  //   and every item name in the order.
  // datePlaced range: filters orders by their datePlaced timestamp.
  const [classificationFilter, setClassificationFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [pickupDateFilter, setPickupDateFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [datePlacedFrom, setDatePlacedFrom] = useState("");
  const [datePlacedTo, setDatePlacedTo] = useState("");
  // High-cardinality dimensions live in dropdowns instead of chips so the
  // admin can narrow a 900-order list to a single kitchen / category without
  // opening every accordion.
  const [selectedKitchenId, setSelectedKitchenId] = useState("ALL");
  const [selectedCategoryId, setSelectedCategoryId] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest"); // newest | oldest | revenue_desc | revenue_asc
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

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

  // ─── Dropdown options derived from the order set ─────────────────────
  // Kitchens: keyed by kitchenId, label is the most-common kitchenName.
  // Categories: distinct max category IDs that appear in any order line.
  const kitchenOptions = useMemo(() => {
    const map = new Map();
    orders.forEach((order) => {
      const id = order.kitchenId || order.kitchenID || "";
      if (!id) return;
      if (!map.has(id)) {
        map.set(id, order.kitchenName || "Unknown Kitchen");
      }
    });
    return [...map.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [orders]);

  const categoryOptions = useMemo(() => {
    const set = new Set();
    orders.forEach((order) => {
      (order.orderedFoodItems || []).forEach((item) => {
        const max = getMaxCategoryIdRaw(item.foodCategory);
        if (max > 0) set.add(max);
      });
    });
    return [...set].sort((a, b) => a - b);
  }, [orders]);

  // ─── Filtered + grouped orders ───────────────────────────────────────
  // Pipeline (in order):
  //   1. drop orders failing date-placed range
  //   2. drop orders failing search (orderID / userId / kitchen / item names)
  //   3. drop orders failing status filter (loose contains on orderStatus)
  //   4. drop items inside each order that fail classification + pickup date
  //   5. drop orders left with zero items
  //   6. group remaining orders per groupBy
  const { groupedOrders, filteredOrders } = useMemo(() => {
    const groups = {};
    const kitchenCaseMap = {};

    const getNormalizedKitchenName = (rawName) => {
      if (!rawName) return "Unknown Kitchen";
      const trimmed = rawName.trim();
      const lower = trimmed.toLowerCase();
      if (!kitchenCaseMap[lower]) {
        kitchenCaseMap[lower] = trimmed;
      }
      return kitchenCaseMap[lower];
    };

    const toDateMs = (ts) => {
      if (!ts) return null;
      try {
        const d = ts.toDate ? ts.toDate() : new Date(ts);
        return Number.isFinite(d.getTime()) ? d.getTime() : null;
      } catch {
        return null;
      }
    };

    const datePlacedFromMs = datePlacedFrom
      ? dayjs(datePlacedFrom).startOf("day").valueOf()
      : null;
    const datePlacedToMs = datePlacedTo
      ? dayjs(datePlacedTo).endOf("day").valueOf()
      : null;
    const searchTerm = searchQuery.trim().toLowerCase();
    const statusLoose =
      statusFilter === "all"
        ? null
        : statusFilter.toLowerCase().replace(/\s/g, "");
    const pickupDateTrim = pickupDateFilter.trim();
    const minPriceNum = priceMin === "" ? null : parseFloat(priceMin);
    const maxPriceNum = priceMax === "" ? null : parseFloat(priceMax);

    const itemPassesFilters = (item, order) => {
      // Classification
      if (
        classificationFilter !== "all" &&
        classifyItem(item) !== classificationFilter
      ) {
        return false;
      }
      // Category dropdown — items keep only when they belong to the chosen cat
      if (
        selectedCategoryId !== "ALL" &&
        getMaxCategoryIdRaw(item.foodCategory) !==
          parseInt(selectedCategoryId, 10)
      ) {
        return false;
      }
      // Pickup date string match (admin entered "MM,DD,YYYY" or similar)
      if (pickupDateTrim) {
        const pDate =
          item.pickupDateString ||
          item.pickDateString ||
          item.pickupDate ||
          item.dateString ||
          "";
        if (String(pDate) !== pickupDateTrim) return false;
      }
      // Per-item status falls back to order status if missing
      if (statusLoose) {
        const itemStatus = (item.orderStatus || order.orderStatus || "")
          .toLowerCase()
          .replace(/\s/g, "");
        if (!itemStatus.includes(statusLoose)) return false;
      }
      return true;
    };

    const orderMatchesSearch = (order) => {
      if (!searchTerm) return true;
      const haystack = [
        order.orderID,
        order.id,
        order.userId,
        order.kitchenName,
        ...(order.orderedFoodItems || []).map((i) => i?.name),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(searchTerm);
    };

    const filtered = [];
    orders.forEach((order) => {
      // Kitchen dropdown
      if (selectedKitchenId !== "ALL") {
        const orderKitchenId = order.kitchenId || order.kitchenID || "";
        if (orderKitchenId !== selectedKitchenId) return;
      }

      // Price range — gates the order total against the input bounds
      const orderTotal = Number(
        order.orderTotalCoast || order.totalPrice || 0,
      );
      if (minPriceNum != null && orderTotal < minPriceNum) return;
      if (maxPriceNum != null && orderTotal > maxPriceNum) return;

      // Date placed range
      const placedMs = toDateMs(order.datePlaced);
      if (datePlacedFromMs != null && (placedMs == null || placedMs < datePlacedFromMs))
        return;
      if (datePlacedToMs != null && (placedMs == null || placedMs > datePlacedToMs))
        return;

      if (!orderMatchesSearch(order)) return;

      // Order-level status check (so search-only matches still drop on status)
      if (statusLoose) {
        const orderStatusLoose = (order.orderStatus || "")
          .toLowerCase()
          .replace(/\s/g, "");
        // Allow match if order OR any item carries the status
        const anyItemStatus = (order.orderedFoodItems || []).some((i) =>
          (i.orderStatus || "")
            .toLowerCase()
            .replace(/\s/g, "")
            .includes(statusLoose),
        );
        if (!orderStatusLoose.includes(statusLoose) && !anyItemStatus) return;
      }

      const matchedItems = (order.orderedFoodItems || []).filter((item) =>
        itemPassesFilters(item, order),
      );

      if (matchedItems.length === 0) return;

      filtered.push({ ...order, orderedFoodItems: matchedItems });
    });

    // Sort the filtered orders before grouping so every group renders in
    // the requested order (newest/oldest by datePlaced, highest/lowest by
    // orderTotalCoast).
    const sortFiltered = (list) => {
      const sorted = [...list];
      const totalOf = (o) =>
        Number(o.orderTotalCoast || o.totalPrice || 0);
      switch (sortBy) {
        case "oldest":
          return sorted.sort(
            (a, b) => (toDateMs(a.datePlaced) || 0) - (toDateMs(b.datePlaced) || 0),
          );
        case "revenue_desc":
          return sorted.sort((a, b) => totalOf(b) - totalOf(a));
        case "revenue_asc":
          return sorted.sort((a, b) => totalOf(a) - totalOf(b));
        case "newest":
        default:
          return sorted.sort(
            (a, b) => (toDateMs(b.datePlaced) || 0) - (toDateMs(a.datePlaced) || 0),
          );
      }
    };
    const sortedFiltered = sortFiltered(filtered);

    if (groupBy === "kitchen") {
      sortedFiltered.forEach((order) => {
        const kitchenName = getNormalizedKitchenName(order.kitchenName);
        if (!groups[kitchenName]) groups[kitchenName] = [];
        groups[kitchenName].push(order);
      });
    } else if (groupBy === "category") {
      sortedFiltered.forEach((order) => {
        const cats = order.orderedFoodItems?.map((item) =>
          getMaxCategoryId(item.foodCategory),
        ) || ["Uncategorized"];
        [...new Set(cats)].forEach((cat) => {
          if (!groups[cat]) groups[cat] = [];
          if (!groups[cat].find((o) => o.id === order.id)) groups[cat].push(order);
        });
      });
    } else if (groupBy === "kitchen-category") {
      sortedFiltered.forEach((order) => {
        const kitchenName = getNormalizedKitchenName(order.kitchenName);
        if (!groups[kitchenName]) groups[kitchenName] = {};
        const cats = order.orderedFoodItems?.map((item) =>
          getMaxCategoryId(item.foodCategory),
        ) || ["Uncategorized"];
        [...new Set(cats)].forEach((cat) => {
          if (!groups[kitchenName][cat]) groups[kitchenName][cat] = [];
          if (!groups[kitchenName][cat].find((o) => o.id === order.id)) {
            groups[kitchenName][cat].push(order);
          }
        });
      });
    } else if (groupBy === "classification") {
      // Each order can appear under multiple classification buckets if it
      // contains a mix (e.g. one Pickup Now line + one Pre-Order line).
      sortedFiltered.forEach((order) => {
        const classes = [
          ...new Set(
            (order.orderedFoodItems || []).map((item) => classifyItem(item)),
          ),
        ];
        classes.forEach((cls) => {
          const label = CLASSIFICATIONS[cls]?.label || "Other";
          if (!groups[label]) groups[label] = [];
          if (!groups[label].find((o) => o.id === order.id)) {
            groups[label].push(order);
          }
        });
      });
    }

    return { groupedOrders: groups, filteredOrders: sortedFiltered };
  }, [
    orders,
    groupBy,
    classificationFilter,
    statusFilter,
    pickupDateFilter,
    searchQuery,
    datePlacedFrom,
    datePlacedTo,
    selectedKitchenId,
    selectedCategoryId,
    sortBy,
    priceMin,
    priceMax,
  ]);

  // ─── Stats over filtered orders ─────────────────────────────────────
  const stats = useMemo(() => {
    let total = 0;
    let pickupNow = 0;
    let groupbuy = 0;
    let preorder = 0;
    let regular = 0;
    let revenue = 0;
    filteredOrders.forEach((order) => {
      total += 1;
      revenue += Number(order.orderTotalCoast || order.totalPrice || 0);
      const buckets = new Set(
        (order.orderedFoodItems || []).map((item) => classifyItem(item)),
      );
      if (buckets.has("pickup_now")) pickupNow += 1;
      if (buckets.has("groupbuy")) groupbuy += 1;
      if (buckets.has("preorder")) preorder += 1;
      if (buckets.has("regular")) regular += 1;
    });
    return { total, pickupNow, groupbuy, preorder, regular, revenue };
  }, [filteredOrders]);

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
                  const cls = classifyItem(item);
                  const classification = CLASSIFICATIONS[cls];
                  const isVar =
                    item.variableWeight === 1 || item.variableWeight === true;
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
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            flexWrap: "wrap",
                          }}
                        >
                          <span className="admin-order-item-name">
                            {item.name}
                          </span>
                          <span className="admin-order-item-qty">
                            ×{item.quantity || 1}
                          </span>
                          {classification && (
                            <span
                              style={{
                                background: classification.bg,
                                color: classification.color,
                                padding: "2px 8px",
                                borderRadius: 10,
                                fontSize: 10,
                                fontWeight: 600,
                                letterSpacing: 0.2,
                              }}
                            >
                              {classification.label}
                            </span>
                          )}
                        </div>
                        <span className="admin-order-item-price">
                          ${item.price || item.productDiscountedPrice || 0}
                        </span>
                      </div>

                      {/* Pickup date / time + stock context */}
                      <div
                        style={{
                          display: "flex",
                          gap: "12px",
                          fontSize: "11px",
                          color: "#8b949e",
                          marginTop: "2px",
                          flexWrap: "wrap",
                        }}
                      >
                        {pDate && <span>{formatDateString(pDate)}</span>}
                        {pTime && <span>{formatTimeString(pTime)}</span>}
                        {cls === "pickup_now" && item.stock != null && (
                          <span>
                            📦 Stock at purchase: {item.stock}
                            {isVar ? " lb" : ""}
                          </span>
                        )}
                        {isVar && item.poundsInOneOrder ? (
                          <span>⚖️ {item.poundsInOneOrder} lb/order</span>
                        ) : null}
                      </div>
                      {item.specialInstructions ? (
                        <div
                          style={{
                            fontSize: 11,
                            color: "#8b949e",
                            fontStyle: "italic",
                            marginTop: 2,
                          }}
                        >
                          📝 {item.specialInstructions}
                        </div>
                      ) : null}
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

  const chipStyle = (active, color = "#3fb950") => ({
    margin: 0,
    padding: "6px 12px",
    minWidth: "auto",
    borderRadius: 16,
    border: `1px solid ${active ? color : "#30363d"}`,
    background: active ? `${color}22` : "transparent",
    color: active ? color : "#c9d1d9",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s ease",
  });

  const resetFilters = () => {
    setClassificationFilter("all");
    setStatusFilter("all");
    setPickupDateFilter("");
    setSearchQuery("");
    setDatePlacedFrom("");
    setDatePlacedTo("");
    setSelectedKitchenId("ALL");
    setSelectedCategoryId("ALL");
    setSortBy("newest");
    setPriceMin("");
    setPriceMax("");
  };

  const hasActiveFilters =
    classificationFilter !== "all" ||
    statusFilter !== "all" ||
    pickupDateFilter !== "" ||
    searchQuery !== "" ||
    datePlacedFrom !== "" ||
    datePlacedTo !== "" ||
    selectedKitchenId !== "ALL" ||
    selectedCategoryId !== "ALL" ||
    sortBy !== "newest" ||
    priceMin !== "" ||
    priceMax !== "";

  // Bulk expand/collapse: instead of clicking accordion headers one by one,
  // admin can flip every kitchen / sub-group at once. The toggle records
  // explicit `false` for each currently-rendered group, so individual
  // re-expands stay possible afterwards.
  const expandAllGroups = () => {
    setExpandedGroups({});
    setExpandedSubGroups({});
  };
  const collapseAllGroups = () => {
    const all = {};
    Object.keys(groupedOrders).forEach((k) => {
      all[k] = false;
    });
    setExpandedGroups(all);
    const subs = {};
    Object.keys(groupedOrders).forEach((k) => {
      const inner = groupedOrders[k];
      if (inner && typeof inner === "object" && !Array.isArray(inner)) {
        Object.keys(inner).forEach((subKey) => {
          subs[`${k}-${subKey}`] = false;
        });
      }
    });
    setExpandedSubGroups(subs);
  };

  return (
    <div style={{ marginTop: 20 }}>
      {/* Stats row */}
      <div
        className="admin-stats-row"
        style={{ gap: 12, flexWrap: "wrap", marginBottom: 16 }}
      >
        <div className="admin-stat-card">
          <div className="admin-stat-label">Filtered Orders</div>
          <div className="admin-stat-value">{stats.total}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Pickup Now</div>
          <div className="admin-stat-value" style={{ color: "#3fb950" }}>
            {stats.pickupNow}
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Group Buy (Cat 8)</div>
          <div className="admin-stat-value" style={{ color: "#e74c3c" }}>
            {stats.groupbuy}
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Pre-Order</div>
          <div className="admin-stat-value" style={{ color: "#58a6ff" }}>
            {stats.preorder}
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Go &amp; Grab</div>
          <div className="admin-stat-value" style={{ color: "#d29922" }}>
            {stats.regular}
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Revenue</div>
          <div className="admin-stat-value highlight">
            ${stats.revenue.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Filter panel — labeled grid (matches AdminItemsTab visual rhythm)
          so the admin can narrow a 900-order list to a single kitchen +
          category + status in one glance, without expanding accordions. */}
      <div
        style={{
          padding: 16,
          background: "#161b22",
          border: "1px solid #30363d",
          borderRadius: 8,
          marginBottom: 16,
        }}
      >
        {/* Row 1: high-cardinality dropdowns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
          }}
        >
          <OrdersFilterField label="Kitchen">
            <OrdersFilterSelect
              value={selectedKitchenId}
              onChange={(e) => setSelectedKitchenId(e.target.value)}
            >
              <option value="ALL">All Kitchens</option>
              {kitchenOptions.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name}
                </option>
              ))}
            </OrdersFilterSelect>
          </OrdersFilterField>

          <OrdersFilterField label="Category">
            <OrdersFilterSelect
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              {categoryOptions.map((c) => (
                <option key={c} value={c}>
                  {c === 8 ? "Category 8 (Group Buy)" : `Category ${c}`}
                </option>
              ))}
            </OrdersFilterSelect>
          </OrdersFilterField>

          <OrdersFilterField label="Status">
            <OrdersFilterSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </OrdersFilterSelect>
          </OrdersFilterField>

          <OrdersFilterField label="Sort By">
            <OrdersFilterSelect
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="revenue_desc">Revenue (High–Low)</option>
              <option value="revenue_asc">Revenue (Low–High)</option>
            </OrdersFilterSelect>
          </OrdersFilterField>

          <OrdersFilterField label="Min Price">
            <OrdersFilterInput
              type="number"
              inputMode="decimal"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              placeholder="0"
            />
          </OrdersFilterField>

          <OrdersFilterField label="Max Price">
            <OrdersFilterInput
              type="number"
              inputMode="decimal"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              placeholder="∞"
            />
          </OrdersFilterField>
        </div>

        {/* Row 2: search */}
        <div style={{ marginTop: 12 }}>
          <OrdersFilterField label="Search">
            <OrdersFilterInput
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Order ID, user ID, kitchen, or item name…"
            />
          </OrdersFilterField>
        </div>

        {/* Row 3: date range + pickup date */}
        <div
          style={{
            marginTop: 12,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 12,
          }}
        >
          <OrdersFilterField label="Placed From">
            <OrdersFilterInput
              type="date"
              value={datePlacedFrom}
              onChange={(e) => setDatePlacedFrom(e.target.value)}
            />
          </OrdersFilterField>
          <OrdersFilterField label="Placed To">
            <OrdersFilterInput
              type="date"
              value={datePlacedTo}
              onChange={(e) => setDatePlacedTo(e.target.value)}
            />
          </OrdersFilterField>
          <OrdersFilterField label="Pickup Date (MM,DD,YYYY)">
            <OrdersFilterInput
              type="text"
              value={pickupDateFilter}
              onChange={(e) => setPickupDateFilter(e.target.value)}
              placeholder="e.g. 05,12,2026"
            />
          </OrdersFilterField>
        </div>

        {/* Row 4: order-type chips */}
        <div
          style={{
            marginTop: 14,
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span style={{ color: "#8b949e", fontSize: 12, minWidth: 80 }}>
            Order Type:
          </span>
          {[
            { key: "all", label: "All", color: "#58a6ff" },
            { key: "pickup_now", label: "Pickup Now", color: "#3fb950" },
            { key: "groupbuy", label: "Group Buy", color: "#e74c3c" },
            { key: "preorder", label: "Pre-Order", color: "#58a6ff" },
            { key: "regular", label: "Go & Grab", color: "#d29922" },
          ].map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => setClassificationFilter(key)}
              style={chipStyle(classificationFilter === key, color)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Row 5: group-by chips */}
        <div
          style={{
            marginTop: 10,
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span style={{ color: "#8b949e", fontSize: 12, minWidth: 80 }}>
            Group By:
          </span>
          {[
            { key: "kitchen", label: "Kitchen" },
            { key: "kitchen-category", label: "Kitchen → Category" },
            { key: "category", label: "Category" },
            { key: "classification", label: "Order Type" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setGroupBy(key)}
              style={chipStyle(groupBy === key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Row 6: action bar — bulk expand/collapse + clear + count */}
        <div
          style={{
            marginTop: 14,
            display: "flex",
            gap: 10,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <button onClick={expandAllGroups} style={chipStyle(false)}>
            ▼ Expand All
          </button>
          <button onClick={collapseAllGroups} style={chipStyle(false)}>
            ▶ Collapse All
          </button>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              style={{
                ...chipStyle(true, "#e74c3c"),
                color: "#e74c3c",
              }}
            >
              ✕ Clear Filters
            </button>
          )}
          <span
            className="admin-result-count"
            style={{ marginLeft: "auto" }}
          >
            Showing {filteredOrders.length} of {orders.length} orders
          </span>
        </div>
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

// ─── Local filter UI primitives ─────────────────────────────────────────
// Mirrors the look of AdminItemsTab's FilterField/FilterSelect/FilterInput
// so admins see a consistent filter rhythm across tabs. Kept local so this
// file remains self-contained and doesn't depend on AdminItemsTab.
function OrdersFilterField({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span
        style={{
          color: "#8b949e",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: 0.4,
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

const ordersFieldStyle = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #30363d",
  background: "#0d1117",
  color: "#c9d1d9",
  fontSize: 14,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

function OrdersFilterSelect({ children, ...props }) {
  return (
    <select {...props} style={ordersFieldStyle}>
      {children}
    </select>
  );
}

function OrdersFilterInput(props) {
  return <input {...props} style={ordersFieldStyle} />;
}
