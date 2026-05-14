import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserSummaryStats } from "../../services/adminService";
import { AdminAuthContext } from "./AdminAuthGate";
import dayjs from "../../lib/dayjs";
import "./AdminDashboard.css";

export default function AdminUserDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState("balance");
  const { logout } = useContext(AdminAuthContext);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const stats = await getUserSummaryStats(userId);
        if (!stats.profile) {
          setError("User not found.");
          return;
        }
        setData(stats);
        setError(null);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const formatTimestamp = (ts) => {
    if (!ts) return "—";
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    return dayjs(d).format("MMM D, YYYY h:mm A");
  };

  const formatDate = (ts) => {
    if (!ts) return "—";
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    return dayjs(d).format("MMM D, YYYY");
  };

  const getCategoryLabel = (cat) => {
    const labels = {
      order_payment: "Order Payment",
      admin_credit: "Admin Credit",
      peer_transfer: "Peer Transfer",
      refund: "Refund",
      unknown: "Unknown",
    };
    return labels[cat] || cat;
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <div className="admin-topbar">
          <div className="admin-topbar-left">
            <div className="admin-logo">
              🔍 HomeFresh <span>Admin Debug Console</span>
            </div>
          </div>
        </div>
        <div className="admin-container">
          <div className="admin-loading">
            <div className="admin-spinner" />
            <div className="admin-loading-text">Loading user data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="admin-layout">
        <div className="admin-topbar">
          <div className="admin-topbar-left">
            <div className="admin-logo">
              🔍 HomeFresh <span>Admin Debug Console</span>
            </div>
          </div>
        </div>
        <div className="admin-container">
          <button className="admin-back-btn" onClick={() => navigate("/admin")}>
            ← Back to Users
          </button>
          <div className="admin-empty">
            <div className="admin-empty-icon">⚠️</div>
            <div className="admin-empty-text">{error || "User not found."}</div>
          </div>
        </div>
      </div>
    );
  }

  const { profile, orders, balanceHistory, creditRequests } = data;

  return (
    <div className="admin-layout">
      {/* Top Bar */}
      <div className="admin-topbar">
        <div className="admin-topbar-left">
          <div className="admin-logo">
            🔍 HomeFresh <span>Admin Debug Console</span>
          </div>
        </div>
        <div className="admin-topbar-right">
          <span className="admin-badge">User Detail</span>
          <button className="admin-logout-btn" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="admin-container">
        <button className="admin-back-btn" onClick={() => navigate("/admin")}>
          ← Back to Users
        </button>

        {/* ── Profile Card ──────────────────────────────────────────── */}
        <div className="admin-profile-card">
          <div className="admin-profile-header">
            <div className="admin-profile-avatar">
              {profile.profilePictureUrl ? (
                <img src={profile.profilePictureUrl} alt="" />
              ) : (
                (profile.name || "?").charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h1 className="admin-profile-name">
                {profile.name || profile.wechatNickname || "Unknown User"}
              </h1>
              <div className="admin-profile-email">
                {profile.email || "No email"}
              </div>
              <div className="admin-profile-id">ID: {userId}</div>
              {profile.cellPhone && (
                <div className="admin-profile-id">
                  📞 {profile.cellPhone}
                </div>
              )}
            </div>
          </div>

          <div className="admin-profile-meta">
            <div className="admin-profile-meta-item">
              <div className="admin-profile-meta-label">Current Balance</div>
              <div
                className="admin-profile-meta-value"
                style={{
                  color:
                    (profile.accountBalance || 0) > 0 ? "#3fb950" : "#6e7681",
                }}
              >
                ${(profile.accountBalance || 0).toFixed(2)}
              </div>
            </div>
            <div className="admin-profile-meta-item">
              <div className="admin-profile-meta-label">Total Orders</div>
              <div
                className="admin-profile-meta-value"
                style={{ color: "#58a6ff" }}
              >
                {data.totalOrders}
              </div>
            </div>
            <div className="admin-profile-meta-item">
              <div className="admin-profile-meta-label">Paid via Balance</div>
              <div
                className="admin-profile-meta-value"
                style={{ color: "#d29922" }}
              >
                ${data.totalPaidFromBalance.toFixed(2)}
              </div>
            </div>
            <div className="admin-profile-meta-item">
              <div className="admin-profile-meta-label">Paid Online</div>
              <div
                className="admin-profile-meta-value"
                style={{ color: "#3fb950" }}
              >
                ${data.totalPaidOnline.toFixed(2)}
              </div>
            </div>
            <div className="admin-profile-meta-item">
              <div className="admin-profile-meta-label">Credits Received</div>
              <div
                className="admin-profile-meta-value"
                style={{ color: "#3fb950" }}
              >
                ${data.totalCreditsReceived.toFixed(2)}
              </div>
            </div>
            <div className="admin-profile-meta-item">
              <div className="admin-profile-meta-label">Registered</div>
              <div
                className="admin-profile-meta-value"
                style={{ color: "#8b949e", fontSize: 14 }}
              >
                {formatDate(profile.accountCreationDate)}
              </div>
            </div>
          </div>
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────── */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === "balance" ? "active" : ""}`}
            onClick={() => setActiveTab("balance")}
          >
            Balance History ({balanceHistory.length})
          </button>
          <button
            className={`admin-tab ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            Orders ({orders.length})
          </button>
          <button
            className={`admin-tab ${activeTab === "credits" ? "active" : ""}`}
            onClick={() => setActiveTab("credits")}
          >
            Credit Requests ({creditRequests.length})
          </button>
        </div>

        {/* ── Balance History ───────────────────────────────────────── */}
        {activeTab === "balance" && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2 className="admin-section-title">
                💰 Balance History
                <span className="admin-section-count">
                  {balanceHistory.length}
                </span>
              </h2>
            </div>

            {balanceHistory.length === 0 ? (
              <div className="admin-empty">
                <div className="admin-empty-icon">📭</div>
                <div className="admin-empty-text">
                  No balance transactions found.
                </div>
              </div>
            ) : (
              <div className="admin-timeline">
                {balanceHistory.map((entry) => (
                  <div key={entry.id} className="admin-timeline-item">
                    <div
                      className={`admin-timeline-dot ${entry.direction}`}
                    />
                    <div className="admin-timeline-top">
                      <div className="admin-timeline-label">
                        {entry.direction === "credit"
                          ? `Received from ${entry.otherUserId === "system" ? "System" : entry.otherUserId?.substring(0, 12) + "..."}`
                          : `Sent to ${entry.otherUserId === "system" ? "System (Order Payment)" : entry.otherUserId?.substring(0, 12) + "..."}`}
                      </div>
                      <div
                        className={`admin-timeline-amount ${entry.direction}`}
                      >
                        {entry.direction === "credit" ? "+" : "-"}$
                        {entry.amount.toFixed(2)}
                      </div>
                    </div>
                    <div className="admin-timeline-meta">
                      <span>{formatTimestamp(entry.timestamp)}</span>
                      <span
                        className={`admin-timeline-category ${entry.category}`}
                      >
                        {getCategoryLabel(entry.category)}
                      </span>
                      {entry.otherUserId &&
                        entry.otherUserId !== "system" && (
                          <span
                            style={{
                              cursor: "pointer",
                              color: "#58a6ff",
                              textDecoration: "underline",
                            }}
                            onClick={() =>
                              navigate(
                                `/admin/users/${entry.otherUserId}`
                              )
                            }
                          >
                            View user →
                          </span>
                        )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Orders ───────────────────────────────────────────────── */}
        {activeTab === "orders" && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2 className="admin-section-title">
                📦 Order History
                <span className="admin-section-count">{orders.length}</span>
              </h2>
            </div>

            {orders.length === 0 ? (
              <div className="admin-empty">
                <div className="admin-empty-icon">📭</div>
                <div className="admin-empty-text">No orders found.</div>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="admin-order-card">
                  <div className="admin-order-header">
                    <div>
                      <div className="admin-order-id">
                        Order #{order.orderID}
                      </div>
                      <div className="admin-order-date">
                        {formatTimestamp(order.datePlaced)}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span
                        className={`admin-order-status ${order.orderStatus}`}
                      >
                        {order.orderStatus}
                      </span>
                      {order.orderPaymentImage ? (
                        <a
                          href={order.orderPaymentImage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="admin-screenshot-badge has-screenshot"
                        >
                          📸 Screenshot
                        </a>
                      ) : (
                        <span className="admin-screenshot-badge no-screenshot">
                          ⚠️ No Screenshot
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="admin-order-body">
                    {/* Order Items */}
                    <div className="admin-order-items">
                      {order.orderedFoodItems?.map((item, idx) => {
                        // Per-line classification badge mirrors AdminOrdersTab
                        // so the same vocabulary surfaces wherever an admin
                        // reviews orders. Local helpers keep the existing
                        // file self-contained.
                        const itemFoodCategory = item.foodCategory ?? "";
                        const maxCatId = (() => {
                          if (itemFoodCategory == null || itemFoodCategory === "")
                            return 0;
                          const ids = String(itemFoodCategory)
                            .split(",")
                            .map((c) => parseInt(c.trim(), 10));
                          return Math.max(...ids.filter((c) => !isNaN(c)), 0);
                        })();
                        let classification = null;
                        if (item.pickupNow) {
                          classification = {
                            label: "Pickup Now",
                            color: "#3fb950",
                            bg: "rgba(63, 185, 80, 0.18)",
                          };
                        } else if (item.orderType === "preorder") {
                          classification = {
                            label: "Pre-Order",
                            color: "#58a6ff",
                            bg: "rgba(88, 166, 255, 0.15)",
                          };
                        } else if (maxCatId === 8) {
                          classification = {
                            label: "Group Buy",
                            color: "#e74c3c",
                            bg: "rgba(231, 76, 60, 0.15)",
                          };
                        }
                        return (
                          <div key={idx} className="admin-order-item">
                            <div
                              style={{
                                display: "flex",
                                gap: 8,
                                alignItems: "center",
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
                                  }}
                                >
                                  {classification.label}
                                </span>
                              )}
                              {item.orderStatus &&
                                item.orderStatus !== order.orderStatus && (
                                  <span
                                    className={`admin-order-status ${item.orderStatus}`}
                                    style={{ marginLeft: 8, fontSize: 10 }}
                                  >
                                    {item.orderStatus}
                                  </span>
                                )}
                            </div>
                            <span className="admin-order-item-price">
                              ${(item.price * (item.quantity || 1)).toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Payment Breakdown */}
                    <div className="admin-order-payment">
                      <div className="admin-payment-item">
                        <span className="admin-payment-label">Total</span>
                        <span className="admin-payment-value total-highlight">
                          $
                          {(
                            parseFloat(order.orderTotalCoast) || 0
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="admin-payment-item">
                        <span className="admin-payment-label">
                          Paid from Balance
                        </span>
                        <span className="admin-payment-value balance-highlight">
                          $
                          {(
                            parseFloat(order.paidFromBalance) ||
                            parseFloat(order.balanceUsed) ||
                            0
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="admin-payment-item">
                        <span className="admin-payment-label">
                          Paid Online
                        </span>
                        <span className="admin-payment-value online-highlight">
                          $
                          {(
                            parseFloat(order.paidFromOnline) ||
                            parseFloat(order.remainingPayment) ||
                            0
                          ).toFixed(2)}
                        </span>
                      </div>
                      <div className="admin-payment-item">
                        <span className="admin-payment-label">
                          Payment Type
                        </span>
                        <span className="admin-payment-value" style={{ fontSize: 14 }}>
                          {order.paymentType || "online"}
                        </span>
                      </div>
                      {order.balancePaidInFull && (
                        <div className="admin-payment-item">
                          <span className="admin-payment-label">Note</span>
                          <span
                            className="admin-payment-value"
                            style={{ color: "#d29922", fontSize: 13 }}
                          >
                            ⚠️ Fully paid by balance
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Kitchen Info */}
                    <div
                      style={{
                        marginTop: 12,
                        fontSize: 12,
                        color: "#6e7681",
                        display: "flex",
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <span>🏪 {order.kitchenName || "—"}</span>
                      <span>📍 {order.pickUpAddress || "—"}</span>
                      {order.isDeliverydSelected && (
                        <span>🚚 Delivery: {order.deliveryAddress || "—"}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Credit Requests ──────────────────────────────────────── */}
        {activeTab === "credits" && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2 className="admin-section-title">
                💳 Credit Requests
                <span className="admin-section-count">
                  {creditRequests.length}
                </span>
              </h2>
            </div>

            {creditRequests.length === 0 ? (
              <div className="admin-empty">
                <div className="admin-empty-icon">📭</div>
                <div className="admin-empty-text">
                  No credit requests found.
                </div>
              </div>
            ) : (
              creditRequests.map((req) => (
                <div key={req.id} className="admin-credit-card">
                  <div>
                    <div className="admin-credit-amount">
                      ${(req.amount || 0).toFixed(2)}
                    </div>
                    <div className="admin-credit-date">
                      {formatTimestamp(req.createdAt)}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    {req.screenshotUrl && (
                      <a
                        href={req.screenshotUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="admin-credit-screenshot"
                      >
                        📸 View Screenshot
                      </a>
                    )}
                    <span
                      className={`admin-credit-status ${req.status}`}
                    >
                      {req.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
