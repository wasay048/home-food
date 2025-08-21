import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  const [quantity, setQuantity] = useState(initialQuantity);
  const [availabilityStatus, setAvailabilityStatus] = useState({
    isAvailable: true,
    maxAvailable: maxQuantity,
    orderType: selectedDate ? "PRE_ORDER" : "GO_GRAB",
    message: null,
    warning: null,
  });

  // Memoize the availability calculation to prevent unnecessary re-calculations
  const calculateAvailability = useCallback(() => {
    console.log("DEBUG - Availability calculation:", {
      foodId: food?.id,
      kitchenId: kitchen?.id,
      selectedDate,
      hasFood: !!food,
      hasKitchen: !!kitchen,
      hasPreorderSchedule: !!kitchen?.preorderSchedule?.dates,
    });

    if (!food) {
      console.log("DEBUG - No food object");
      return {
        isAvailable: false,
        maxAvailable: 0,
        orderType: selectedDate ? "PRE_ORDER" : "GO_GRAB",
        message: "Food item not found",
        warning: null,
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Determine order type and availability
    if (selectedDate) {
      const orderDate = new Date(selectedDate);
      orderDate.setHours(0, 0, 0, 0);

      if (orderDate > today) {
        // Case 1: Future date - PRE_ORDER
        const orderType = "PRE_ORDER";

        console.log("DEBUG - Future date PRE_ORDER case");

        if (!kitchen?.preorderSchedule?.dates) {
          console.log("DEBUG - No preorder schedule");
          return {
            isAvailable: false,
            maxAvailable: 0,
            orderType,
            message: "Pre-orders not available for this kitchen",
            warning: null,
          };
        }

        // Format date as YYYY-MM-DD to match kitchen schedule format
        const dateKey = selectedDate.includes("-")
          ? selectedDate // If already in YYYY-MM-DD format, use as is
          : (() => {
              const orderDate = new Date(selectedDate);
              // Use local date formatting to avoid timezone conversion
              const year = orderDate.getFullYear();
              const month = String(orderDate.getMonth() + 1).padStart(2, "0");
              const day = String(orderDate.getDate()).padStart(2, "0");
              return `${year}-${month}-${day}`;
            })();
        console.log("🚀 ~ QuantitySelector ~ dateKey:", dateKey);
        console.log(
          "🚀 ~ QuantitySelector ~ kitchen.preorderSchedule.dates:",
          kitchen.preorderSchedule.dates
        );
        const scheduleForDate = kitchen.preorderSchedule.dates[dateKey];

        console.log("DEBUG - Date lookup:", {
          dateKey,
          hasScheduleForDate: !!scheduleForDate,
          scheduleForDate,
          availableDates: Object.keys(kitchen.preorderSchedule.dates),
        });

        if (!scheduleForDate || !Array.isArray(scheduleForDate)) {
          console.log("DEBUG - No schedule found for date");
          return {
            isAvailable: false,
            maxAvailable: 0,
            orderType,
            message: "Not available for pre-order on selected date",
            warning: null,
          };
        }

        // Find the specific food item in the schedule
        const foodSchedule = scheduleForDate.find(
          (item) => item.foodItemId === food.id
        );
        console.log("🚀 ~ QuantitySelector ~ foodSchedule:", foodSchedule);

        console.log("DEBUG - Food schedule lookup:", {
          foodId: food.id,
          foodSchedule,
          allItemsInSchedule: scheduleForDate.map((item) => ({
            id: item.foodItemId,
            name: item.nameOfFood,
          })),
        });

        if (!foodSchedule) {
          console.log("DEBUG - Food not found in schedule");
          return {
            isAvailable: false,
            maxAvailable: 0,
            orderType,
            message:
              "This item is not available for pre-order on selected date",
            warning: null,
          };
        }

        // Check availability based on isLimitedOrder
        console.log("DEBUG - Food schedule details:", {
          isLimitedOrder: foodSchedule.isLimitedOrder,
          numOfAvailableItems: foodSchedule.numOfAvailableItems,
          availableTimes: foodSchedule.availableTimes,
        });

        // Fix the logic: isLimitedOrder === false means it's LIMITED (not unlimited)
        if (foodSchedule.isLimitedOrder === false) {
          // Limited order - check numOfAvailableItems
          const availableItems = foodSchedule.numOfAvailableItems || 0;

          console.log("DEBUG - Limited order case:", { availableItems });

          if (availableItems <= 0) {
            return {
              isAvailable: false,
              maxAvailable: 0,
              orderType,
              message: "Sold out for pre-order on selected date",
              warning: null,
            };
          }

          console.log(
            "Math.min(availableItems, maxQuantity)",
            Math.min(availableItems, maxQuantity)
          );
          return {
            isAvailable: true,
            maxAvailable: Math.min(availableItems, maxQuantity),
            orderType,
            message: null,
            warning:
              availableItems < 5
                ? `Only ${availableItems} left for pre-order`
                : null,
          };
        } else {
          // Unlimited order - user can add as many as possible
          console.log("DEBUG - Unlimited order case");
          return {
            isAvailable: true,
            maxAvailable: maxQuantity,
            orderType,
            message: null,
            warning: null,
          };
        }
      } else if (orderDate.getTime() === today.getTime()) {
        // Case 2: Today's date - check current availability
        const orderType = "GO_GRAB";
        const numAvailable = food.numAvailable || 0;

        console.log("DEBUG - Today's date GO_GRAB:", { numAvailable });

        if (numAvailable <= 0) {
          return {
            isAvailable: false,
            maxAvailable: 0,
            orderType,
            message: "Not available",
            warning: null,
          };
        }

        return {
          isAvailable: true,
          maxAvailable: Math.min(numAvailable, maxQuantity),
          orderType,
          message: null,
          warning: numAvailable < 5 ? `Only ${numAvailable} left` : null,
        };
      } else {
        // Past date
        console.log("DEBUG - Past date");
        return {
          isAvailable: false,
          maxAvailable: 0,
          orderType: "PRE_ORDER",
          message: "Selected date is in the past",
          warning: null,
        };
      }
    } else {
      // Case 3: No selectedDate - GO_GRAB
      const orderType = "GO_GRAB";
      const numAvailable = food.numAvailable || 0;

      console.log("DEBUG - No date GO_GRAB:", { numAvailable });

      if (numAvailable <= 0) {
        return {
          isAvailable: false,
          maxAvailable: 0,
          orderType,
          message: "Sold Out",
          warning: null,
        };
      }

      return {
        isAvailable: true,
        maxAvailable: Math.min(numAvailable, maxQuantity),
        orderType,
        message: null,
        warning: numAvailable < 5 ? `Only ${numAvailable} left` : null,
      };
    }
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
      currentAvailability.warning !== availabilityStatus.warning;

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

      const validQuantity = Math.max(
        minQuantity,
        Math.min(newQuantity, availabilityStatus.maxAvailable)
      );

      console.log("🔥 Valid quantity calculated:", validQuantity);

      if (validQuantity !== quantity) {
        console.log("🔥 Setting new quantity:", validQuantity);
        setQuantity(validQuantity);

        // Call parent callbacks
        console.log("🔥 Calling parent onQuantityChange with:", validQuantity);
        onQuantityChange(validQuantity);

        // Handle warnings and errors
        if (newQuantity > availabilityStatus.maxAvailable) {
          const errorMsg = `Maximum available quantity is ${availabilityStatus.maxAvailable}`;
          onError(errorMsg);
        } else if (newQuantity < minQuantity) {
          const errorMsg = `Minimum quantity is ${minQuantity}`;
          onError(errorMsg);
        }
      } else {
        console.log("🔥 Quantity unchanged, skipping update");
      }
    },
    [
      quantity,
      availabilityStatus.maxAvailable,
      minQuantity,
      onQuantityChange,
      onError,
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
      onError(availabilityStatus.message);
    }
  }, [availabilityStatus, onAvailabilityChange, onWarning, onError]);

  // Reset quantity when initialQuantity changes (but only on initial mount)
  useEffect(() => {
    if (
      initialQuantity !== quantity &&
      initialQuantity >= minQuantity &&
      quantity === 1
    ) {
      console.log(
        "🔥 INITIAL QUANTITY EFFECT: Setting quantity to:",
        initialQuantity
      );
      setQuantity(initialQuantity);
    }
  }, [initialQuantity, minQuantity]);

  const increment = useCallback(() => {
    console.log("🔥 INCREMENT CLICKED!", {
      disabled,
      availabilityStatus: availabilityStatus.isAvailable,
      quantity,
    });
    if (!disabled && availabilityStatus.isAvailable) {
      console.log(
        "🔥 INCREMENT: Calling handleQuantityChange with:",
        quantity + 1
      );
      handleQuantityChange(quantity + 1);
    } else {
      console.log("🔥 INCREMENT BLOCKED:", {
        disabled,
        isAvailable: availabilityStatus.isAvailable,
      });
    }
  }, [
    disabled,
    availabilityStatus.isAvailable,
    quantity,
    handleQuantityChange,
  ]);

  const decrement = useCallback(() => {
    console.log("🔥 DECREMENT CLICKED!", { disabled, quantity, minQuantity });
    if (!disabled && quantity > minQuantity) {
      console.log(
        "🔥 DECREMENT: Calling handleQuantityChange with:",
        quantity - 1
      );
      handleQuantityChange(quantity - 1);
    } else {
      console.log("🔥 DECREMENT BLOCKED:", { disabled, quantity, minQuantity });
    }
  }, [disabled, quantity, minQuantity, handleQuantityChange]);

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
      {showAvailabilityInfo && (
        <div className="quantity-selector__availability">
          {availabilityStatus.orderType === "PRE_ORDER" && (
            <span className="availability-badge availability-badge--pre-order">
              Pre-Order {selectedDate && `• ${selectedDate}`}
            </span>
          )}
          {availabilityStatus.orderType === "GO_GRAB" && (
            <span className="availability-badge availability-badge--go-grab">
              Go & Grab
            </span>
          )}
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
            disabled={disabled || quantity <= minQuantity}
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
            disabled={
              disabled ||
              !availabilityStatus.isAvailable ||
              quantity >= availabilityStatus.maxAvailable
            }
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

      {/* {showErrorMessages && (
        <>
          {availabilityStatus.warning && (
            <div className="quantity-selector__warning">
              <span className="warning-text">{availabilityStatus.warning}</span>
            </div>
          )}

          {!availabilityStatus.isAvailable && availabilityStatus.message && (
            <div className="quantity-selector__error">
              <span className="error-text">{availabilityStatus.message}</span>
            </div>
          )}
        </>
      )} */}
    </div>
  );
};

export default QuantitySelector;
