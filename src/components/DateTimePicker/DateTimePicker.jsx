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

      for (let i = 0; i < 30; i++) {
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
    if (!internalDate) return [];

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

      return timeSlots;
    } else if (orderType === "PRE_ORDER") {
      // Pre-Order logic
      if (!selectedDate || !kitchen?.preorderSchedule?.dates) {
        return [];
      }

      let scheduleDate;
      try {
        const parsedDate = dayjs(selectedDate);
        scheduleDate = parsedDate.format("YYYY-MM-DD");
      } catch (error) {
        console.error("Error parsing selectedDate:", selectedDate, error);
        return [];
      }

      if (!kitchen.preorderSchedule.dates[scheduleDate]) {
        return [];
      }

      const scheduleItems = kitchen.preorderSchedule.dates[scheduleDate];
      const foodScheduleItems = scheduleItems.filter(
        (item) => item.foodItemId === food?.id
      );

      if (foodScheduleItems.length === 0) {
        return [];
      }

      const timeSlots = [];

      foodScheduleItems.forEach((scheduleItem) => {
        if (
          scheduleItem.availableTimes &&
          Array.isArray(scheduleItem.availableTimes)
        ) {
          scheduleItem.availableTimes.forEach((time) => {
            const scheduledTime = dayjs(
              `2000-01-01 ${time}`,
              "YYYY-MM-DD h:mm A"
            );

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
          });
        }
      });

      return timeSlots.sort((a, b) => {
        const timeA = dayjs(`2000-01-01 ${a.value}`, "YYYY-MM-DD h:mm A");
        const timeB = dayjs(`2000-01-01 ${b.value}`, "YYYY-MM-DD h:mm A");
        return timeA.diff(timeB);
      });
    }

    return [];
  }, [internalDate, orderType, selectedDate, kitchen, food]);

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
            <button onClick={() => setShowCustomDatePicker(false)}>
              Cancel
            </button>
            <h3>Select Date</h3>
            <button onClick={() => setShowCustomDatePicker(false)}>Done</button>
          </div>
          <div className="mobile-date-grid">
            {availableDates.map((dateOption) => (
              <button
                key={dateOption.date}
                className={`mobile-date-option ${
                  internalDate === dateOption.date ? "selected" : ""
                } ${dateOption.isToday ? "today" : ""}`}
                onClick={() => {
                  handleDateChange(dateOption.date);
                  setShowCustomDatePicker(false);
                }}
                disabled={!dateOption.isAvailable}
              >
                <div className="mobile-date-day">
                  {dateOption.dayjs.format("D")}
                </div>
                <div className="mobile-date-month">
                  {dateOption.dayjs.format("MMM")}
                </div>
                <div className="mobile-date-weekday">
                  {dateOption.dayjs.format("ddd")}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ✅ CRITICAL FIX: Single effect that handles all synchronization without loops
  useEffect(() => {
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
