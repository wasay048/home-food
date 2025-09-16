import React, { useState } from "react";

const ErrorTest = () => {
  const [shouldError, setShouldError] = useState(false);

  if (shouldError) {
    throw new Error("This is a test error for debugging!");
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Error Boundary Test</h2>
      <button
        onClick={() => setShouldError(true)}
        style={{
          padding: "10px 20px",
          backgroundColor: "#ff6b6b",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        🚨 Trigger Test Error
      </button>
    </div>
  );
};

export default ErrorTest;
