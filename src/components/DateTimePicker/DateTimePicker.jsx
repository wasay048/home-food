import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import "./DateTimePicker.css";
import dayjs from "../../lib/dayjs";
import { parseClockTime } from "../../utils/timeParseUtils";
import { useGenericCart } from "../../hooks/useGenericCart";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrAfter);
dayjs.extend(isBetween);
/**
 * Reusable DateTimePicker component that handles both Go&Grab and Pre-Order scenarios
 * Fixed for mobile devices (iPhone/Android) to properly disable past dates
 */
const DateTimePicker = ({
  food,
  kitchen,
  orderType = "GO_GRAB",
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

  const { getCartQuantity, handleQuantityChange: handleCartQuantityChange } =
    useGenericCart();
  const cartQuantity = useMemo(() => {
    if (!food?.id) return 0;
    return getCartQuantity(food.id, selectedDate, orderType);
  }, [food?.id, selectedDate, getCartQuantity]);

  // Calculate available dates based on order type
  const availableDates = useMemo(() => {
    const today = dayjs().startOf("day");

    if (orderType === "GO_GRAB") {
      // Go&Grab: Generate available dates from today onwards (8 days)
      const dates = [];

      for (let i = 0; i < 8; i++) {
        const date = today.add(i, "day");
        const dateString = date.format("YYYY-MM-DD");

        let displayText;
        if (i === 0) {
          displayText = `${date.format("MMM D, YYYY")}`;
        } else if (i === 1) {
          displayText = `${date.format("MMM D, YYYY")}`;
        } else {
          const dayOfWeek = date.format("dddd");
          displayText = `${date.format("MMM D, YYYY")}`;
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
      if (!kitchen?.preorderSchedule?.dates || !food?.id) {
        console.log(
          "🚫 DateTimePicker - No preorderSchedule or food ID for PRE_ORDER"
        );
        return [];
      }

      const scheduleDates = kitchen.preorderSchedule.dates;
      const availableFutureDates = [];
      console.log(
        "📅 Checking schedule dates: Object.key",
        JSON.stringify(Object.keys(scheduleDates))
      );
      // Get all dates that have schedule items for this specific food
      Object.keys(scheduleDates).forEach((dateKey) => {
        console.log("📅 Checking schedule date: freshfood", dateKey);
        const dateObj = dayjs(dateKey);

        // ✅ FIX: Use isSameOrAfter with explicit 'day' unit or use alternative approach
        if (dateObj.isSame(today, "day") || dateObj.isAfter(today, "day")) {
          const scheduleItems = scheduleDates[dateKey];

          // Check if this date has items for the current food
          const foodScheduleItems = scheduleItems.filter(
            (item) => item.foodItemId === food.id
          );
          if (foodScheduleItems.length > 0) {
            const isToday = dateObj.isSame(today, "day");
            const isTomorrow = dateObj.isSame(today.add(1, "day"), "day");

            let displayText;
            if (isToday) {
              displayText = `${dateObj.format("MMM D, YYYY")}`;
            } else if (isTomorrow) {
              displayText = `${dateObj.format("MMM D, YYYY")}`;
            } else {
              const dayOfWeek = dateObj.format("dddd");
              displayText = `${dateObj.format("MMM D, YYYY")}`;
            }

            availableFutureDates.push({
              date: dateKey,
              display: displayText,
              dayjs: dateObj,
              isToday: isToday,
              isAvailable: true,
              foodScheduleItems: foodScheduleItems, // Store for later use
            });
          }
        }
      });

      // Sort dates chronologically
      availableFutureDates.sort((a, b) => a.dayjs.diff(b.dayjs));

      console.log("✅ PRE_ORDER available dates:", availableFutureDates.length);
      return availableFutureDates;
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
    console.log("order type: " + orderType);
    if (orderType === "GO_GRAB") {
      // Go&Grab logic remains the same
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
      // ✅ ENHANCED: PRE_ORDER logic to show slots between min and max times
      console.log("🍽️ Processing PRE_ORDER time slots");

      if (!kitchen?.preorderSchedule?.dates || !food?.id) {
        console.log("❌ No preorder schedule or food ID");
        return [];
      }

      const dateToUse = internalDate;
      if (!dateToUse) {
        console.log("❌ No date to use");
        return [];
      }

      console.log("📅 Looking for schedule on date:", dateToUse);
      console.log(
        "📅 Available schedule dates:",
        Object.keys(kitchen.preorderSchedule.dates)
      );

      const scheduleDates = kitchen.preorderSchedule.dates;

      if (!scheduleDates[dateToUse]) {
        console.log("❌ No schedule found for date:", dateToUse);
        console.log(
          "📅 Available dates in schedule:",
          Object.keys(scheduleDates)
        );
        return [];
      }

      const scheduleItems = scheduleDates[dateToUse];
      console.log("📋 Schedule items for date:", scheduleItems);

      // Filter for specific food
      const foodScheduleItems = scheduleItems.filter((item) => {
        const matches = item.foodItemId === food.id;
        console.log(`🔍 Schedule item check:`, {
          itemFoodId: item.foodItemId,
          targetFoodId: food.id,
          matches: matches,
          availableTimes: item.availableTimes,
          pickupTimeDuration: item.pickupTimeDuration,
        });
        return matches;
      });

      console.log(
        `📋 Found ${foodScheduleItems.length} schedule items for food ${food.id}`
      );

      if (foodScheduleItems.length === 0) {
        console.log("❌ No schedule items found for this food on this date");
        return [];
      }

      // ✅ NEW: Collect all available times and find min/max
      const allAvailableTimes = [];

      foodScheduleItems.forEach((scheduleItem, index) => {
        console.log(`📋 Processing schedule item ${index}:`, {
          foodItemId: scheduleItem.foodItemId,
          availableTimes: scheduleItem.availableTimes,
          pickupTimeDuration: scheduleItem.pickupTimeDuration,
          numOfAvailableItems: scheduleItem.numOfAvailableItems,
        });

        if (
          !scheduleItem.availableTimes ||
          !Array.isArray(scheduleItem.availableTimes)
        ) {
          console.warn(
            "⚠️ No availableTimes array found in schedule item:",
            scheduleItem
          );
          return;
        }

        if (scheduleItem.availableTimes.length === 0) {
          console.warn(
            "⚠️ Empty availableTimes array in schedule item:",
            scheduleItem
          );
          return;
        }

        // Process each available time to get dayjs objects
        scheduleItem.availableTimes.forEach((time) => {
          try {
            const parsed = parseClockTime(time);
            if (!parsed) {
              console.warn("⚠️ Invalid time format:", time);
              return;
            }

            const base = dayjs("2000-01-01", "YYYY-MM-DD", true);
            const scheduledTime = base
              .hour(parsed.h)
              .minute(parsed.min)
              .second(0);

            const hour = scheduledTime.hour();

            // Validate time is within reasonable hours
            if (hour >= 8 && hour <= 22) {
              allAvailableTimes.push({
                time: scheduledTime,
                originalTime: time,
                scheduleItem: scheduleItem,
              });
            }
          } catch (err) {
            console.error("❌ Error processing time:", time, err);
          }
        });
      });

      if (allAvailableTimes.length === 0) {
        console.log("❌ No valid times found");
        return [];
      }

      // ✅ NEW: Sort times and find min/max
      allAvailableTimes.sort((a, b) => a.time.diff(b.time));

      const minTime = allAvailableTimes[0].time;
      const maxTime = allAvailableTimes[allAvailableTimes.length - 1].time;

      console.log("📅 Time range:", {
        minTime: minTime.format("h:mm A"),
        maxTime: maxTime.format("h:mm A"),
        availableTimesCount: allAvailableTimes.length,
      });

      // ✅ NEW: Generate 15-minute slots between min and max time
      const timeSlots = [];
      const exactTimes = new Set(
        allAvailableTimes.map((t) => t.time.format("h:mm A"))
      );

      let currentSlot = minTime.startOf("hour"); // Start from the hour of minTime

      // Ensure we start from a reasonable time (not before minTime)
      while (currentSlot.isBefore(minTime)) {
        currentSlot = currentSlot.add(15, "minutes");
      }

      // Generate slots until maxTime (and a bit beyond for flexibility)
      const endSlot = maxTime.add(1, "hour"); // Add 1 hour buffer after maxTime

      while (currentSlot.isBefore(endSlot) || currentSlot.isSame(endSlot)) {
        const timeValue = currentSlot.format("h:mm A");
        const hour = currentSlot.hour();

        // Validate time is within reasonable hours
        if (hour >= 8 && hour <= 22) {
          const isExactTime = exactTimes.has(timeValue);
          const isWithinRange = currentSlot.isBetween(
            minTime,
            maxTime,
            null,
            "[]"
          ); // inclusive

          // Show slot if it's an exact time OR within the range
          if (isExactTime || isWithinRange) {
            let display = timeValue;
            let isAvailable = true;

            // Mark exact times as "Available"
            if (isExactTime) {
              display = `${timeValue}`;
            }

            const newTimeSlot = {
              value: timeValue,
              display: display,
              isAvailable: isAvailable,
              scheduleItem: isExactTime
                ? allAvailableTimes.find(
                    (t) => t.time.format("h:mm A") === timeValue
                  )?.scheduleItem
                : null,
              isExactTime: isExactTime,
              isWithinRange: isWithinRange,
            };

            timeSlots.push(newTimeSlot);
            console.log(
              `✅ Added time slot: ${timeValue} (exact: ${isExactTime}, inRange: ${isWithinRange})`
            );
          }
        }

        currentSlot = currentSlot.add(15, "minutes");
      }

      console.log(
        "✅ Final PRE_ORDER time slots (with range):",
        timeSlots.length,
        timeSlots.map((slot) => `${slot.value}${slot.isExactTime ? "*" : ""}`)
      );

      return timeSlots;
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
  console.log("Order type: outside of the useMemo()" + orderType);
  console.log(
    `Available time slots: ${orderType} ${JSON.stringify(availableTimeSlots)}`
  );
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
        console.log("Please select today or a future date for pickup.");
        // Reset to today
        const todayString = today.format("YYYY-MM-DD");
        setInternalDate(todayString);
        onDateChange(todayString);
        return;
      }

      // For Pre-Order: Only allow the specific selected date
      if (orderType === "PRE_ORDER") {
        const isDateAvailable = availableDates.some(
          (date) => date.date === dateValue
        );
        if (!isDateAvailable) {
          console.log("Selected date is not available for pre-order.");
          return;
        }
      }

      // Update internal state
      setInternalDate(dateValue);
      setInternalTime(null);

      // Reset time auto-selection flag when date changes
      hasAutoSelectedTime.current = false;

      // Notify parent
      onDateChange(dateValue);
      handleCartQuantityChange({
        food,
        kitchen,
        newQuantity: cartQuantity,
        currentQuantity: cartQuantity,
        selectedDate: internalDate,
        selectedTime: selectedTime,
        specialInstructions: "",
        incomingOrderType: orderType,
      });
      onTimeChange(null);
    },
    [orderType, selectedDate, onDateChange, onTimeChange, isMobile]
  );

  // ✅ FIXED: Handle time selection without causing infinite loops
  const handleTimeChange = useCallback(
    (timeValue) => {
      setInternalTime(timeValue);
      onTimeChange(timeValue);
      // eslint-disable-next-line no-debugger
      debugger;
      handleCartQuantityChange({
        food,
        kitchen,
        newQuantity: cartQuantity,
        currentQuantity: cartQuantity,
        selectedDate: internalDate,
        selectedTime: timeValue,
        specialInstructions: "",
        incomingOrderType: orderType,
      });
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
    console.log("Current calendar date: availableDates" + availableDates);
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
            {/* <div className="mobile-calendar-navigation">
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
            </div> */}

            {/* Days of week header */}
            {/* <div className="mobile-calendar-weekdays">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="mobile-weekday-header">
                  {day}
                </div>
              ))}
            </div> */}

            {/* Calendar Grid */}
            {/* <div className="mobile-calendar-grid">
              {(() => {
                const today = dayjs().startOf("day");
                const firstDayOfMonth = currentCalendarDate.startOf("month");
                const lastDayOfMonth = currentCalendarDate.endOf("month");
                const startDate = firstDayOfMonth.startOf("week");
                let endDate;
                if (orderType === "GO_GRAB") {
                  // For GO_GRAB: Use last day of week for the month
                  endDate = lastDayOfMonth.endOf("week");
                } else if (orderType === "PRE_ORDER") {
                  // For PRE_ORDER: Use the last available date, but ensure it covers the current calendar view
                  if (availableDates.length > 0) {
                    const lastAvailableDate =
                      availableDates[availableDates.length - 1].dayjs;
                    const monthEndWeek = lastDayOfMonth.endOf("week");

                    // Use whichever is later: the last available date or the end of the current month's week view
                    if (lastAvailableDate.isAfter(monthEndWeek)) {
                      // If last available date is beyond current month view, extend to show it
                      endDate = lastAvailableDate.endOf("week");
                    } else {
                      // Otherwise, use normal month view
                      endDate = monthEndWeek;
                    }
                  } else {
                    // Fallback to normal month view if no available dates
                    endDate = lastDayOfMonth.endOf("week");
                  }
                } else {
                  // Default fallback
                  endDate = lastDayOfMonth.endOf("week");
                }

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
                  // For Go&Grab: Allow dates from today onwards (within 7 days)
                  let isAvailable = false;
                  console.log("Order type: inside the loop" + orderType);
                  if (orderType === "GO_GRAB") {
                    // For Go&Grab: Allow dates from today onwards (within reasonable range)
                    const isFuture = currentDate.isAfter(
                      today.add(7, "days"),
                      "day"
                    );
                    isAvailable = !isPast && !isFuture && isCurrentMonth;
                  } else if (orderType === "PRE_ORDER") {
                    // ✅ NEW: For PreOrder, check if date is in availableDates array
                    console.log(
                      "Available dates length: custom",
                      JSON.stringify(availableDates)
                    );
                    isAvailable =
                      availableDates.some((date) => date.date === dateString) &&
                      isCurrentMonth;
                  }

                  calendarDays.push(
                    <button
                      key={dateString}
                      className={`mobile-calendar-day ${
                        isCurrentMonth ? "current-month" : "other-month"
                      } ${isToday ? "today" : ""} ${
                        isSelected ? "selected" : ""
                      } ${isPast ? "past" : ""} ${
                        isAvailable ? "available" : "unavailable"
                      }`}
                      onClick={() => {
                        if (isAvailable) {
                          handleDateChange(dateString);
                          setShowCustomDatePicker(false);
                        }
                      }}
                      // disabled={!isAvailable}
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
            </div> */}

            {/* Quick Date Options */}
            <div className="mobile-quick-dates">
              <h5>Quick Select</h5>
              <div className="quick-date-buttons">
                {availableDates.map((dateOption) => (
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

    // ✅ NEW: Auto-select date if null (use current/first available date)
    if (
      !hasAutoSelectedDate.current &&
      !internalDate &&
      availableDates.length > 0
    ) {
      const defaultDate = availableDates[0].date; // First available date (current date for Go&Grab)
      console.log("🔄 Auto-selecting default date:", defaultDate);
      setInternalDate(defaultDate);
      onDateChange(defaultDate); // Notify parent with default date
      hasAutoSelectedDate.current = true;
      hasChanges = true;
    }

    // ✅ NEW: Auto-select time if null (use first available time slot)
    if (
      !hasAutoSelectedTime.current &&
      internalDate &&
      !internalTime &&
      availableTimeSlots.length > 0
    ) {
      const defaultTime = availableTimeSlots[0].value; // First available time slot
      console.log("🔄 Auto-selecting default time:", defaultTime);
      setInternalTime(defaultTime);
      onTimeChange(defaultTime); // Notify parent with default time
      hasAutoSelectedTime.current = true;
      hasChanges = true;
    }

    // ✅ NEW: Handle case where selectedDate is null from parent
    if (
      selectedDate === null &&
      !hasAutoSelectedDate.current &&
      availableDates.length > 0
    ) {
      const defaultDate = availableDates[0].date;
      console.log("🔄 Parent passed null date, setting default:", defaultDate);
      setInternalDate(defaultDate);
      onDateChange(defaultDate);
      hasAutoSelectedDate.current = true;
      hasChanges = true;
    }

    // ✅ NEW: Handle case where selectedTime is null from parent
    if (
      selectedTime === null &&
      !hasAutoSelectedTime.current &&
      internalDate &&
      availableTimeSlots.length > 0
    ) {
      const defaultTime = availableTimeSlots[0].value;
      console.log("🔄 Parent passed null time, setting default:", defaultTime);
      setInternalTime(defaultTime);
      onTimeChange(defaultTime);
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
          {/* For mobile  */}
          {isMobile ? (
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
                  : "Select date"}
              </div>
              <svg
                className="picker-arrow"
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
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

        {/* ✅ UNIVERSAL: Custom styled select wrapper for ALL devices */}
        <div className="time-select-wrapper">
          <select
            className="picker-select time-select"
            value={internalTime || ""}
            onChange={(e) => handleTimeChange(e.target.value)}
            disabled={disabled || availableTimeSlots.length === 0}
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

          {/* ✅ UNIVERSAL: Custom display layer for ALL devices */}
          <div className="time-select-display">
            <span className="time-select-text">
              {internalTime
                ? availableTimeSlots.find((slot) => slot.value === internalTime)
                    ?.display || internalTime
                : "Select time"}
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
        </div>
      </div>

      {/* Custom Mobile Date Picker */}
      <CustomMobileDatePicker />
    </div>
  );
};

export default DateTimePicker;
