import React from "react";

export default function ListingPage() {
  return (
    <div className="container py-3">
      <h1 className="h5 mb-3">Foods</h1>
      <p className="text-secondary small mb-4">
        Public listing of available foods (placeholder).
      </p>
      <ul className="list-group small">
        <li className="list-group-item">Sample Food A</li>
        <li className="list-group-item">Sample Food B</li>
        <li className="list-group-item">Sample Food C</li>
      </ul>
    </div>
  );
}
