import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  const [internalDate, setInternalDate] = useState(selectedDate);
  const [internalTime, setInternalTime] = useState(selectedTime);

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
      foodId: food?.id,
    });

    if (orderType === "GO_GRAB") {
      // Go&Grab: Only today is available (no past or future dates)
      return [
        {
          date: today.format("YYYY-MM-DD"),
          display: `${today.format("MMM D, YYYY")} (Today)`,
          dayjs: today,
          isToday: true,
          isAvailable: true,
        },
      ];
    } else if (orderType === "PRE_ORDER") {
      // Pre-Order: Use kitchen's preorder schedule
      if (!kitchen?.preorderSchedule?.dates) {
        return [];
      }

      const scheduleEntries = Object.entries(kitchen.preorderSchedule.dates);
      const dates = [];

      scheduleEntries.forEach(([dateString, scheduleItems]) => {
        const date = dayjs(dateString);

        // Skip past dates (before today)
        if (date.isBefore(today, "day")) {
          return;
        }

        // Check if this food item is available on this date
        const foodAvailable = scheduleItems.some(
          (item) => item.foodItemId === food?.id
        );

        if (foodAvailable) {
          const dayOfWeek = date.format("dddd"); // Monday, Tuesday, etc.
          const isToday = date.isSame(today, "day");
          const isTomorrow = date.isSame(today.add(1, "day"), "day");

          let displayText;
          if (isToday) {
            displayText = `${date.format("MMM D, YYYY")} (Today)`;
          } else if (isTomorrow) {
            displayText = `${date.format("MMM D, YYYY")} (Tomorrow)`;
          } else {
            displayText = `${dayOfWeek}, ${date.format("MMM D, YYYY")}`;
          }

          dates.push({
            date: dateString,
            display: displayText,
            dayjs: date,
            isToday: isToday,
            isAvailable: true,
            scheduleItems: scheduleItems.filter(
              (item) => item.foodItemId === food?.id
            ),
          });
        }
      });

      // Sort dates chronologically
      const sortedDates = dates.sort((a, b) => a.dayjs.diff(b.dayjs));

      console.log(
        "🗓️ DateTimePicker - Pre-order dates found:",
        sortedDates.map((d) => ({
          date: d.date,
          display: d.display,
          isToday: d.isToday,
        }))
      );

      return sortedDates;
    }

    return [];
  }, [orderType, kitchen, food]);

  // Calculate available time slots for selected date
  const availableTimeSlots = useMemo(() => {
    if (!internalDate) return [];

    if (orderType === "GO_GRAB") {
      // Go&Grab: Use kitchen operation hours for today
      const today = dayjs();
      const selectedDate = dayjs(internalDate);

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
      // Pre-Order: Use specific time slots from schedule
      const dateData = availableDates.find((d) => d.date === internalDate);

      if (!dateData?.scheduleItems?.length) return [];

      const timeSlots = [];

      dateData.scheduleItems.forEach((scheduleItem) => {
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
                });
              }
            }

            timeSlots.push(...timeOptions);
          });
        }
      });

      // Sort time slots chronologically
      const sortedTimeSlots = timeSlots.sort((a, b) => {
        const timeA = dayjs(`2000-01-01 ${a.value}`, "YYYY-MM-DD h:mm A");
        const timeB = dayjs(`2000-01-01 ${b.value}`, "YYYY-MM-DD h:mm A");
        return timeA.diff(timeB);
      });

      console.log(
        "⏰ DateTimePicker - Pre-order time slots:",
        sortedTimeSlots.map((t) => ({
          value: t.value,
          display: t.display,
          isRecommended: t.isRecommended,
        }))
      );

      return sortedTimeSlots;
    }

    return [];
  }, [internalDate, orderType, availableDates, kitchen]);

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
  }, [orderType, internalDate, availableDates, handleDateChange]);

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
    return (
      <div className={`date-time-picker no-dates ${className}`} style={style}>
        <div className="picker-field">
          <label className="picker-label">{dateLabel}</label>
          <div className="picker-value error">No dates available</div>
        </div>
        <div className="picker-field">
          <label className="picker-label">{timeLabel}</label>
          <div className="picker-value error">No times available</div>
        </div>
      </div>
    );
  }

  const datePickerProps = showTimeFirst ? {} : { "data-first": true };
  const timePickerProps = showTimeFirst ? { "data-first": true } : {};

  return (
    <div className={`date-time-picker ${className}`} style={style}>
      <div className="picker-field" {...datePickerProps}>
        <label className="picker-label">{dateLabel}</label>
        <select
          className="picker-select date-select"
          value={internalDate || ""}
          onChange={(e) => handleDateChange(e.target.value)}
          disabled={disabled || availableDates.length === 0}
        >
          <option value="" disabled>
            Select date
          </option>
          {availableDates.map((dateOption) => (
            <option
              key={dateOption.date}
              value={dateOption.date}
              disabled={!dateOption.isAvailable}
            >
              {dateOption.display}
            </option>
          ))}
        </select>
      </div>

      <div className="picker-field" {...timePickerProps}>
        <label className="picker-label">{timeLabel}</label>
        <select
          className="picker-select time-select"
          value={internalTime || ""}
          onChange={(e) => handleTimeChange(e.target.value)}
          disabled={
            disabled || !internalDate || availableTimeSlots.length === 0
          }
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
