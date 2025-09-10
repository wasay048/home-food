import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import dayjs from "dayjs";
import "./DateTimePicker.css";

/**
 * Reusable DateTimePicker component that handles both Go&Grab and Pre-Order scenarios
 * Fixed for mobile devices (iPhone/Android) to properly disable past dates
 */
const DateTimePicker = ({
  food,
  kitchen,
  orderType = "GO_GRAB", // "GO_GRAB" or "PRE_ORDER"
  selectedDate = null,
  selectedTime = null,
  onDateChange = () => {},
  onTimeChange = () => {},
  disabled = false,
  showTimeFirst = false,
  className = "",
  dateLabel = "Pick up date:",
  timeLabel = "Pick up time:",
  style = {},
}) => {
  const [internalDate, setInternalDate] = useState(selectedDate);
  const [internalTime, setInternalTime] = useState(selectedTime);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(dayjs()); // ✅ Added missing state
  const dateInputRef = useRef(null);

  // ✅ CRITICAL: Use refs to track previous values and prevent infinite loops
  const prevSelectedDate = useRef(selectedDate);
  const prevSelectedTime = useRef(selectedTime);
  const prevOrderType = useRef(orderType);
  const prevFoodId = useRef(food?.id);
  const prevKitchenId = useRef(kitchen?.id);
  const hasAutoSelectedDate = useRef(false);
  const hasAutoSelectedTime = useRef(false);

  // Detect if device is mobile
  const isMobile = useMemo(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }, []);

  // Calculate available dates based on order type
  const availableDates = useMemo(() => {
    const today = dayjs().startOf("day");

    if (orderType === "GO_GRAB") {
      // Go&Grab: Generate available dates from today onwards (30 days)
      const dates = [];

      for (let i = 0; i < 60; i++) {
        const date = today.add(i, "day");
        const dateString = date.format("YYYY-MM-DD");

        let displayText;
        if (i === 0) {
          displayText = `${date.format("MMM D, YYYY")}`;
        } else if (i === 1) {
          displayText = `${date.format("MMM D, YYYY")}`;
        } else {
          const dayOfWeek = date.format("dddd");
          displayText = `${dayOfWeek}, ${date.format("MMM D, YYYY")}`;
        }

        dates.push({
          date: dateString,
          display: displayText,
          dayjs: date,
          isToday: i === 0,
          isAvailable: true,
        });
      }

      return dates;
    } else if (orderType === "PRE_ORDER") {
      // Pre-Order: Only enable the selected date from parent
      if (!selectedDate) {
        console.log(
          "🚫 DateTimePicker - No selectedDate provided for PRE_ORDER"
        );
        return [];
      }

      const selectedDateObj = dayjs(selectedDate);
      const isToday = selectedDateObj.isSame(today, "day");
      const isTomorrow = selectedDateObj.isSame(today.add(1, "day"), "day");

      let displayText;
      if (isToday) {
        displayText = `${selectedDateObj.format("MMM D, YYYY")}`;
      } else if (isTomorrow) {
        displayText = `${selectedDateObj.format("MMM D, YYYY")}`;
      } else {
        const dayOfWeek = selectedDateObj.format("dddd");
        displayText = `${dayOfWeek}, ${selectedDateObj.format("MMM D, YYYY")}`;
      }

      const singleDateEntry = {
        date: selectedDate,
        display: displayText,
        dayjs: selectedDateObj,
        isToday: isToday,
        isAvailable: true,
      };

      return [singleDateEntry];
    }

    return [];
  }, [orderType, selectedDate, food?.id]);

  // Calculate available time slots for selected date
  const availableTimeSlots = useMemo(() => {
    console.log("🕐 Calculating time slots for:", {
      internalDate,
      orderType,
      selectedDate,
      foodId: food?.id,
      kitchenId: kitchen?.id,
      hasPreorderSchedule: !!kitchen?.preorderSchedule?.dates,
    });

    if (!internalDate) {
      console.log("❌ No internal date");
      return [];
    }
    alert("order type: " + orderType);
    if (orderType === "GO_GRAB") {
      // Go&Grab logic
      const today = dayjs();
      const selectedDateObj = dayjs(internalDate);

      const kitchenOpenHour = 9;
      const endHour = 21;
      const timeSlots = [];

      let startSlot;
      if (selectedDateObj.isSame(today, "day")) {
        startSlot = today.add(30, "minutes");
        const minutes = startSlot.minute();
        const roundedMinutes = Math.ceil(minutes / 15) * 15;
        startSlot = startSlot.minute(roundedMinutes).second(0);

        if (startSlot.minute() === 60) {
          startSlot = startSlot.add(1, "hour").minute(0);
        }
      } else {
        startSlot = selectedDateObj.hour(kitchenOpenHour).minute(0).second(0);
      }

      let currentSlot = startSlot;
      while (
        currentSlot.hour() < endHour ||
        (currentSlot.hour() === endHour && currentSlot.minute() === 0)
      ) {
        timeSlots.push({
          value: currentSlot.format("h:mm A"),
          display: currentSlot.format("h:mm A"),
          dayjs: currentSlot,
          isAvailable: true,
        });

        currentSlot = currentSlot.add(15, "minutes");
      }

      console.log("✅ Go&Grab time slots:", timeSlots.length);
      return timeSlots;
    } else if (orderType === "PRE_ORDER") {
      // Pre-Order logic - Enhanced for iOS compatibility
      console.log("🍽️ Processing PRE_ORDER time slots");

      if (!kitchen?.preorderSchedule?.dates) {
        alert("No preorder schedule available in kitchen.");
        console.log("❌ No preorder schedule in kitchen");
        return [];
      }

      if (!food?.id) {
        alert("No food ID available.");
        console.log("❌ No food ID");
        return [];
      }

      // Use internalDate instead of selectedDate for more reliable calculation
      const dateToUse = internalDate || selectedDate;
      alert("Date to use for PRE_ORDER: " + dateToUse);
      if (!dateToUse) {
        alert("No date to use for PRE_ORDER.");
        console.log("❌ No date to use");
        return [];
      }

      let scheduleDate;
      try {
        const parsedDate = dayjs(dateToUse);
        alert("Parsed date: " + parsedDate);
        scheduleDate = parsedDate.format("YYYY-MM-DD");
        alert("Schedule date: " + scheduleDate);
        console.log("📅 Schedule date:", scheduleDate);
      } catch (error) {
        console.error("Error parsing date:", dateToUse, error);
        return [];
      }

      const scheduleDates = kitchen.preorderSchedule.dates;
      console.log("📋 Available schedule dates:", Object.keys(scheduleDates));

      if (!scheduleDates[scheduleDate]) {
        alert("No schedule for date: " + scheduleDate);
        console.log("❌ No schedule for date:", scheduleDate);
        return [];
      }

      const scheduleItems = scheduleDates[scheduleDate];
      alert("Schedule items for date: " + JSON.stringify(scheduleItems));
      console.log("📦 Schedule items for date:", scheduleItems.length);

      const foodScheduleItems = scheduleItems.filter(
        (item) => item.foodItemId === food.id
      );
      alert(
        "Food schedule items: foodScheduleItems:" +
          JSON.stringify(foodScheduleItems)
      );
      console.log(
        "🍕 Food schedule items:",
        foodScheduleItems.length,
        "for food ID:",
        food.id
      );

      if (foodScheduleItems.length === 0) {
        alert("❌ No schedule items for this food");
        console.log("❌ No schedule items for this food");
        return [];
      }

      const timeSlots = [];

      foodScheduleItems.forEach((scheduleItem, index) => {
        console.log(`📋 Processing schedule item ${index}:`, scheduleItem);
        alert("Processing schedule item: " + JSON.stringify(scheduleItem));
        if (
          scheduleItem.availableTimes &&
          Array.isArray(scheduleItem.availableTimes)
        ) {
          console.log("⏰ Available times:", scheduleItem.availableTimes);
          alert(
            "Available times: " + JSON.stringify(scheduleItem.availableTimes)
          );
          scheduleItem.availableTimes.forEach((time) => {
            try {
              const scheduledTime = dayjs(
                `2000-01-01 ${time}`,
                "YYYY-MM-DD h:mm A"
              );

              if (!scheduledTime.isValid()) {
                console.warn("⚠️ Invalid time format:", time);
                return;
              }

              for (let offset = -30; offset <= 30; offset += 15) {
                const timeSlot = scheduledTime.add(offset, "minutes");
                const timeValue = timeSlot.format("h:mm A");
                const hour = timeSlot.hour();

                if (
                  hour >= 8 &&
                  hour <= 22 &&
                  !timeSlots.find((slot) => slot.value === timeValue)
                ) {
                  timeSlots.push({
                    value: timeValue,
                    display: timeValue + (offset === 0 ? " (Recommended)" : ""),
                    isAvailable: true,
                    scheduleItem,
                    isRecommended: offset === 0,
                    originalTime: time,
                  });
                }
              }
            } catch (error) {
              console.error("❌ Error processing time:", time, error);
            }
          });
        } else {
          console.log("❌ No valid availableTimes array in schedule item");
        }
      });
      alert("Total time slots before sorting: " + JSON.stringify(timeSlots));
      const sortedTimeSlots = timeSlots.sort((a, b) => {
        const timeA = dayjs(`2000-01-01 ${a.value}`, "YYYY-MM-DD h:mm A");
        const timeB = dayjs(`2000-01-01 ${b.value}`, "YYYY-MM-DD h:mm A");
        return timeA.diff(timeB);
      });
      alert("Sorted time slots: " + JSON.stringify(sortedTimeSlots));
      console.log(
        "✅ Final PRE_ORDER time slots:",
        sortedTimeSlots.length,
        sortedTimeSlots
      );
      return sortedTimeSlots;
    }

    return [];
  }, [
    internalDate,
    orderType,
    selectedDate,
    kitchen?.id,
    kitchen?.preorderSchedule?.dates,
    food?.id,
  ]);
  alert("Order type: outside of the useMemo()" + orderType);
  alert(`Available time slots: ${JSON.stringify(availableTimeSlots)}`);
  // ✅ FIXED: Handle date selection without causing infinite loops
  const handleDateChange = useCallback(
    (dateValue) => {
      // Validate that the selected date is allowed
      const selectedDateObj = dayjs(dateValue);
      const today = dayjs().startOf("day");

      console.log("📱 Date change:", {
        selectedDate: dateValue,
        isBeforeToday: selectedDateObj.isBefore(today),
        orderType,
        isMobile,
      });

      // For Go&Grab: Don't allow past dates
      if (orderType === "GO_GRAB" && selectedDateObj.isBefore(today)) {
        alert("Please select today or a future date for pickup.");
        // Reset to today
        const todayString = today.format("YYYY-MM-DD");
        setInternalDate(todayString);
        onDateChange(todayString);
        return;
      }

      // For Pre-Order: Only allow the specific selected date
      if (orderType === "PRE_ORDER" && dateValue !== selectedDate) {
        alert("For pre-orders, the pickup date cannot be changed.");
        // Reset to the original selected date
        setInternalDate(selectedDate);
        return;
      }

      // Update internal state
      setInternalDate(dateValue);
      setInternalTime(null);

      // Reset time auto-selection flag when date changes
      hasAutoSelectedTime.current = false;

      // Notify parent
      onDateChange(dateValue);
      onTimeChange(null);
    },
    [orderType, selectedDate, onDateChange, onTimeChange, isMobile]
  );

  // ✅ FIXED: Handle time selection without causing infinite loops
  const handleTimeChange = useCallback(
    (timeValue) => {
      setInternalTime(timeValue);
      onTimeChange(timeValue);
    },
    [onTimeChange]
  );

  // Custom date picker for mobile when needed
  const CustomMobileDatePicker = () => {
    if (!showCustomDatePicker) return null;

    const navigateMonth = (direction) => {
      setCurrentCalendarDate((prev) =>
        direction === "next" ? prev.add(1, "month") : prev.subtract(1, "month")
      );
    };

    const navigateYear = (direction) => {
      setCurrentCalendarDate((prev) =>
        direction === "next" ? prev.add(1, "year") : prev.subtract(1, "year")
      );
    };

    return (
      <div
        className="mobile-date-picker-overlay"
        onClick={() => setShowCustomDatePicker(false)}
      >
        <div
          className="mobile-date-picker-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mobile-date-picker-header">
            <button
              className="mobile-picker-btn cancel"
              onClick={() => setShowCustomDatePicker(false)}
            >
              Cancel
            </button>
            <h3>Select Pickup Date</h3>
            <button
              className="mobile-picker-btn done"
              onClick={() => setShowCustomDatePicker(false)}
            >
              Done
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="mobile-calendar-container">
            {/* Month/Year Navigation */}
            <div className="mobile-calendar-navigation">
              <div className="calendar-nav-section">
                <button
                  className="nav-btn year-nav"
                  onClick={() => navigateYear("prev")}
                >
                  ‹‹
                </button>
                <button
                  className="nav-btn month-nav"
                  onClick={() => navigateMonth("prev")}
                >
                  ‹
                </button>
              </div>

              <div className="mobile-calendar-month-header">
                <h4>{currentCalendarDate.format("MMMM YYYY")}</h4>
              </div>

              <div className="calendar-nav-section">
                <button
                  className="nav-btn month-nav"
                  onClick={() => navigateMonth("next")}
                >
                  ›
                </button>
                <button
                  className="nav-btn year-nav"
                  onClick={() => navigateYear("next")}
                >
                  ››
                </button>
              </div>
            </div>

            {/* Days of week header */}
            <div className="mobile-calendar-weekdays">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="mobile-weekday-header">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="mobile-calendar-grid">
              {(() => {
                const today = dayjs().startOf("day");
                const firstDayOfMonth = currentCalendarDate.startOf("month");
                const lastDayOfMonth = currentCalendarDate.endOf("month");
                const startDate = firstDayOfMonth.startOf("week");
                const endDate = lastDayOfMonth.endOf("week");

                const calendarDays = [];
                let currentDate = startDate;

                while (
                  currentDate.isBefore(endDate) ||
                  currentDate.isSame(endDate, "day")
                ) {
                  const dateString = currentDate.format("YYYY-MM-DD");
                  const isCurrentMonth = currentDate.isSame(
                    currentCalendarDate,
                    "month"
                  );
                  const isToday = currentDate.isSame(today, "day");
                  const isPast = currentDate.isBefore(today, "day");
                  const isSelected = internalDate === dateString;
                  // For Go&Grab: Allow dates from today onwards (within 30 days)
                  const isFuture = currentDate.isAfter(
                    today.add(30, "days"),
                    "day"
                  );
                  const isAvailable = !isPast && !isFuture && isCurrentMonth;

                  calendarDays.push(
                    <button
                      key={dateString}
                      className={`mobile-calendar-day ${
                        isCurrentMonth ? "current-month" : "other-month"
                      } ${isToday ? "today" : ""} ${
                        isSelected ? "selected" : ""
                      } ${isPast ? "past" : ""} ${
                        isFuture ? "future-disabled" : ""
                      } ${isAvailable ? "available" : "unavailable"}`}
                      onClick={() => {
                        if (isAvailable) {
                          handleDateChange(dateString);
                          setShowCustomDatePicker(false);
                        }
                      }}
                      disabled={!isAvailable}
                    >
                      <span className="day-number">
                        {currentDate.format("D")}
                      </span>
                      {isToday && (
                        <span className="today-indicator">Today</span>
                      )}
                    </button>
                  );

                  currentDate = currentDate.add(1, "day");
                }

                return calendarDays;
              })()}
            </div>

            {/* Quick Date Options */}
            <div className="mobile-quick-dates">
              <h5>Quick Select</h5>
              <div className="quick-date-buttons">
                {availableDates.slice(0, 7).map((dateOption) => (
                  <button
                    key={dateOption.date}
                    className={`quick-date-btn ${
                      internalDate === dateOption.date ? "selected" : ""
                    } ${dateOption.isToday ? "today" : ""}`}
                    onClick={() => {
                      handleDateChange(dateOption.date);
                      setShowCustomDatePicker(false);
                    }}
                    disabled={!dateOption.isAvailable}
                  >
                    <div className="quick-date-day">
                      {dateOption.dayjs.format("D")}
                    </div>
                    <div className="quick-date-month">
                      {dateOption.dayjs.format("MMM")}
                    </div>
                    <div className="quick-date-weekday">
                      {dateOption.dayjs.format("ddd")}
                    </div>
                    {dateOption.isToday && (
                      <div className="quick-date-today">Today</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ✅ CRITICAL FIX: Single effect that handles all synchronization without loops
  useEffect(() => {
    console.log("🔄 Main effect triggered:", {
      orderType,
      internalDate,
      selectedDate,
      foodId: food?.id,
      kitchenId: kitchen?.id,
      availableTimeSlotsCount: availableTimeSlots.length,
      internalTime,
    });

    let hasChanges = false;

    // Check if key props have changed (requires reset)
    const keyPropsChanged =
      orderType !== prevOrderType.current ||
      food?.id !== prevFoodId.current ||
      kitchen?.id !== prevKitchenId.current;

    if (keyPropsChanged) {
      console.log("🔄 Key props changed, resetting component");
      hasAutoSelectedDate.current = false;
      hasAutoSelectedTime.current = false;
      setInternalDate(null);
      setInternalTime(null);
      hasChanges = true;
    }

    // Sync selectedDate with internalDate (only if different)
    if (selectedDate !== prevSelectedDate.current || keyPropsChanged) {
      if (selectedDate !== internalDate) {
        console.log("🔄 Syncing selectedDate:", selectedDate);
        setInternalDate(selectedDate);
        hasChanges = true;
      }
    }

    // Sync selectedTime with internalTime (only if different)
    if (selectedTime !== prevSelectedTime.current || keyPropsChanged) {
      if (selectedTime !== internalTime) {
        console.log("🔄 Syncing selectedTime:", selectedTime);
        setInternalTime(selectedTime);
        hasChanges = true;
      }
    }

    // Auto-select date for Go&Grab if none provided
    if (
      orderType === "GO_GRAB" &&
      !hasAutoSelectedDate.current &&
      !internalDate &&
      availableDates.length > 0
    ) {
      const firstDate = availableDates[0].date;
      console.log("🔄 Auto-selecting date:", firstDate);
      setInternalDate(firstDate);
      onDateChange(firstDate);
      hasAutoSelectedDate.current = true;
      hasChanges = true;
    }

    // Auto-select time if date is set but no time selected
    if (
      !hasAutoSelectedTime.current &&
      internalDate &&
      !internalTime &&
      availableTimeSlots.length > 0
    ) {
      const firstTime = availableTimeSlots[0].value;
      console.log("🔄 Auto-selecting time:", firstTime);
      setInternalTime(firstTime);
      onTimeChange(firstTime);
      hasAutoSelectedTime.current = true;
      // eslint-disable-next-line no-unused-vars
      hasChanges = true;
    }

    // Update ref values at the end
    prevSelectedDate.current = selectedDate;
    prevSelectedTime.current = selectedTime;
    prevOrderType.current = orderType;
    prevFoodId.current = food?.id;
    prevKitchenId.current = kitchen?.id;
  }, [
    selectedDate,
    selectedTime,
    orderType,
    food?.id,
    kitchen?.id,
    internalDate,
    internalTime,
    availableDates,
    availableTimeSlots,
    onDateChange,
    onTimeChange,
  ]);

  // ✅ Additional effect specifically for iOS time slot refresh
  useEffect(() => {
    // Force refresh time slots on iOS when date or order type changes
    if (orderType === "PRE_ORDER" && internalDate && isMobile) {
      console.log(
        "📱 iOS PRE_ORDER refresh - forcing time slots recalculation"
      );

      // Small delay to ensure iOS processes the state change
      const timeoutId = setTimeout(() => {
        if (
          availableTimeSlots.length > 0 &&
          !internalTime &&
          !hasAutoSelectedTime.current
        ) {
          const firstTime = availableTimeSlots[0].value;
          console.log("📱 iOS auto-selecting time:", firstTime);
          setInternalTime(firstTime);
          onTimeChange(firstTime);
          hasAutoSelectedTime.current = true;
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [
    orderType,
    internalDate,
    isMobile,
    availableTimeSlots.length,
    internalTime,
    onTimeChange,
  ]);

  if (disabled) {
    return (
      <div className={`date-time-picker disabled ${className}`} style={style}>
        <div className="picker-field">
          <label className="picker-label">{dateLabel}</label>
          <div className="picker-value disabled">Not available</div>
        </div>
        <div className="picker-field">
          <label className="picker-label">{timeLabel}</label>
          <div className="picker-value disabled">Not available</div>
        </div>
      </div>
    );
  }

  if (availableDates.length === 0) {
    return <div className={`${className}`} style={style}></div>;
  }

  const datePickerProps = showTimeFirst ? {} : { "data-first": true };
  const timePickerProps = showTimeFirst ? { "data-first": true } : {};

  return (
    <div
      className={`date-time-picker ${className}`}
      style={style}
      data-order-type={orderType}
      data-mobile={isMobile}
    >
      <div className="picker-field" {...datePickerProps}>
        <label className="picker-label">{dateLabel}</label>
        <div className="date-input-wrapper">
          {/* For mobile Go&Grab: Use custom picker */}
          {isMobile && orderType === "GO_GRAB" ? (
            <div
              className="picker-select date-select mobile-date-trigger"
              onClick={() => setShowCustomDatePicker(true)}
              style={{ paddingRight: "18px" }}
            >
              <span className="">
                {internalDate
                  ? availableDates.find((d) => d.date === internalDate)
                      ?.display || dayjs(internalDate).format("MMM D, YYYY")
                  : "Select date"}
              </span>
              <svg
                className="picker-arrow"
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
              >
                <path
                  d="M1 1L6 6L11 1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ) : (
            /* For desktop or Pre-Order: Use native date input */
            <>
              <input
                type="date"
                ref={dateInputRef}
                className="picker-select date-select date-input"
                value={internalDate || ""}
                onChange={(e) => handleDateChange(e.target.value)}
                disabled={disabled || availableDates.length === 0}
                min={
                  orderType === "PRE_ORDER" && selectedDate
                    ? selectedDate
                    : dayjs().format("YYYY-MM-DD")
                }
                max={
                  orderType === "PRE_ORDER" && selectedDate
                    ? selectedDate
                    : availableDates.length > 0
                    ? availableDates[availableDates.length - 1].date
                    : dayjs().add(7, "day").format("YYYY-MM-DD")
                }
                readOnly={orderType === "PRE_ORDER"}
              />
              <div
                className="date-display-text"
                onClick={() => {
                  if (!disabled && orderType !== "PRE_ORDER") {
                    dateInputRef.current?.focus();
                    dateInputRef.current?.showPicker?.();
                  }
                }}
              >
                {internalDate
                  ? availableDates.find((d) => d.date === internalDate)
                      ?.display || dayjs(internalDate).format("MMM D, YYYY")
                  : orderType === "PRE_ORDER"
                  ? "Date pre-selected"
                  : "Select date"}
              </div>
              <svg
                className="picker-arrow"
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
                style={{ opacity: orderType === "PRE_ORDER" ? 0.5 : 1 }}
                onClick={() => {
                  if (!disabled && orderType !== "PRE_ORDER") {
                    dateInputRef.current?.focus();
                    dateInputRef.current?.showPicker?.();
                  }
                }}
              >
                <path
                  d="M1 1L6 6L11 1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          )}
        </div>
      </div>

      <div className="picker-field" {...timePickerProps}>
        <label className="picker-label">{timeLabel}</label>
        <select
          className="picker-select time-select"
          value={internalTime || ""}
          onChange={(e) => handleTimeChange(e.target.value)}
        >
          <option value="" disabled>
            Select time
          </option>
          {availableTimeSlots.map((timeOption) => (
            <option
              key={timeOption.value}
              value={timeOption.value}
              disabled={!timeOption.isAvailable}
              data-recommended={timeOption.isRecommended || false}
            >
              {timeOption.display}
            </option>
          ))}
        </select>
      </div>

      {/* Custom Mobile Date Picker */}
      <CustomMobileDatePicker />
    </div>
  );
};

export default DateTimePicker;
