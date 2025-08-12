import React from "react";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const { user, signOut, authDisabled } = useAuth();
  return (
    <div className="container py-3">
      <h1 className="h4 mb-3">Welcome {user?.displayName || "User"}</h1>
      <p className="text-secondary small mb-4">
        This is a mobile-first boilerplate.
      </p>
      {authDisabled && (
        <div className="alert alert-warning p-2 small" role="alert">
          Firebase auth disabled (placeholder config). Add real env values to
          enable.
        </div>
      )}
      <button className="btn btn-outline-danger btn-sm" onClick={signOut}>
        Sign out
      </button>
    </div>
  );
}
