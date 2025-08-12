import React from "react";

export default function PaymentPage() {
  return (
    <div className="container py-3">
      <h1 className="h5 mb-3">Payment</h1>
      <p className="text-secondary small">
        Integrate payment gateway here (placeholder).
      </p>
      <div className="alert alert-warning p-2 small">
        No payment integration configured.
      </div>
    </div>
  );
}
