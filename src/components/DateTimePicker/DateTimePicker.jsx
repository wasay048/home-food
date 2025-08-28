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
 *
 * Features:
 * - Go&Grab: Only current date enabled, kitchen operation hours for time slots
 * - Pre-Order: Enable dates from preschedule, specific time slots per date
 * - Fully customizable and reusable
 * - Responsive design
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
  console.log("kitchen", kitchen);
  const [internalDate, setInternalDate] = useState(selectedDate);
  const [internalTime, setInternalTime] = useState(selectedTime);
  const dateInputRef = useRef(null);
  // Sync with external props
  useEffect(() => {
    setInternalDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    setInternalTime(selectedTime);
  }, [selectedTime]);

  const openDatePicker = useCallback(() => {
    if (disabled || orderType === "PRE_ORDER") return;

    if (dateInputRef.current) {
      dateInputRef.current.focus();

      // Try different methods to open the picker
      if (dateInputRef.current.showPicker) {
        // Modern browsers
        dateInputRef.current.showPicker();
      } else {
        // Fallback: trigger click event
        dateInputRef.current.click();
      }
    }
  }, [disabled, orderType]);
  // Calculate available dates based on order type
  // Update the availableDates useMemo dependencies

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

      for (let i = 0; i < 7; i++) {
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

      // Create a single date entry for the selected date
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

      console.log("🗓️ DateTimePicker - Pre-order single date enabled:", {
        date: singleDateEntry.date,
        display: singleDateEntry.display,
        isToday: singleDateEntry.isToday,
        hasKitchenSchedule: !!kitchen?.preorderSchedule?.dates?.[selectedDate],
      });

      return [singleDateEntry];
    }

    return [];
  }, [orderType, selectedDate, food?.id]); // Simplified dependencies

  // Calculate available time slots for selected date
  // Update the availableTimeSlots calculation for PRE_ORDER

  // Update the availableTimeSlots calculation to handle date format conversion

  const availableTimeSlots = useMemo(() => {
    if (!internalDate) return [];
    console.log("orderType", orderType);
    if (orderType === "GO_GRAB") {
      // Go&Grab: Use kitchen operation hours for today
      const today = dayjs();
      const selectedDate = dayjs(internalDate);
      console.log("selectedDate", selectedDate);
      // Generate time slots from now + 30 minutes to kitchen closing
      // Default kitchen hours: 9 AM to 9 PM
      const kitchenOpenHour = 9; // 9 AM
      const endHour = 21; // 9 PM

      const timeSlots = [];

      // If selected date is today, start from current time + 30 minutes
      // If selected date is future, start from kitchen opening time
      let startSlot;
      if (selectedDate.isSame(today, "day")) {
        // Today: start from current time + 30 minutes
        startSlot = today.add(30, "minutes");
        // Round to next 15-minute interval
        const minutes = startSlot.minute();
        const roundedMinutes = Math.ceil(minutes / 15) * 15;
        startSlot = startSlot.minute(roundedMinutes).second(0);

        // If rounded time goes to next hour
        if (startSlot.minute() === 60) {
          startSlot = startSlot.add(1, "hour").minute(0);
        }
      } else {
        // Future date: start from kitchen opening time
        startSlot = selectedDate.hour(kitchenOpenHour).minute(0).second(0);
      }

      // Generate 15-minute intervals until closing
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
      console.log("selectedDate", selectedDate);
      console.log("selectedDate", kitchen?.preorderSchedule?.dates);
      // Pre-Order: Use specific time slots from kitchen schedule for the selected date
      if (!selectedDate || !kitchen?.preorderSchedule?.dates) {
        console.log("🚫 DateTimePicker - No schedule data found");
        return [];
      }

      // Convert selectedDate format from "8/29/2025" to "2025-08-29" to match kitchen schedule
      let scheduleDate;
      try {
        // Parse the selectedDate which could be in format "8/29/2025" or "2025-08-29"
        const parsedDate = dayjs(selectedDate);
        scheduleDate = parsedDate.format("YYYY-MM-DD");
        console.log("scheduleDate", scheduleDate);
      } catch (error) {
        console.error(
          "🚫 DateTimePicker - Error parsing selectedDate:",
          selectedDate,
          error
        );
        return [];
      }

      console.log("🔄 DateTimePicker - Converting date formats:", {
        originalSelectedDate: selectedDate,
        convertedScheduleDate: scheduleDate,
        availableScheduleDates: Object.keys(kitchen.preorderSchedule.dates),
      });

      if (!kitchen.preorderSchedule.dates[scheduleDate]) {
        console.log(
          "🚫 DateTimePicker - No schedule data found for converted date:",
          scheduleDate,
          "Available dates:",
          Object.keys(kitchen.preorderSchedule.dates)
        );
        return [];
      }

      const scheduleItems = kitchen.preorderSchedule.dates[scheduleDate];

      // Filter schedule items for this specific food
      const foodScheduleItems = scheduleItems.filter(
        (item) => item.foodItemId === food?.id
      );

      if (foodScheduleItems.length === 0) {
        console.log(
          "🚫 DateTimePicker - No schedule items found for this food on date:",
          scheduleDate,
          "Food ID:",
          food?.id,
          "Available items:",
          scheduleItems.map((item) => ({
            id: item.foodItemId,
            name: item.nameOfFood,
          }))
        );
        return [];
      }

      const timeSlots = [];

      foodScheduleItems.forEach((scheduleItem) => {
        console.log("📋 Processing schedule item:", {
          foodItemId: scheduleItem.foodItemId,
          nameOfFood: scheduleItem.nameOfFood,
          availableTimes: scheduleItem.availableTimes,
          hasAvailableTimes: !!scheduleItem.availableTimes,
          isArray: Array.isArray(scheduleItem.availableTimes),
        });

        if (
          scheduleItem.availableTimes &&
          Array.isArray(scheduleItem.availableTimes)
        ) {
          scheduleItem.availableTimes.forEach((time) => {
            // Parse the scheduled time
            const scheduledTime = dayjs(
              `2000-01-01 ${time}`,
              "YYYY-MM-DD h:mm A"
            );

            // Generate time slots around the scheduled time (±30 minutes in 15-minute intervals)
            const timeOptions = [];

            // Add times: -30min, -15min, exact time, +15min, +30min
            for (let offset = -30; offset <= 30; offset += 15) {
              const timeSlot = scheduledTime.add(offset, "minutes");
              const timeValue = timeSlot.format("h:mm A");

              // Avoid duplicates and ensure reasonable hours (8 AM to 10 PM)
              const hour = timeSlot.hour();
              if (
                hour >= 8 &&
                hour <= 22 &&
                !timeSlots.find((slot) => slot.value === timeValue)
              ) {
                timeOptions.push({
                  value: timeValue,
                  display: timeValue + (offset === 0 ? " (Recommended)" : ""),
                  isAvailable: true,
                  scheduleItem,
                  isRecommended: offset === 0, // Mark exact scheduled time as recommended
                  originalTime: time, // Keep track of original scheduled time
                });
              }
            }

            timeSlots.push(...timeOptions);
          });
        } else if (scheduleItem.time) {
          // Handle single time property (fallback)
          const scheduledTime = dayjs(
            `2000-01-01 ${scheduleItem.time}`,
            "YYYY-MM-DD h:mm A"
          );

          // Generate time slots around the scheduled time
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
                originalTime: scheduleItem.time,
              });
            }
          }
        }
      });

      // Sort time slots chronologically
      const sortedTimeSlots = timeSlots.sort((a, b) => {
        const timeA = dayjs(`2000-01-01 ${a.value}`, "YYYY-MM-DD h:mm A");
        const timeB = dayjs(`2000-01-01 ${b.value}`, "YYYY-MM-DD h:mm A");
        return timeA.diff(timeB);
      });

      console.log(
        "⏰ DateTimePicker - Pre-order time slots for date:",
        scheduleDate,
        {
          originalSelectedDate: selectedDate,
          convertedScheduleDate: scheduleDate,
          totalScheduleItems: scheduleItems.length,
          foodScheduleItems: foodScheduleItems.length,
          availableTimeSlots: sortedTimeSlots.length,
          timeSlots: sortedTimeSlots.map((t) => ({
            value: t.value,
            display: t.display,
            isRecommended: t.isRecommended,
            originalTime: t.originalTime,
          })),
        }
      );

      return sortedTimeSlots;
    }

    return [];
  }, [internalDate, orderType, selectedDate, kitchen, food]);
  console.log("available time slots", availableTimeSlots);
  // Handle date selection
  const handleDateChange = useCallback(
    (dateValue) => {
      setInternalDate(dateValue);
      // Clear time when date changes
      setInternalTime(null);

      onDateChange(dateValue);
      onTimeChange(null); // Reset time when date changes
    },
    [onDateChange, onTimeChange]
  );

  // Handle time selection
  const handleTimeChange = useCallback(
    (timeValue) => {
      setInternalTime(timeValue);
      onTimeChange(timeValue);
    },
    [onTimeChange]
  );

  // Auto-select first available date if none selected for Go&Grab
  useEffect(() => {
    if (orderType === "GO_GRAB" && !internalDate && availableDates.length > 0) {
      const firstDate = availableDates[0].date;
      handleDateChange(firstDate);
    }
    // For PRE_ORDER, don't auto-select - use the selectedDate from parent
    if (orderType === "PRE_ORDER" && selectedDate && !internalDate) {
      setInternalDate(selectedDate);
    }
  }, [orderType, internalDate, availableDates, selectedDate, handleDateChange]);

  // Auto-select first available time when date is selected
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
    >
      <div className="picker-field" {...datePickerProps}>
        <label className="picker-label">{dateLabel}</label>
        <div className="date-input-wrapper">
          <input
            type="date"
            ref={dateInputRef}
            className="picker-select date-select date-input"
            value={internalDate || ""}
            onChange={(e) => handleDateChange(e.target.value)}
            disabled={disabled || availableDates.length === 0}
            min={
              orderType === "PRE_ORDER" && selectedDate
                ? selectedDate // For pre-order, min is the selected date
                : dayjs().format("YYYY-MM-DD") // For Go&Grab, min is today
            }
            max={
              orderType === "PRE_ORDER" && selectedDate
                ? selectedDate // For pre-order, max is also the selected date (only this date allowed)
                : availableDates.length > 0
                ? availableDates[availableDates.length - 1].date
                : dayjs().add(7, "day").format("YYYY-MM-DD")
            }
            readOnly={orderType === "PRE_ORDER"} // Make date field read-only for pre-order
          />
          <div
            className="date-display-text"
            onClick={() => {
              // Trigger the date input when clicking on the display text
              if (!disabled && orderType !== "PRE_ORDER") {
                const dateInput = document.querySelector(
                  ".date-input-wrapper .date-input"
                );
                if (dateInput) {
                  dateInput.focus();
                  dateInput.showPicker?.(); // For browsers that support showPicker
                }
              }
            }}
          >
            {internalDate
              ? availableDates.find((d) => d.date === internalDate)?.display ||
                dayjs(internalDate).format("MMM D, YYYY")
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
            style={{
              opacity: orderType === "PRE_ORDER" ? 0.5 : 1, // Dim arrow for pre-order
            }}
            onClick={() => {
              // Trigger the date input when clicking on the arrow
              if (!disabled && orderType !== "PRE_ORDER") {
                const dateInput = document.querySelector(
                  ".date-input-wrapper .date-input"
                );
                if (dateInput) {
                  dateInput.focus();
                  dateInput.showPicker?.(); // For browsers that support showPicker
                }
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
        </div>
      </div>

      <div className="picker-field" {...timePickerProps}>
        <label className="picker-label">{timeLabel}</label>
        <select
          className="picker-select time-select"
          value={internalTime || ""}
          onChange={(e) => handleTimeChange(e.target.value)}
          // disabled={
          //   disabled || !internalDate || availableTimeSlots.length === 0
          // }
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
    </div>
  );
};

export default DateTimePicker;
