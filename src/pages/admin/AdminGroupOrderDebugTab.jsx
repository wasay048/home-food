import React, { useState, useEffect, useMemo } from "react";
import { doc, getDoc } from "firebase/firestore";
import { getAllAdminOrders } from "../../services/adminService";
import { db } from "../../services/firebase";
import dayjs from "../../lib/dayjs";
import "./AdminDashboard.css";

// Same formula used across ListingPage / FoodDetailPage / MyOrdersPage so debug
// output exactly matches what users see (no cap above 100%, floor at 0, 2 dp).
const calcPercentage = (orderedQty, minByGroup) => {
  if (!minByGroup || minByGroup <= 0) return null;
  const pct = (orderedQty / minByGroup) * 100;
  return Math.max(0, Math.round(pct * 100) / 100);
};

const getMaxCategoryId = (foodCategory) => {
  if (!foodCategory) return 0;
  const categories = foodCategory
    .toString()
    .split(",")
    .map((c) => parseInt(c.trim(), 10))
    .filter((c) => !isNaN(c));
  return categories.length ? Math.max(...categories) : 0;
};

const ACTIVE_ITEM_STATUSES = ["inprogress", "pending"];

const formatTimestamp = (ts) => {
  if (!ts) return "—";
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  return dayjs(d).format("MMM D, YYYY h:mm A");
};

