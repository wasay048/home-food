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

  // Detect if device is mobile
  const isMobile = useMemo(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }, []);

  // Sync with external props
  useEffect(() => {
    setInternalDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    setInternalTime(selectedTime);
  }, [selectedTime]);

  // Calculate available dates based on order type
  const availableDates = useMemo(() => {
    const today = dayjs().startOf("day");

    console.log("🗓️ DateTimePicker - Calculating available dates:", {
      orderType,
      today: today.format("YYYY-MM-DD"),
      selectedDate,
      foodId: food?.id,
    });

    if (orderType === "GO_GRAB") {
      // Go&Grab: Generate available dates from today onwards (7 days)
      const dates = [];

      for (let i = 0; i < 30; i++) {
        const date = today.add(i, "day");
        const dateString = date.format("YYYY-MM-DD");

        let displayText;
        if (i === 0) {
          displayText = `${date.format("MMM D, YYYY")} (Today)`;
        } else if (i === 1) {
          displayText = `${date.format("MMM D, YYYY")} (Tomorrow)`;
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
        displayText = `${selectedDateObj.format("MMM D, YYYY")} (Today)`;
      } else if (isTomorrow) {
        displayText = `${selectedDateObj.format("MMM D, YYYY")} (Tomorrow)`;
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
      // Go&Grab logic (unchanged)
      const today = dayjs();
      const selectedDate = dayjs(internalDate);

      const kitchenOpenHour = 9;
      const endHour = 21;
      const timeSlots = [];

      let startSlot;
      if (selectedDate.isSame(today, "day")) {
        startSlot = today.add(30, "minutes");
        const minutes = startSlot.minute();
        const roundedMinutes = Math.ceil(minutes / 15) * 15;
        startSlot = startSlot.minute(roundedMinutes).second(0);

        if (startSlot.minute() === 60) {
          startSlot = startSlot.add(1, "hour").minute(0);
        }
      } else {
        startSlot = selectedDate.hour(kitchenOpenHour).minute(0).second(0);
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
      // Pre-Order logic (unchanged)
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

  // Handle date selection with validation for mobile
  const handleDateChange = useCallback(
    (dateValue) => {
      // Validate that the selected date is allowed
      const selectedDateObj = dayjs(dateValue);
      const today = dayjs().startOf("day");

      console.log("📱 Mobile date change validation:", {
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

      setInternalDate(dateValue);
      setInternalTime(null);
      onDateChange(dateValue);
      onTimeChange(null);
    },
    [orderType, selectedDate, onDateChange, onTimeChange, isMobile]
  );

  // Handle time selection
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

  // Auto-select logic
  useEffect(() => {
    if (orderType === "GO_GRAB" && !internalDate && availableDates.length > 0) {
      const firstDate = availableDates[0].date;
      handleDateChange(firstDate);
    }
    if (orderType === "PRE_ORDER" && selectedDate && !internalDate) {
      setInternalDate(selectedDate);
    }
  }, [orderType, internalDate, availableDates, selectedDate, handleDateChange]);

  useEffect(() => {
    if (internalDate && !internalTime && availableTimeSlots.length > 0) {
      const firstAvailableTime = availableTimeSlots[0].value;
      handleTimeChange(firstAvailableTime);
    }
  }, [internalDate, internalTime, availableTimeSlots, handleTimeChange]);

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
    return <div className={``} style={style}></div>;
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
              style={
                timeOption.isRecommended
                  ? {
                      backgroundColor: "#e8f5e8",
                      fontWeight: "600",
                      color: "#2e7d2e",
                    }
                  : {}
              }
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
