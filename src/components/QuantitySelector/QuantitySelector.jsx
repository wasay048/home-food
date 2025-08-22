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

    if (!food) {
      console.log("DEBUG - No food object");
      return {
        isAvailable: false,
        maxAvailable: 0,
        orderType: selectedDate ? "PRE_ORDER" : "GO_GRAB", // Maintain order type based on selectedDate
        message: "Food item not found",
        warning: null,
        actualCheckingDate: selectedDate, // Use selected date if provided
      };
    }

    const today = dayjs().startOf("day");

    // Determine order type and availability
    if (selectedDate) {
      console.log(
        "🚀 ~ QuantitySelector ~ selectedDate received:",
        selectedDate
      );
      console.log(
        "🚀 ~ QuantitySelector ~ selectedDate type:",
        typeof selectedDate
      );

      const orderDate = dayjs(selectedDate).startOf("day");

      console.log("🚀 ~ QuantitySelector ~ orderDate:", orderDate.format());
      console.log("🚀 ~ QuantitySelector ~ today:", today.format());
      console.log(
        "🚀 ~ QuantitySelector ~ orderDate > today:",
        orderDate.isAfter(today)
      );
      console.log(
        "🚀 ~ QuantitySelector ~ orderDate === today:",
        orderDate.isSame(today, "day")
      );
      console.log(
        "🚀 ~ QuantitySelector ~ orderDate < today (isPast):",
        orderDate.isBefore(today, "day")
      );

      if (orderDate.isAfter(today)) {
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
            actualCheckingDate: selectedDate, // Use selected date
          };
        }

        // Format date as YYYY-MM-DD to match kitchen schedule format
        const dateKey = selectedDate.includes("-")
          ? selectedDate // If already in YYYY-MM-DD format, use as is
          : dayjs(selectedDate).format("YYYY-MM-DD");

        console.log("🚀 ~ QuantitySelector ~ dateKey:", dateKey);
        console.log("🚀 ~ QuantitySelector ~ selectedDate:", selectedDate);
        console.log(
          "🚀 ~ QuantitySelector ~ kitchen.preorderSchedule.dates:",
          kitchen.preorderSchedule.dates
        );
        console.log(
          "🚀 ~ QuantitySelector ~ Available dates:",
          Object.keys(kitchen.preorderSchedule.dates)
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
        console.log("🚀 ~ QuantitySelector ~ food.id:", food.id);
        console.log("🚀 ~ QuantitySelector ~ food object:", food);

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
      } else if (orderDate.isSame(today, "day")) {
        // Case 2: Today's date - check BOTH current availability AND preorder schedule
        console.log(
          "DEBUG - Today's date - checking both GO_GRAB and PRE_ORDER"
        );

        // First check if there's a preorder schedule for today
        if (kitchen?.preorderSchedule?.dates) {
          const dateKey = selectedDate.includes("-")
            ? selectedDate
            : dayjs(selectedDate).format("YYYY-MM-DD");

          console.log("DEBUG - Today's date - dateKey:", dateKey);
          const scheduleForDate = kitchen.preorderSchedule.dates[dateKey];

          if (scheduleForDate && Array.isArray(scheduleForDate)) {
            const foodSchedule = scheduleForDate.find(
              (item) => item.foodItemId === food.id
            );

            console.log(
              "DEBUG - Today's date - foodSchedule found:",
              !!foodSchedule,
              foodSchedule
            );

            if (foodSchedule) {
              console.log(
                "DEBUG - Today's date found in preorder schedule - using PRE_ORDER logic"
              );

              // Use preorder logic for today if it's in the schedule
              const orderType = "PRE_ORDER";

              if (foodSchedule.isLimitedOrder === false) {
                const availableItems = foodSchedule.numOfAvailableItems || 0;

                console.log("DEBUG - Today PRE_ORDER limited case:", {
                  availableItems,
                });

                if (availableItems <= 0) {
                  return {
                    isAvailable: false,
                    maxAvailable: 0,
                    orderType,
                    message: "Sold out for today",
                    warning: null,
                  };
                }

                return {
                  isAvailable: true,
                  maxAvailable: Math.min(availableItems, maxQuantity),
                  orderType,
                  message: null,
                  warning:
                    availableItems < 5 ? `Only ${availableItems} left` : null,
                };
              } else {
                console.log("DEBUG - Today PRE_ORDER unlimited case");
                return {
                  isAvailable: true,
                  maxAvailable: maxQuantity,
                  orderType,
                  message: null,
                  warning: null,
                };
              }
            }
          }
        }

        // Fallback to regular GO_GRAB logic if not in preorder schedule
        console.log(
          "DEBUG - Today's date - no preorder schedule, falling back to GO_GRAB"
        );
        const orderType = "GO_GRAB";
        const numAvailable =
          food.availability?.numAvailable || food.numAvailable || 0;

        console.log("DEBUG - Today's date GO_GRAB fallback:", { numAvailable });

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
        // Past date - but still PRE_ORDER since selectedDate was provided
        // Check current date in preorder schedule, not Go&Grab
        console.log("🚨 PAST PRE-ORDER DATE DETECTED! 🚨");
        console.log(
          "DEBUG - Past pre-order date, checking current date in preorder schedule"
        );
        console.log(
          "DEBUG - Selected date was:",
          selectedDate,
          "which is",
          orderDate.format()
        );
        console.log("DEBUG - Current date is:", today.format());
        console.log(
          "DEBUG - Days difference:",
          today.diff(orderDate, "day"),
          "days in the past"
        );
        console.log(
          "DEBUG - Since selectedDate provided, maintaining PRE_ORDER type and checking today's preorder schedule"
        );

        const orderType = "PRE_ORDER"; // Keep as PRE_ORDER since selectedDate was provided

        // Format today's date for preorder schedule lookup
        const todayDateKey = today.format("YYYY-MM-DD");
        console.log(
          "DEBUG - Looking for today's date in preorder schedule:",
          todayDateKey
        );

        // Check if today's date exists in preorder schedule
        if (!kitchen?.preorderSchedule?.dates) {
          console.log("❌ DEBUG - No preorder schedule available");
          return {
            isAvailable: false,
            maxAvailable: 0,
            orderType,
            message: "Sold Out",
            warning: null,
            actualCheckingDate: todayDateKey, // Show which date we checked
          };
        }

        const scheduleForToday = kitchen.preorderSchedule.dates[todayDateKey];
        console.log("DEBUG - Today's preorder schedule:", scheduleForToday);

        if (!scheduleForToday || !Array.isArray(scheduleForToday)) {
          console.log(
            "❌ DEBUG - No preorder schedule for today, item sold out"
          );
          return {
            isAvailable: false,
            maxAvailable: 0,
            orderType,
            message: "Sold Out",
            warning: null,
            actualCheckingDate: todayDateKey, // Show which date we checked
          };
        }

        // Find the specific food item in today's schedule
        const foodScheduleToday = scheduleForToday.find(
          (item) => item.foodItemId === food.id
        );

        console.log(
          "DEBUG - Food found in today's preorder schedule:",
          !!foodScheduleToday,
          foodScheduleToday
        );

        if (!foodScheduleToday) {
          console.log(
            "❌ DEBUG - Food not available in today's preorder schedule"
          );
          return {
            isAvailable: false,
            maxAvailable: 0,
            orderType,
            message: "Sold Out",
            warning: null,
            actualCheckingDate: todayDateKey, // Show which date we checked
          };
        }

        // Check availability based on today's preorder schedule
        if (foodScheduleToday.isLimitedOrder === false) {
          // Limited order - check numOfAvailableItems for today
          const availableItems = foodScheduleToday.numOfAvailableItems || 0;

          console.log("DEBUG - Past date, today's limited preorder case:", {
            availableItems,
          });

          if (availableItems <= 0) {
            console.log(
              "❌ DEBUG - Past pre-order date: Item SOLD OUT for current date in preorder schedule"
            );
            return {
              isAvailable: false,
              maxAvailable: 0,
              orderType,
              message: "Sold Out",
              warning: null,
              actualCheckingDate: todayDateKey, // Show which date we checked
            };
          }

          console.log(
            "✅ DEBUG - Past pre-order date: Item AVAILABLE for current date in preorder schedule, quantity:",
            availableItems
          );
          return {
            isAvailable: true,
            maxAvailable: Math.min(availableItems, maxQuantity),
            orderType,
            message: null,
            warning: availableItems < 5 ? `Only ${availableItems} left` : null,
            actualCheckingDate: todayDateKey, // Show which date we checked
          };
        } else {
          // Unlimited order for today
          console.log(
            "✅ DEBUG - Past pre-order date: Item AVAILABLE (unlimited) for current date in preorder schedule"
          );
          return {
            isAvailable: true,
            maxAvailable: maxQuantity,
            orderType,
            message: null,
            warning: null,
            actualCheckingDate: todayDateKey, // Show which date we checked
          };
        }
      }
    } else {
      // Case 3: No selectedDate - GO_GRAB
      const orderType = "GO_GRAB";
      const numAvailable =
        food.availability?.numAvailable || food.numAvailable || 0;

      console.log("DEBUG - No date GO_GRAB:", { numAvailable });

      if (numAvailable <= 0) {
        return {
          isAvailable: false,
          maxAvailable: 0,
          orderType,
          message: "Sold Out",
          warning: null,
          actualCheckingDate: null, // No specific date for GO_GRAB
        };
      }

      return {
        isAvailable: true,
        maxAvailable: Math.min(numAvailable, maxQuantity),
        orderType,
        message: null,
        warning: numAvailable < 5 ? `Only ${numAvailable} left` : null,
        actualCheckingDate: null, // No specific date for GO_GRAB
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
