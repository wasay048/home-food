import React from "react";
import { Link } from "react-router-dom";

export default function SuccessPage() {
  return (
    <div className="container py-5 text-center">
      <div className="display-6 mb-3" style={{ fontSize: "2rem" }}>
        ✅ Success
      </div>
      <p className="text-secondary small mb-4">
        Your order has been placed (placeholder confirmation).
      </p>
      <Link to="/foods" className="btn btn-outline-primary btn-sm">
        Back to Listing
      </Link>
    </div>
  );
}
