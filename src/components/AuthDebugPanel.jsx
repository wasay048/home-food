import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleDummyAuth } from "../store/slices/authSlice";

const AuthDebugPanel = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const handleToggleDummyAuth = () => {
    dispatch(toggleDummyAuth());
  };

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
        <strong>Development Mode:</strong>{" "}
        <span style={{ color: authState.isDevelopmentMode ? "blue" : "gray" }}>
          {authState.isDevelopmentMode ? "🔧 ON" : "OFF"}
        </span>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <strong>User:</strong>{" "}
        {authState.user ? (
          <span style={{ color: "green" }}>
            {authState.user.displayName || "Dummy User"}
          </span>
        ) : (
          <span style={{ color: "red" }}>None</span>
        )}
      </div>

      <button
        onClick={handleToggleDummyAuth}
        style={{
          padding: "5px 10px",
          backgroundColor: authState.isAuthenticated ? "#dc3545" : "#28a745",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "11px",
        }}
      >
        {authState.isAuthenticated ? "🔓 Logout" : "🔑 Login as Dummy"}
      </button>

      <div style={{ marginTop: "10px", fontSize: "10px", color: "#6c757d" }}>
        Click to toggle dummy user authentication
      </div>
    </div>
  );
};

export default AuthDebugPanel;
