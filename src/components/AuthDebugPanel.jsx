import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/slices/authSlice";

const AuthDebugPanel = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // Don't render on mobile
  if (isMobile) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "#f8f9fa",
        padding: "15px",
        border: "2px solid #dee2e6",
        borderRadius: "8px",
        fontSize: "12px",
        fontFamily: "monospace",
        zIndex: 9999,
        maxWidth: "300px",
      }}
    >
      <h6 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>
        🔍 Auth Debug Panel
      </h6>

      <div style={{ marginBottom: "10px" }}>
        <strong>Is Authenticated:</strong>{" "}
        <span style={{ color: authState.isAuthenticated ? "green" : "red" }}>
          {authState.isAuthenticated ? "✅ YES" : "❌ NO"}
        </span>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <strong>Auth Status:</strong>{" "}
        <span style={{ color: authState.loading ? "orange" : "gray" }}>
          {authState.loading ? "� LOADING" : "READY"}
        </span>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <strong>User:</strong>{" "}
        {authState.user ? (
          <span style={{ color: "green" }}>
            {authState.user.nickname || authState.user.openid || "WeChat User"}
          </span>
        ) : (
          <span style={{ color: "red" }}>None</span>
        )}
      </div>

      {authState.error && (
        <div style={{ marginBottom: "10px", color: "red" }}>
          <strong>Error:</strong> {authState.error}
        </div>
      )}

      {authState.isAuthenticated && (
        <button
          onClick={handleLogout}
          style={{
            padding: "5px 10px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "11px",
          }}
        >
          🔓 Logout
        </button>
      )}

      <div style={{ marginTop: "10px", fontSize: "10px", color: "#6c757d" }}>
        WeChat Authentication System
      </div>
    </div>
  );
};

export default AuthDebugPanel;
