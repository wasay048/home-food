import React from "react";
import { useParams } from "react-router-dom";

export default function FoodDetailPage() {
  const { foodId } = useParams();
  return (
    <div className="container py-3">
      <h1 className="h5 mb-3">Food Detail</h1>
      <p className="text-secondary small">
        Showing details for: <strong>{foodId}</strong>
      </p>
      <div className="alert alert-info p-2 small mt-3">
        Data loading placeholder — integrate real data source later.
      </div>
    </div>
  );
}
