import React from "react";

export default function CheckoutPage() {
  return (
    <div className="container py-3">
      <h1 className="h5 mb-3">Checkout</h1>
      <p className="text-secondary small">
        Public placeholder — will require authentication later.
      </p>
      <div className="card p-3 small">
        <p className="mb-2">Order Summary (placeholder)</p>
        <button className="btn btn-primary btn-sm" disabled>
          Proceed to Payment (stub)
        </button>
      </div>
    </div>
  );
}
