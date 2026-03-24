import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";

const ADMIN_PASSWORD = "homefresh2024";
const SESSION_KEY = "admin_auth_session";

/**
 * Simple password gate for admin pages.
 * Stores auth in sessionStorage (cleared when browser tab closes).
 */
export default function AdminAuthGate({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const session = sessionStorage.getItem(SESSION_KEY);
    if (session === "true") {
      setIsAuthenticated(true);
    }
    setChecking(false);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
    setPassword("");
  };

  if (checking) {
    return (
      <div className="admin-layout">
        <div className="admin-loading">
          <div className="admin-spinner" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-layout">
        <div className="admin-auth-container">
          <div className="admin-auth-card">
            <div className="admin-auth-icon">🔐</div>
            <h1 className="admin-auth-title">Admin Access</h1>
            <p className="admin-auth-subtitle">
              Enter the admin password to continue
            </p>

            <form onSubmit={handleSubmit} className="admin-auth-form">
              <input
                type="password"
                className="admin-auth-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                autoFocus
                id="admin-password-input"
              />
              {error && <div className="admin-auth-error">{error}</div>}
              <button
                type="submit"
                className="admin-auth-btn"
                disabled={!password.trim()}
              >
                Unlock Dashboard
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated — render children with logout available via context
  return (
    <AdminAuthContext.Provider value={{ logout: handleLogout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

// Context so child pages can access logout
export const AdminAuthContext = React.createContext({ logout: () => {} });
