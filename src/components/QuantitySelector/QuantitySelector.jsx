import React from "react";
import { useQuantityManager } from "../../hooks/useQuantityManager";
import "./QuantitySelector.css";

/**
 * Reusable Quantity Selector Component
 * Handles both Go&Grab and Pre-Order scenarios with existing design
 */
export default function QuantitySelector({
  food,
  kitchen,
  selectedDate = null,
  initialQuantity = 1,
  onQuantityChange = null,
  onError = null,
  onWarning = null,
  onAvailabilityChange = null, // New prop to notify parent about availability
  showAvailabilityInfo = false, // Keep design minimal by default
  showErrorMessages = true,
  className = "",
  size = "medium",
}) {
  const {
    quantity,
    increment,
    decrement,
    error,
    warning,
    availabilityInfo,
    canIncrement,
    canDecrement,
    isValid,
  } = useQuantityManager({
    food,
    kitchen,
    selectedDate,
    initialQuantity,
    onQuantityChange,
    onError,
    onWarning,
  });

  // Notify parent component about availability changes
  React.useEffect(() => {
    if (onAvailabilityChange) {
      onAvailabilityChange({
        isAvailable: availabilityInfo.isAvailable,
        quantity,
        orderType: availabilityInfo.orderType,
        maxQuantity: availabilityInfo.maxQuantity,
        availableItems: availabilityInfo.availableItems,
        isUnlimited: availabilityInfo.isUnlimited,
      });
    }
  }, [availabilityInfo.isAvailable, quantity, onAvailabilityChange]);

  // If not available, show disabled state with original design
  if (!availabilityInfo.isAvailable) {
    return (
      <div className={`quantity-selector-wrapper unavailable ${className}`}>
        {showAvailabilityInfo && availabilityInfo.reason && (
          <div className="availability-error">{availabilityInfo.reason}</div>
        )}
        <div className="right disabled">
          <div className="count">0</div>
          <div className="counter">
            <div className="button disabled">
              <svg
                width="13"
                height="2"
                viewBox="0 0 13 2"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.887695"
                  width="11.6854"
                  height="1.46067"
                  fill="white"
                />
              </svg>
            </div>
            <div className="button disabled">
              <svg
                width="13"
                height="12"
                viewBox="0 0 13 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.707673 5.27007H12.3931V6.73075H0.707673V5.27007Z"
                  fill="white"
                />
                <path
                  d="M7.28071 0.157715L7.28071 11.8431H5.82003L5.82003 0.157715L7.28071 0.157715Z"
                  fill="white"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Available state with original design
  return (
    <div
      className={`quantity-selector-wrapper ${className} ${
        !isValid ? "invalid" : ""
      }`}
    >
      {showAvailabilityInfo && (
        <div className="availability-info">
          <div className="order-type">
            {availabilityInfo.orderType === "GO_GRAB" ? (
              <span className="tag go-grab">Go & Grab</span>
            ) : (
              <span className="tag pre-order">Pre-Order ({selectedDate})</span>
            )}
          </div>
          {availabilityInfo.isUnlimited ? (
            <div className="availability unlimited">Unlimited Available</div>
          ) : (
            <div className="availability limited">
              {availabilityInfo.availableItems} Available
            </div>
          )}
        </div>
      )}

      <div className="right">
        <div className="count">{quantity}</div>
        <div className="counter">
          <div
            className={`button ${!canDecrement ? "disabled" : ""}`}
            onClick={canDecrement ? decrement : undefined}
            title={
              !canDecrement
                ? `Minimum quantity is ${availabilityInfo.minQuantity}`
                : "Decrease quantity"
            }
          >
            <svg
              width="13"
              height="2"
              viewBox="0 0 13 2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.887695"
                width="11.6854"
                height="1.46067"
                fill="white"
              />
            </svg>
          </div>
          <div
            className={`button dark ${!canIncrement ? "disabled" : ""}`}
            onClick={canIncrement ? increment : undefined}
            title={
              !canIncrement
                ? availabilityInfo.isUnlimited
                  ? ""
                  : `Maximum available quantity is ${availabilityInfo.maxQuantity}`
                : "Increase quantity"
            }
          >
            <svg
              width="13"
              height="12"
              viewBox="0 0 13 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.707673 5.27007H12.3931V6.73075H0.707673V5.27007Z"
                fill="white"
              />
              <path
                d="M7.28071 0.157715L7.28071 11.8431H5.82003L5.82003 0.157715L7.28071 0.157715Z"
                fill="white"
              />
            </svg>
          </div>
        </div>
      </div>

      {showErrorMessages && (error || warning) && (
        <div className="messages">
          {error && <div className="error-message">{error}</div>}
          {warning && <div className="warning-message">{warning}</div>}
        </div>
      )}
    </div>
  );
}
