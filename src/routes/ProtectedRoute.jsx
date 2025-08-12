import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute() {
  const { user, initializing } = useAuth();
  const location = useLocation();

  if (initializing)
    return (
      <div className="d-flex vh-100 align-items-center justify-content-center">
        Loading...
      </div>
    );
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
