import React, { useState, useEffect, useCallback, useMemo } from "react";
import dayjs from "dayjs";
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
  size = "medium", // small, medium, large
  className = "",
  disabled = false,
}) => {
  // Suppress unused parameter warnings by using them in debug logging
  console.log("QuantitySelector render params:", {
    showAvailabilityInfo,
    showErrorMessages,
  });
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", body: "" });
  const [quantity, setQuantity] = useState(initialQuantity);
  const [availabilityStatus, setAvailabilityStatus] = useState({
    isAvailable: true,
    maxAvailable: maxQuantity,
    orderType: selectedDate ? "PRE_ORDER" : "GO_GRAB", // Always PRE_ORDER when selectedDate exists
    message: null,
    warning: null,
    actualCheckingDate: selectedDate, // The date actually being checked for availability
  });

  // Memoize the availability calculation to prevent unnecessary re-calculations
  const calculateAvailability = useCallback(() => {
    console.log("🔍 AVAILABILITY CALCULATION START");
    console.log("DEBUG - Availability calculation:", {
      foodId: food?.id,
      foodName: food?.name,
      kitchenId: kitchen?.id,
      kitchenName: kitchen?.name,
      selectedDate,
      hasFood: !!food,
      hasKitchen: !!kitchen,
      hasPreorderSchedule: !!kitchen?.preorderSchedule?.dates,
    });

    // CASE 1: No food object provided
    if (!food) {
      console.log("DEBUG - CASE 1: No food object");
      return {
        isAvailable: false,
        maxAvailable: 0,
        orderType: selectedDate ? "PRE_ORDER" : "GO_GRAB",
        message: "Food item not found",
        warning: null,
        actualCheckingDate: selectedDate,
      };
    }

    const today = dayjs().startOf("day");

    // Get current Go&Grab availability
    const numAvailable =
      food.availability?.numAvailable || food.numAvailable || 0;
    console.log("DEBUG - Go&Grab availability check:", { numAvailable });

    // CASE 2: Go&Grab items with availability > 0 (HIGHEST PRIORITY)
    // This case ignores date completely - if items are available, it's Go&Grab
    if (numAvailable > 0) {
      console.log(
        "DEBUG - CASE 2: Items available for Go&Grab, ignoring date validation"
      );
      return {
        isAvailable: true,
        maxAvailable: Math.min(numAvailable, maxQuantity),
        orderType: "GO_GRAB", // Force Go&Grab when items are available
        message: null,
        warning: numAvailable < 5 ? `Only ${numAvailable} left` : null,
        actualCheckingDate: null, // No date restriction for Go&Grab
      };
    }

    // CASE 3: Selected date provided, but need to validate it's not in the past
    if (selectedDate) {
      const orderDate = dayjs(selectedDate).startOf("day");

      // CASE 3A: Past date selected - ignore Pre-Order, fall back to current availability
      if (orderDate.isBefore(today)) {
        console.log(
          "DEBUG - CASE 3A: Selected date is in the past, ignoring Pre-Order check:",
          {
            selectedDate,
            today: today.format("YYYY-MM-DD"),
            isPast: true,
          }
        );

        // Check if we have current availability for Go&Grab
        if (numAvailable > 0) {
          console.log(
            "DEBUG - CASE 3A: Has current availability, allowing Go&Grab"
          );
          return {
            isAvailable: true,
            maxAvailable: Math.min(numAvailable, maxQuantity),
            orderType: "GO_GRAB",
            message: null,
            warning: numAvailable < 5 ? `Only ${numAvailable} left` : null,
            actualCheckingDate: null,
          };
        } else {
          console.log("DEBUG - CASE 3A: No current availability, sold out");
          return {
            isAvailable: false,
            maxAvailable: 0,
            orderType: "GO_GRAB",
            message: "Sold Out",
            warning: null,
            actualCheckingDate: null,
          };
        }
      }

      // CASE 3B: Future date selected - check Pre-Order
      console.log(
        "DEBUG - CASE 3B: Checking Pre-Order for future date:",
        selectedDate
      );

      const orderType = "PRE_ORDER";

      // CASE 3B-1: No preorder schedule exists
      if (!kitchen?.preorderSchedule?.dates) {
        console.log("DEBUG - CASE 3B-1: No preorder schedule");
        return {
          isAvailable: false,
          maxAvailable: 0,
          orderType,
          message: "Pre-orders not available for this kitchen",
          warning: null,
          actualCheckingDate: selectedDate,
        };
      }

      // Format the date key for schedule lookup
      const dateKey = selectedDate.includes("-")
        ? selectedDate
        : dayjs(selectedDate).format("YYYY-MM-DD");

      const scheduleForDate = kitchen.preorderSchedule.dates[dateKey];

      // CASE 3B-2: No schedule found for this specific date
      if (!scheduleForDate || !Array.isArray(scheduleForDate)) {
        console.log("DEBUG - CASE 3B-2: No schedule found for date");
        return {
          isAvailable: false,
          maxAvailable: 0,
          orderType,
          message: "Not available for pre-order on selected date",
          warning: null,
          actualCheckingDate: selectedDate,
        };
      }

      // Find this specific food in the schedule
      const foodSchedule = scheduleForDate.find(
        (item) => item.foodItemId === food.id
      );

      // CASE 3B-3: Food not found in the schedule for this date
      if (!foodSchedule) {
        console.log("DEBUG - CASE 3B-3: Food not found in schedule");
        return {
          isAvailable: false,
          maxAvailable: 0,
          orderType,
          message: "This item is not available for pre-order on selected date",
          warning: null,
          actualCheckingDate: selectedDate,
        };
      }

      // CASE 3B-4: Food found in schedule - check if it's limited order
      if (foodSchedule.isLimitedOrder === false) {
        // Limited quantity pre-order
        const availableItems = foodSchedule.numOfAvailableItems || 0;
        console.log("DEBUG - CASE 3B-4A: Limited pre-order", {
          availableItems,
        });

        return {
          isAvailable: availableItems > 0,
          maxAvailable: Math.min(availableItems, maxQuantity),
          orderType,
          message: availableItems <= 0 ? "Sold Out" : null,
          warning:
            availableItems < 5 && availableItems > 0
              ? `Only ${availableItems} left`
              : null,
          actualCheckingDate: selectedDate,
        };
      } else {
        // Unlimited pre-order
        console.log("DEBUG - CASE 3B-4B: Unlimited pre-order");
        return {
          isAvailable: true,
          maxAvailable: maxQuantity,
          orderType,
          message: null,
          warning: null,
          actualCheckingDate: selectedDate,
        };
      }
    }

    // CASE 4: No selected date and no current availability - completely sold out
    console.log("DEBUG - CASE 4: No availability anywhere, item sold out");
    return {
      isAvailable: false,
      maxAvailable: 0,
      orderType: "GO_GRAB",
      message: "Sold Out",
      warning: null,
      actualCheckingDate: null,
    };
  }, [food, kitchen, selectedDate, maxQuantity]);

  // Memoize the availability status to prevent unnecessary updates
  const currentAvailability = useMemo(
    () => calculateAvailability(),
    [calculateAvailability]
  );
  console.log("DEBUG - Current availability:", currentAvailability);
  // Update availability status only when it actually changes
  useEffect(() => {
    const hasChanged =
      currentAvailability.isAvailable !== availabilityStatus.isAvailable ||
      currentAvailability.maxAvailable !== availabilityStatus.maxAvailable ||
      currentAvailability.orderType !== availabilityStatus.orderType ||
      currentAvailability.message !== availabilityStatus.message ||
      currentAvailability.warning !== availabilityStatus.warning ||
      currentAvailability.actualCheckingDate !==
        availabilityStatus.actualCheckingDate;

    if (hasChanged) {
      setAvailabilityStatus(currentAvailability);
    }
  }, [currentAvailability, availabilityStatus]);

  // Handle quantity changes
  const handleQuantityChange = useCallback(
    (newQuantity) => {
      console.log(
        "🔥 QuantitySelector handleQuantityChange called with:",
        newQuantity
      );
      console.log("🔥 Current state:", {
        quantity,
        minQuantity,
        maxAvailable: availabilityStatus.maxAvailable,
      });

      // Allow quantity 0 for removing items from cart
      if (newQuantity < 0 || newQuantity > availabilityStatus.maxAvailable) {
        console.log("🔥 Invalid quantity, not updating");

        // Show appropriate messages but don't update quantity
        if (newQuantity > availabilityStatus.maxAvailable) {
          if (availabilityStatus.maxAvailable === 0) {
            alert(
              "The item is currently sold out. Please check back later or choose another item."
            );
          } else {
            alert(
              `Currently only ${availabilityStatus.maxAvailable} items are available.`
            );
          }
          onError(
            `Maximum available quantity is ${availabilityStatus.maxAvailable}`
          );
        } else if (newQuantity < 0) {
          onError(`Quantity cannot be negative`);
        }

        return; // Don't update quantity or call parent
      }

      // Only update if quantity actually changed
      if (newQuantity !== quantity) {
        console.log("🔥 Setting new quantity:", newQuantity);
        setQuantity(newQuantity);

        // Call parent callback with the new quantity
        console.log("🔥 Calling parent onQuantityChange with:", newQuantity);
        onQuantityChange(newQuantity);
      } else {
        console.log("🔥 Quantity unchanged, skipping update");
      }
    },
    [quantity, availabilityStatus.maxAvailable, onQuantityChange, onError]
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

  useEffect(() => {
    console.log("🔄 QuantitySelector initialQuantity effect:", {
      initialQuantity,
      currentQuantity: quantity,
      foodId: food?.id,
      selectedDate,
    });

    // Always sync with the parent's initial quantity
    if (initialQuantity !== quantity) {
      console.log("🔄 Syncing quantity:", initialQuantity);
      setQuantity(initialQuantity);
    }
  }, [initialQuantity]);

  // Fix the increment function

  const increment = useCallback(() => {
    console.log("🔥 INCREMENT CLICKED!", {
      disabled,
      availabilityStatus: availabilityStatus.isAvailable,
      currentQuantity: quantity,
      maxAvailable: availabilityStatus.maxAvailable,
    });

    if (disabled || !availabilityStatus.isAvailable) {
      alert(
        "The item is currently sold out. Please check back later or choose another item."
      );
      console.log("🔥 INCREMENT BLOCKED: Item not available");
      return;
    }

    const newQuantity = quantity + 1;

    // Check if we're at the limit before calling handleQuantityChange
    if (newQuantity > availabilityStatus.maxAvailable) {
      console.log("🔥 INCREMENT BLOCKED: At maximum quantity");
      if (availabilityStatus.maxAvailable === 0) {
        alert(
          "The item is currently sold out. Please check back later or choose another item."
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
    handleQuantityChange(newQuantity);
  }, [
    disabled,
    availabilityStatus.isAvailable,
    availabilityStatus.maxAvailable,
    quantity,
    handleQuantityChange,
  ]);

  // Fix the decrement function

  // Fix the decrement function to allow 0

  const decrement = useCallback(() => {
    console.log("🔥 DECREMENT CLICKED!", {
      disabled,
      currentQuantity: quantity,
      minQuantity,
    });

    if (disabled) {
      console.log("🔥 DECREMENT BLOCKED: Component disabled");
      return;
    }

    const newQuantity = quantity - 1;

    // Allow going to 0 to remove item from cart
    if (newQuantity < 0) {
      console.log("🔥 DECREMENT BLOCKED: Cannot go below 0");
      return;
    }

    console.log(
      "🔥 DECREMENT: Calling handleQuantityChange with:",
      newQuantity
    );
    handleQuantityChange(newQuantity);
  }, [disabled, quantity, handleQuantityChange]);

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
          <span className="quantity-number">{quantity}</span>
        </div>

        <div className="quantity-selector__buttons">
          <button
            type="button"
            className="quantity-btn quantity-btn--decrement"
            onClick={decrement}
            disabled={disabled || quantity <= 0}
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
            //   quantity >= availabilityStatus.maxAvailable
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
