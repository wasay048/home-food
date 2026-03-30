import React, { useState, useEffect, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getAllUsers, searchUsers } from "../../services/adminService";
import { AdminAuthContext } from "./AdminAuthGate";
import dayjs from "../../lib/dayjs";
import "./AdminDashboard.css";
import AdminOrdersTab from "./AdminOrdersTab";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users"); // "users" or "orders"
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [onlyWithBalance, setOnlyWithBalance] = useState(false);
  const [error, setError] = useState(null);
  const { logout } = useContext(AdminAuthContext);

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        setUsers(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(
          "Failed to load users. Please check your Firebase connection.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filtered users based on search and balance toggle
  const filteredUsers = useMemo(() => {
    let result = users;

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter((user) => {
        const name = (user.name || user.wechatNickname || "").toLowerCase();
        const email = (user.email || "").toLowerCase();
        const id = (user.id || "").toLowerCase();
        const cellPhone = (user.cellPhone || "").toLowerCase();
        return (
          name.includes(term) ||
          email.includes(term) ||
          id.includes(term) ||
          cellPhone.includes(term)
        );
      });
    }

    if (onlyWithBalance) {
      result = result.filter((u) => (u.accountBalance || 0) > 0);
    }

    return result;
  }, [users, searchTerm, onlyWithBalance]);

  // Stats
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const usersWithBalance = users.filter(
      (u) => (u.accountBalance || 0) > 0,
    ).length;
    const totalBalance = users.reduce(
      (sum, u) => sum + (u.accountBalance || 0),
      0,
    );

    return { totalUsers, usersWithBalance, totalBalance };
  }, [users]);

  const formatDate = (date) => {
    if (!date) return "—";
    const d = date?.toDate ? date.toDate() : new Date(date);
    return dayjs(d).format("MMM D, YYYY");
  };

  const handleUserClick = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

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
          <span className="admin-badge">Debug Mode</span>
          <button className="admin-logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="admin-container">
        {/* Navigation Tabs */}
        <div className="admin-tabs" style={{ marginBottom: "20px" }}>
          <button
            className={`admin-tab ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            Users
          </button>
          <button
            className={`admin-tab ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            Orders by Kitchen / Category
          </button>
        </div>

        {activeTab === "users" ? (
          <>
            {/* Stats Row */}
            <div className="admin-stats-row">
              <div className="admin-stat-card">
                <div className="admin-stat-label">Total Users</div>
                <div className="admin-stat-value">{stats.totalUsers}</div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-label">Users with Balance</div>
                <div className="admin-stat-value warning">
                  {stats.usersWithBalance}
                </div>
              </div>
              <div className="admin-stat-card">
                <div className="admin-stat-label">
                  Total Outstanding Balance
                </div>
                <div className="admin-stat-value highlight">
                  ${stats.totalBalance.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="admin-search-section">
              <div className="admin-search-wrapper">
                <div className="admin-search-icon">🔍</div>
                <input
                  type="text"
                  className="admin-search-input"
                  placeholder="Search by name, email user ID, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  id="admin-user-search"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="admin-filters">
              <label className="admin-filter-toggle">
                <input
                  type="checkbox"
                  checked={onlyWithBalance}
                  onChange={(e) => setOnlyWithBalance(e.target.checked)}
                />
                Only users with balance &gt; $0
              </label>
              <span className="admin-result-count">
                Showing {filteredUsers.length} of {users.length} users
              </span>
            </div>

            {/* Loading */}
            {loading && (
              <div className="admin-loading">
                <div className="admin-spinner" />
                <div className="admin-loading-text">
                  Loading user accounts...
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="admin-empty">
                <div className="admin-empty-icon">⚠️</div>
                <div className="admin-empty-text">{error}</div>
              </div>
            )}

            {/* Users Table */}
            {!loading && !error && (
              <div className="admin-table-wrapper">
                {filteredUsers.length === 0 ? (
                  <div className="admin-empty">
                    <div className="admin-empty-icon">🔍</div>
                    <div className="admin-empty-text">
                      No users found matching your criteria.
                    </div>
                  </div>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>User ID</th>
                        <th>Balance</th>
                        <th>Registered</th>
                        <th>Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr
                          key={user.id}
                          onClick={() => handleUserClick(user.id)}
                        >
                          <td>
                            <div className="admin-user-name">
                              {user.name || user.wechatNickname || "No Name"}
                            </div>
                            <div className="admin-user-email">
                              {user.email || "—"}
                            </div>
                          </td>
                          <td>
                            <div className="admin-user-id" title={user.id}>
                              {user.id}
                            </div>
                          </td>
                          <td>
                            <div
                              className={`admin-balance-cell ${
                                (user.accountBalance || 0) > 0
                                  ? "admin-balance-positive"
                                  : "admin-balance-zero"
                              }`}
                            >
                              ${(user.accountBalance || 0).toFixed(2)}
                            </div>
                          </td>
                          <td className="admin-date-cell">
                            {formatDate(user.accountCreationDate)}
                          </td>
                          <td>
                            <span
                              className="admin-badge"
                              style={{ fontSize: 11 }}
                            >
                              {user.registeredFrom || user.isLogInWithWechat
                                ? "WeChat"
                                : "App"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        ) : (
          <AdminOrdersTab />
        )}
      </div>
    </div>
  );
}