export default function AdminGroupOrderDebugTab() {
  const [orders, setOrders] = useState([]);
  // foodDataByName: authoritative food doc per item name, fetched from
  // top-level foodItems or kitchens/{kitchenId}/foodItems (same fallback
  // MyOrdersPage uses — food docs can live in either location).
  const [foodDataByName, setFoodDataByName] = useState({});
  const [loading, setLoading] = useState(true);
  const [resolvingFoods, setResolvingFoods] = useState(false);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [onlyCat8, setOnlyCat8] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const orderData = await getAllAdminOrders();
        setOrders(orderData || []);
        setError(null);
      } catch (err) {
        console.error("[AdminGroupOrderDebug] fetch failed:", err);
        setError("Failed to load debug data.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  // Build: itemName -> { aggregatedQty, contributions[], foodItemIds, kitchenIds }
  // Only counts items whose item-level status is active AND whose parent order
  // is not canceled — mirroring getAggregatedOrderQuantities().
  const contributionsByName = useMemo(() => {
    const map = {};
    orders.forEach((order) => {
      if ((order.orderStatus || "").toLowerCase() === "canceled") return;
      (order.orderedFoodItems || []).forEach((item) => {
        const rawStatus = (item.orderStatus || order.orderStatus || "")
          .toLowerCase()
          .replace(/\s/g, "");
        if (!ACTIVE_ITEM_STATUSES.includes(rawStatus)) return;
        if (!item.name) return;
        const qty = parseInt(item.quantity, 10) || 0;
        if (!map[item.name]) {
          map[item.name] = {
            aggregatedQty: 0,
            contributions: [],
            foodItemIds: new Set(),
            kitchenIds: new Set(),
          };
        }
        map[item.name].aggregatedQty += qty;
        if (item.foodItemId) map[item.name].foodItemIds.add(item.foodItemId);
        if (order.kitchenId) map[item.name].kitchenIds.add(order.kitchenId);
        map[item.name].contributions.push({
          orderDocId: order.id,
          orderID: order.orderID || order.id?.slice(0, 8),
          userId: order.userId,
          kitchenName: order.kitchenName || "Unknown Kitchen",
          qty,
          itemStatus: item.orderStatus || order.orderStatus || "—",
          pickupDate:
            item.pickupDateString ||
            item.pickDateString ||
            item.pickupDate ||
            item.dateString ||
            "—",
          datePlaced: order.datePlaced,
          foodCategory: item.foodCategory,
        });
      });
    });
    return map;
  }, [orders]);

  // Resolve authoritative food docs for every item name. Try top-level
  // foodItems first, then each associated kitchen subcollection — same pattern
  // as MyOrdersPage.jsx:282-295.
  useEffect(() => {
    const names = Object.keys(contributionsByName);
    if (names.length === 0) {
      setFoodDataByName({});
      return;
    }

    let cancelled = false;
    const run = async () => {
      setResolvingFoods(true);
      const results = await Promise.all(
        names.map(async (name) => {
          const entry = contributionsByName[name];
          const foodItemIds = Array.from(entry.foodItemIds);
          const kitchenIds = Array.from(entry.kitchenIds);

          for (const foodItemId of foodItemIds) {
            try {
              const topLevel = await getDoc(doc(db, "foodItems", foodItemId));
              if (topLevel.exists()) {
                return [name, { id: foodItemId, ...topLevel.data() }];
              }
              for (const kitchenId of kitchenIds) {
                const sub = await getDoc(
                  doc(db, "kitchens", kitchenId, "foodItems", foodItemId),
                );
                if (sub.exists()) {
                  return [name, { id: foodItemId, ...sub.data() }];
                }
              }
            } catch (err) {
              console.warn(
                `[AdminGroupOrderDebug] lookup failed for ${name} / ${foodItemId}:`,
                err,
              );
            }
          }
          return [name, null];
        }),
      );
      if (cancelled) return;
      const next = {};
      results.forEach(([name, data]) => {
        if (data) next[name] = data;
      });
      setFoodDataByName(next);
      setResolvingFoods(false);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [contributionsByName]);

  // Build the debug rows by walking the live contribution map (authoritative
  // source of "open" items) and joining with the fetched food doc for
  // minByGroup. Falls back to the foodCategory embedded in the order line
  // when the food doc couldn't be resolved.
  const rows = useMemo(() => {
    const result = [];

    Object.keys(contributionsByName).forEach((name) => {
      const contrib = contributionsByName[name];
      const food = foodDataByName[name];

      const categorySource =
        food?.foodCategory ?? contrib.contributions[0]?.foodCategory;
      const maxCat = getMaxCategoryId(categorySource);
      if (onlyCat8 && maxCat !== 8) return;

      const minByGroup = Number(food?.minByGroup) || 0;
      const percentage = calcPercentage(contrib.aggregatedQty, minByGroup);

      result.push({
        key: food?.id || name,
        name,
        kitchenName:
          food?.kitchenName ||
          contrib.contributions[0]?.kitchenName ||
          "—",
        category: maxCat || "—",
        minByGroup,
        aggregatedQty: contrib.aggregatedQty,
        percentage,
        foodResolved: !!food,
        contributions: contrib.contributions,
      });
    });

    return result;
  }, [contributionsByName, foodDataByName, onlyCat8]);

  const filteredRows = useMemo(() => {
    let r = rows;
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      r = r.filter(
        (row) =>
          row.name.toLowerCase().includes(term) ||
          (row.kitchenName || "").toLowerCase().includes(term),
      );
    }
    // Sort by percentage desc (null last), then by aggregatedQty desc
    return [...r].sort((a, b) => {
      const pa = a.percentage ?? -1;
      const pb = b.percentage ?? -1;
      if (pb !== pa) return pb - pa;
      return b.aggregatedQty - a.aggregatedQty;
    });
  }, [rows, searchTerm]);

  const stats = useMemo(() => {
    const itemsWithMin = rows.filter((r) => r.minByGroup > 0).length;
    const metTarget = rows.filter(
      (r) => r.percentage !== null && r.percentage >= 100,
    ).length;
    const partial = rows.filter(
      (r) => r.percentage !== null && r.percentage > 0 && r.percentage < 100,
    ).length;
    return { itemsWithMin, metTarget, partial, total: rows.length };
  }, [rows]);

  const toggle = (key) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  if (loading) {
    return (
      <div className="admin-loading" style={{ marginTop: 40 }}>
        <div className="admin-spinner" />
        <div className="admin-loading-text">
          Loading group order debug data...
        </div>
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

  return (
    <div style={{ marginTop: 20 }}>
      {/* Stats */}
      <div className="admin-stats-row">
        <div className="admin-stat-card">
          <div className="admin-stat-label">Items Tracked</div>
          <div className="admin-stat-value">{stats.total}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">With minByGroup</div>
          <div className="admin-stat-value highlight">{stats.itemsWithMin}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">≥ 100% Filled</div>
          <div className="admin-stat-value">{stats.metTarget}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Partially Filled</div>
          <div className="admin-stat-value warning">{stats.partial}</div>
        </div>
      </div>

      {/* Search */}
      <div className="admin-search-section">
        <div className="admin-search-wrapper">
          <div className="admin-search-icon">🔍</div>
          <input
            type="text"
            className="admin-search-input"
            placeholder="Search by item name or kitchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <label className="admin-filter-toggle">
          <input
            type="checkbox"
            checked={onlyCat8}
            onChange={(e) => setOnlyCat8(e.target.checked)}
          />
          Only Category 8 items
        </label>
        <span className="admin-result-count">
          Showing {filteredRows.length} of {rows.length} items
          {resolvingFoods && (
            <span style={{ color: "#8b949e", marginLeft: 8 }}>
              · resolving food data…
            </span>
          )}
        </span>
      </div>

      {/* Formula reference */}
      <div
        style={{
          marginTop: 12,
          padding: "10px 14px",
          background: "#161b22",
          border: "1px solid #30363d",
          borderRadius: 6,
          fontSize: 12,
          color: "#8b949e",
          fontFamily: "monospace",
        }}
      >
        Formula:&nbsp;
        <span style={{ color: "#c9d1d9" }}>
          percentage = max(0, round((aggregatedQty / minByGroup) × 100, 2dp))
        </span>
        &nbsp;— aggregated from orders where{" "}
        <span style={{ color: "#c9d1d9" }}>orderStatus ≠ "canceled"</span> AND
        item-level status ∈{" "}
        <span style={{ color: "#c9d1d9" }}>[inProgress, pending]</span>
      </div>

      {/* Rows */}
      <div style={{ marginTop: 20 }}>
        {filteredRows.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">🔍</div>
            <div className="admin-empty-text">
              No items match the current filters.
            </div>
          </div>
        ) : (
          filteredRows.map((row) => {
            const isExpanded = !!expanded[row.key];
            const pctLabel =
              row.percentage === null ? "—" : `${row.percentage}%`;
            const pctColor =
              row.percentage === null
                ? "#8b949e"
                : row.percentage >= 100
                  ? "#3fb950"
                  : row.percentage > 0
                    ? "#d29922"
                    : "#8b949e";

            return (
              <div
                key={row.key}
                style={{
                  marginBottom: 12,
                  background: "#161b22",
                  border: "1px solid #30363d",
                  borderRadius: 8,
                }}
              >
                <div
                  onClick={() => toggle(row.key)}
                  style={{
                    padding: "12px 16px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    <span style={{ fontSize: 14, color: "#8b949e" }}>
                      {isExpanded ? "▼" : "▶"}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          color: "#c9d1d9",
                          fontWeight: 600,
                          fontSize: 14,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {row.name}
                      </div>
                      <div style={{ color: "#8b949e", fontSize: 12 }}>
                        🍳 {row.kitchenName} · Cat {row.category}
                        {!row.foodResolved && (
                          <span
                            style={{ color: "#d29922", marginLeft: 8 }}
                            title="Live food doc could not be located in top-level or kitchen subcollection"
                          >
                            ⚠ food doc not found
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ textAlign: "right", fontSize: 12 }}>
                      <div style={{ color: "#8b949e" }}>minByGroup</div>
                      <div style={{ color: "#c9d1d9", fontWeight: 600 }}>
                        {row.minByGroup || "—"}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", fontSize: 12 }}>
                      <div style={{ color: "#8b949e" }}>ordered</div>
                      <div style={{ color: "#c9d1d9", fontWeight: 600 }}>
                        {row.aggregatedQty}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", minWidth: 70 }}>
                      <div style={{ color: "#8b949e", fontSize: 12 }}>
                        filled
                      </div>
                      <div
                        style={{
                          color: pctColor,
                          fontWeight: 700,
                          fontSize: 16,
                        }}
                      >
                        {pctLabel}
                      </div>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div
                    style={{
                      borderTop: "1px solid #30363d",
                      padding: "12px 16px",
                      background: "#0d1117",
                      borderRadius: "0 0 8px 8px",
                    }}
                  >
                    <table
                      className="admin-table"
                      style={{ marginTop: 0, fontSize: 12 }}
                    >
                        <thead>
                          <tr>
                            <th>Order #</th>
                            <th>User</th>
                            <th>Kitchen</th>
                            <th>Qty</th>
                            <th>Item Status</th>
                            <th>Pickup Date</th>
                            <th>Placed</th>
                          </tr>
                        </thead>
                        <tbody>
                          {row.contributions.map((c, idx) => (
                            <tr key={`${c.orderDocId}-${idx}`}>
                              <td>
                                <div className="admin-user-id" title={c.orderDocId}>
                                  {c.orderID}
                                </div>
                              </td>
                              <td>
                                <div
                                  className="admin-user-id"
                                  title={c.userId}
                                  style={{ maxWidth: 160 }}
                                >
                                  {c.userId}
                                </div>
                              </td>
                              <td style={{ color: "#c9d1d9" }}>
                                {c.kitchenName}
                              </td>
                              <td
                                style={{
                                  color: "#c9d1d9",
                                  fontWeight: 600,
                                }}
                              >
                                ×{c.qty}
                              </td>
                              <td>
                                <span
                                  className={`admin-order-status ${c.itemStatus}`}
                                >
                                  {c.itemStatus}
                                </span>
                              </td>
                              <td style={{ color: "#8b949e" }}>
                                {c.pickupDate}
                              </td>
                              <td style={{ color: "#8b949e" }}>
                                {formatTimestamp(c.datePlaced)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
