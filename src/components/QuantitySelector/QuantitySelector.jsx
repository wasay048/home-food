import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useGenericCart } from "../../hooks/useGenericCart";
import "./QuantitySelector.css";

const QuantitySelector = ({
  food = null,
  kitchen = null,
  selectedDate = null,
  initialQuantity = 1,
  maxQuantity = 99,
  minQuantity = 1,
  onQuantityChange = () => {},
  onAvailabilityChange = () => {},
  onError = () => {},
  onWarning = () => {},
  showAvailabilityInfo = true,
  showErrorMessages = true,
  size = "medium",
  className = "",
  disabled = false,
}) => {
  // ✅ USE: Get functions from useGenericCart hook
  const {
    calculateAvailability,
    getCartQuantity,
    handleQuantityChange: handleCartQuantityChange,
  } = useGenericCart();

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", body: "" });

  // ✅ CRITICAL FIX: Always sync with cart quantity
  const cartQuantity = useMemo(() => {
    if (!food?.id) return 0;
    return getCartQuantity(food.id, selectedDate);
  }, [food?.id, selectedDate, getCartQuantity]);

  // ✅ USE: Get availability from useGenericCart
  const availabilityStatus = useMemo(
    () => calculateAvailability(food, kitchen, selectedDate, maxQuantity),
    [calculateAvailability, food, kitchen, selectedDate, maxQuantity]
  );

  // ✅ CRITICAL FIX: Only call cart operations, don't call parent callback to prevent double operations
  const handleQuantityChangeLocal = useCallback(
    (newQuantity) => {
      // Validate quantity bounds
      if (newQuantity < 0) {
        onError("Quantity cannot be negative");
        return;
      }

      if (newQuantity > availabilityStatus.maxAvailable) {
        if (availabilityStatus.maxAvailable === 0) {
          alert(
            "♡ this food to the chef that we want it! When it is added to Go&Grab or Pre-Order, you will be notified."
          );
        } else {
          alert(
            `Currently only ${availabilityStatus.maxAvailable} items are available.`
          );
        }
        onError(
          `Maximum available quantity is ${availabilityStatus.maxAvailable}`
        );
        return;
      }

      // ✅ CRITICAL: Only call cart operations if food and kitchen exist
      if (!food || !kitchen) {
        console.log("🔥 Missing food or kitchen data");
        onError("Missing food or kitchen information");
        return;
      }

      console.log("🔥 Calling useGenericCart handleQuantityChange:", {
        newQuantity,
        currentCartQuantity: cartQuantity,
        selectedDate,
      });

      // ✅ FIXED: Only call cart operations - don't call parent callback here
      handleCartQuantityChange({
        food,
        kitchen,
        newQuantity,
        currentQuantity: cartQuantity,
        selectedDate,
        selectedTime: null,
        specialInstructions: "",
        isPreOrder: availabilityStatus.orderType === "PRE_ORDER",
      });

      // ✅ REMOVED: Don't call parent callback here to prevent double operations
      // onQuantityChange(newQuantity);
    },
    [
      cartQuantity,
      availabilityStatus.maxAvailable,
      availabilityStatus.orderType,
      onError,
      food,
      kitchen,
      selectedDate,
      handleCartQuantityChange,
    ]
  );

  // Call availability change callback when status changes
  useEffect(() => {
    onAvailabilityChange(availabilityStatus);

    // Handle warnings
    if (availabilityStatus.warning) {
      onWarning(availabilityStatus.warning);
    }

    // Handle errors
    if (availabilityStatus.message && !availabilityStatus.isAvailable) {
      // onError(availabilityStatus.message);
    }
  }, [availabilityStatus, onAvailabilityChange, onWarning, onError]);

  // ✅ FIXED: Increment function - prevent double increments
  const increment = useCallback(() => {
    console.log("🔥 INCREMENT CLICKED!", {
      disabled,
      isAvailable: availabilityStatus.isAvailable,
      currentCartQuantity: cartQuantity,
      maxAvailable: availabilityStatus.maxAvailable,
    });

    if (disabled || !availabilityStatus.isAvailable) {
      alert(
        "♡ this food to the chef that we want it! When it is added to Go&Grab or Pre-Order, you will be notified."
      );
      console.log("🔥 INCREMENT BLOCKED: Item not available");
      return;
    }

    const newQuantity = cartQuantity + 1;

    // Check if we're at the limit
    if (newQuantity > availabilityStatus.maxAvailable) {
      console.log("🔥 INCREMENT BLOCKED: At maximum quantity");
      if (availabilityStatus.maxAvailable === 0) {
        alert(
          "♡ this food to the chef that we want it! When it is added to Go&Grab or Pre-Order, you will be notified."
        );
      } else {
        alert(
          `Currently only ${availabilityStatus.maxAvailable} items are available.`
        );
      }
      return;
    }

    console.log(
      "🔥 INCREMENT: Calling handleQuantityChange with:",
      newQuantity
    );
    handleQuantityChangeLocal(newQuantity);
  }, [
    disabled,
    availabilityStatus.isAvailable,
    availabilityStatus.maxAvailable,
    cartQuantity,
    handleQuantityChangeLocal,
  ]);

  // ✅ FIXED: Decrement function - prevent double decrements
  const decrement = useCallback(() => {
    console.log("🔥 DECREMENT CLICKED!", {
      disabled,
      currentCartQuantity: cartQuantity,
      minQuantity,
    });

    if (disabled) {
      console.log("🔥 DECREMENT BLOCKED: Component disabled");
      return;
    }

    const newQuantity = cartQuantity - 1;

    // Allow going to 0 to remove item from cart
    if (newQuantity < 0) {
      console.log("🔥 DECREMENT BLOCKED: Cannot go below 0");
      return;
    }

    console.log(
      "🔥 DECREMENT: Calling handleQuantityChange with:",
      newQuantity
    );
    handleQuantityChangeLocal(newQuantity);
  }, [disabled, cartQuantity, handleQuantityChangeLocal, minQuantity]);

  // CSS classes based on size and state
  const containerClasses = [
    "quantity-selector",
    `quantity-selector--${size}`,
    className,
    disabled && "quantity-selector--disabled",
    !availabilityStatus.isAvailable && "quantity-selector--unavailable",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClasses}>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalContent.title}</h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>{modalContent.body}</p>
              <button onClick={() => setShowModal(false)}>OK</button>
            </div>
          </div>
        </div>
      )}
      <div className="quantity-selector__controls">
        <div className="quantity-selector__display">
          <span className="quantity-number">{cartQuantity}</span>
        </div>

        <div className="quantity-selector__buttons">
          <button
            type="button"
            className="quantity-btn quantity-btn--decrement"
            onClick={decrement}
            disabled={disabled || cartQuantity <= 0}
            aria-label="Decrease quantity"
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
                fill="currentColor"
              />
            </svg>
          </button>

          <button
            type="button"
            className="quantity-btn quantity-btn--increment"
            onClick={increment}
            // disabled={
            //   disabled ||
            //   !availabilityStatus.isAvailable ||
            //   cartQuantity >= availabilityStatus.maxAvailable
            // }
            aria-label="Increase quantity"
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
                fill="currentColor"
              />
              <path
                d="M7.28071 0.157715L7.28071 11.8431H5.82003L5.82003 0.157715L7.28071 0.157715Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuantitySelector;
