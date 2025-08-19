import React from "react";
import "./MobileLoader.css";

export default function MobileLoader({
  isLoading = true,
  text = "Loading...",
  overlay = true,
  size = "medium", // small, medium, large
}) {
  if (!isLoading) return null;

  const sizeClasses = {
    small: "spinner-sm",
    medium: "spinner-md",
    large: "spinner-lg",
  };

  const LoaderContent = () => (
    <div className={`mobile-loader-content ${overlay ? "overlay" : "inline"}`}>
      <div className="loader-spinner-wrapper">
        <div className={`custom-spinner ${sizeClasses[size]}`}>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        {text && <p className="loader-text">{text}</p>}
      </div>
    </div>
  );

  return overlay ? (
    <div className="mobile-loader-overlay">
      <LoaderContent />
    </div>
  ) : (
    <LoaderContent />
  );
}
