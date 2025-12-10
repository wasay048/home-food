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
  dateLabel = "Pickup / Delivery Date",
  timeLabel = "Pickup / Delivery Time",
  style = {},
  disableDateSelection = false,
  isDeliveryMode = false,
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
      isDeliveryMode,
    });

    if (!internalDate) {
      console.log("❌ No internal date");
      return [];
    }
    if (isDeliveryMode) {
      console.log(
        "🚚 Generating DELIVERY time slots (3 PM - 7 PM) - overriding orderType:",
        orderType
      );

      const selectedDateObj = dayjs(internalDate);
      const timeSlots = [];

      // Delivery: 3:00 PM - 7:00 PM (15:00 - 19:00)
      const startHour = 15; // 3 PM
      const startMinute = 0;
      const endHour = 19; // 7 PM
      const endMinute = 0;

      const startSlot = selectedDateObj
        .hour(startHour)
        .minute(startMinute)
        .second(0);

      const endSlot = selectedDateObj.hour(endHour).minute(endMinute).second(0);

      console.log(`🚚 Delivery time slot range:`, {
        start: startSlot.format("h:mm A"),
        end: endSlot.format("h:mm A"),
        orderType: orderType, // Log the original orderType for debugging
      });

      // Generate 15-minute interval slots
      let currentSlot = startSlot;
      while (currentSlot.isBefore(endSlot) || currentSlot.isSame(endSlot)) {
        timeSlots.push({
          value: currentSlot.format("h:mm A"),
          display: currentSlot.format("h:mm A"),
          dayjs: currentSlot,
          isAvailable: true,
        });

        currentSlot = currentSlot.add(15, "minutes");
      }

      console.log("✅ Delivery time slots:", {
        count: timeSlots.length,
        firstSlot: timeSlots[0]?.value,
        lastSlot: timeSlots[timeSlots.length - 1]?.value,
        originalOrderType: orderType,
      });

      return timeSlots;
    }
    console.log("order type: " + orderType);
    if (orderType === "GO_GRAB") {
      // ✅ ENHANCED: Go&Grab logic with weekday/weekend time ranges
      const today = dayjs();
      const selectedDateObj = dayjs(internalDate);

      // Determine if selected date is weekend (Saturday = 6, Sunday = 0)
      const dayOfWeek = selectedDateObj.day();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      // ✅ Different time ranges based on day type
      let startHour, startMinute, endHour, endMinute;

      if (isWeekend) {
        // Weekend (Saturday-Sunday): 11:00 AM - 7:30 PM
        startHour = 11;
        startMinute = 0;
        endHour = 19; // 7 PM in 24-hour format
        endMinute = 30;
      } else {
        // Weekday (Monday-Friday): 5:30 PM - 7:30 PM
        startHour = 17; // 5 PM in 24-hour format
        startMinute = 30;
        endHour = 19; // 7 PM in 24-hour format
        endMinute = 30;
      }

      console.log(
        `📅 Go&Grab schedule for ${selectedDateObj.format("dddd, MMM D")}:`,
        {
          isWeekend,
          dayOfWeek,
          timeRange: isWeekend
            ? "Weekend (11:00 AM - 7:30 PM)"
            : "Weekday (5:30 PM - 7:30 PM)",
        }
      );

      const timeSlots = [];

      // ✅ UPDATED: Always start from the allowed start time, regardless of current time
      const startSlot = selectedDateObj
        .hour(startHour)
        .minute(startMinute)
        .second(0);

      // ✅ Create end time based on day type
      const endSlot = selectedDateObj.hour(endHour).minute(endMinute).second(0);

      console.log(`⏰ Time slot range:`, {
        start: startSlot.format("h:mm A"),
        end: endSlot.format("h:mm A"),
      });

      // ✅ Generate 15-minute interval slots within the allowed time range
      let currentSlot = startSlot;
      while (currentSlot.isBefore(endSlot) || currentSlot.isSame(endSlot)) {
        timeSlots.push({
          value: currentSlot.format("h:mm A"),
          display: currentSlot.format("h:mm A"),
          dayjs: currentSlot,
          isAvailable: true,
        });

        currentSlot = currentSlot.add(15, "minutes");
      }

      console.log("✅ Go&Grab time slots:", {
        count: timeSlots.length,
        dayType: isWeekend ? "Weekend" : "Weekday",
        firstSlot: timeSlots[0]?.value,
        lastSlot: timeSlots[timeSlots.length - 1]?.value,
      });

      return timeSlots;
    } else if (orderType === "PRE_ORDER") {
      // ✅ ENHANCED: PRE_ORDER logic to generate time slots between start and end times
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
          nameOfFood: item.nameOfFood,
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

      // ✅ FIXED: Collect time slots for THIS SPECIFIC food item only
      const allAvailableTimes = [];

      foodScheduleItems.forEach((scheduleItem, index) => {
        console.log(`📋 Processing schedule item ${index}:`, {
          foodItemId: scheduleItem.foodItemId,
          nameOfFood: scheduleItem.nameOfFood,
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

        if (scheduleItem.availableTimes.length < 2) {
          console.warn(
            "⚠️ availableTimes must have at least 2 elements (start and end time):",
            scheduleItem.availableTimes
          );
          return;
        }

        // ✅ Extract start time (first element) and end time (last element)
        const startTimeStr = scheduleItem.availableTimes[0];
        const endTimeStr =
          scheduleItem.availableTimes[scheduleItem.availableTimes.length - 1];

        console.log(`⏰ Time range for ${scheduleItem.nameOfFood}:`, {
          startTime: startTimeStr,
          endTime: endTimeStr,
          totalTimesInArray: scheduleItem.availableTimes.length,
          foodItemId: scheduleItem.foodItemId,
        });

        try {
          // Parse start and end times
          const parsedStart = parseClockTime(startTimeStr);
          const parsedEnd = parseClockTime(endTimeStr);

          if (!parsedStart || !parsedEnd) {
            console.warn("⚠️ Invalid time format:", {
              startTime: startTimeStr,
              endTime: endTimeStr,
            });
            return;
          }

          const base = dayjs("2000-01-01", "YYYY-MM-DD", true);
          const startTime = base
            .hour(parsedStart.h)
            .minute(parsedStart.min)
            .second(0);
          const endTime = base
            .hour(parsedEnd.h)
            .minute(parsedEnd.min)
            .second(0);

          // ✅ Validate that end time is after start time
          if (!endTime.isAfter(startTime)) {
            console.warn("⚠️ End time must be after start time:", {
              startTime: startTimeStr,
              endTime: endTimeStr,
              foodName: scheduleItem.nameOfFood,
            });
            return;
          }

          // ✅ Generate 15-minute interval slots between start and end
          let currentSlot = startTime;
          let slotCount = 0;

          console.log(
            `🔄 Generating slots from ${startTimeStr} to ${endTimeStr} for ${scheduleItem.nameOfFood}...`
          );

          // ✅ FIXED: NO duplicate checking - each food item gets its own slots
          while (currentSlot.isBefore(endTime) || currentSlot.isSame(endTime)) {
            const timeValue = currentSlot.format("h:mm A");
            const hour = currentSlot.hour();

            // Validate time is within reasonable hours (optional)
            if (hour >= 0 && hour <= 23) {
              // ✅ Allow all hours (changed from 8-22)
              allAvailableTimes.push({
                time: currentSlot.clone(), // Clone to avoid reference issues
                originalRange: `${startTimeStr} - ${endTimeStr}`,
                scheduleItem: scheduleItem,
                foodItemId: scheduleItem.foodItemId,
                foodName: scheduleItem.nameOfFood,
              });

              slotCount++;
              console.log(
                `  ✅ Slot ${slotCount}: ${timeValue} (${scheduleItem.nameOfFood}) [${scheduleItem.foodItemId}]`
              );
            }

            // Move to next 15-minute slot
            currentSlot = currentSlot.add(15, "minutes");
          }

          console.log(
            `✅ Generated ${slotCount} time slots for ${scheduleItem.nameOfFood} (${scheduleItem.foodItemId})`
          );
        } catch (err) {
          console.error("❌ Error processing time range:", {
            startTime: startTimeStr,
            endTime: endTimeStr,
            foodName: scheduleItem.nameOfFood,
            error: err,
          });
        }
      });

      if (allAvailableTimes.length === 0) {
        console.log("❌ No valid time slots generated");
        return [];
      }

      // ✅ Sort all times chronologically
      allAvailableTimes.sort((a, b) => a.time.diff(b.time));

      console.log("✅ All generated time slots:", allAvailableTimes.length);
      console.log("🎯 Time slots for food:", food.id, food.name);

      // ✅ Humanized logs for debugging
      console.log("🕐 First time slot (index 0):", {
        time: allAvailableTimes[0]?.time.format("h:mm A"),
        originalRange: allAvailableTimes[0]?.originalRange,
        hour: allAvailableTimes[0]?.time.hour(),
        minute: allAvailableTimes[0]?.time.minute(),
        foodName: allAvailableTimes[0]?.scheduleItem?.nameOfFood,
        foodItemId: allAvailableTimes[0]?.foodItemId,
      });

      if (allAvailableTimes.length > 1) {
        console.log("🕐 Second time slot (index 1):", {
          time: allAvailableTimes[1]?.time.format("h:mm A"),
          originalRange: allAvailableTimes[1]?.originalRange,
          hour: allAvailableTimes[1]?.time.hour(),
          minute: allAvailableTimes[1]?.time.minute(),
          foodName: allAvailableTimes[1]?.scheduleItem?.nameOfFood,
          foodItemId: allAvailableTimes[1]?.foodItemId,
        });
      }

      console.log("🕐 Last time slot (last index):", {
        time: allAvailableTimes[allAvailableTimes.length - 1]?.time.format(
          "h:mm A"
        ),
        originalRange:
          allAvailableTimes[allAvailableTimes.length - 1]?.originalRange,
        hour: allAvailableTimes[allAvailableTimes.length - 1]?.time.hour(),
        minute: allAvailableTimes[allAvailableTimes.length - 1]?.time.minute(),
        foodName:
          allAvailableTimes[allAvailableTimes.length - 1]?.scheduleItem
            ?.nameOfFood,
        foodItemId: allAvailableTimes[allAvailableTimes.length - 1]?.foodItemId,
      });

      // ✅ Summary table log
      console.table(
        allAvailableTimes.map((item, index) => ({
          index: index,
          displayTime: item.time.format("h:mm A"),
          timeRange: item.originalRange,
          hour24: item.time.hour(),
          minute: item.time.minute(),
          foodName: item.scheduleItem?.nameOfFood || "N/A",
          foodItemId: item.foodItemId || "N/A",
          numAvailable: item.scheduleItem?.numOfAvailableItems || 0,
        }))
      );

      // ✅ Convert to time slots format
      const timeSlots = allAvailableTimes.map((item) => {
        const timeValue = item.time.format("h:mm A");

        return {
          value: timeValue,
          display: timeValue,
          isAvailable: true,
          scheduleItem: item.scheduleItem,
          isGeneratedSlot: true, // Generated from time range
          originalRange: item.originalRange,
          dayjs: item.time,
          foodItemId: item.foodItemId,
          foodName: item.foodName,
        };
      });

      console.log("✅ Final PRE_ORDER time slots:", {
        count: timeSlots.length,
        targetFoodId: food.id,
        targetFoodName: food.name,
        times: timeSlots.map((slot) => slot.value),
        firstTime: timeSlots[0]?.value,
        lastTime: timeSlots[timeSlots.length - 1]?.value,
        timeRange: `${timeSlots[0]?.value} - ${
          timeSlots[timeSlots.length - 1]?.value
        }`,
      });

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
        selectedDate: internalDate,
        selectedTime: selectedTime,
        specialInstructions: "",
        incomingOrderType: orderType,
        calledFrom: "default",
        updateFlag: "date",
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
      handleCartQuantityChange({
        food,
        kitchen,
        newQuantity: cartQuantity,
        selectedDate: internalDate,
        selectedTime: timeValue,
        specialInstructions: "",
        incomingOrderType: orderType,
        calledFrom: "default",
        updateFlag: "date",
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
            <h3>Pickup / Delivery Date</h3>
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
          {disableDateSelection ? (
            <div
              className="picker-select date-select date-disabled"
              style={{
                backgroundColor: "#f5f5f5",
                cursor: "not-allowed",
                opacity: 0.8,
              }}
            >
              <span>
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
                style={{ opacity: 0.5 }}
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
          ) : isMobile ? (
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

        {/* ✅ For delivery mode: Show fixed "Before 6pm" text */}
        {isDeliveryMode ? (
          <div className="time-select-wrapper" style={{ minHeight: "auto" }}>
            <div
              className="time-select-display delivery-time-fixed"
              style={{
                cursor: "default",
                padding: "8px 12px",
                minHeight: "unset",
                height: "auto",
                fontSize: "14px",
              }}
            >
              <span className="time-select-text">Before 6 PM</span>
            </div>
          </div>
        ) : (
          /* ✅ UNIVERSAL: Custom styled select wrapper for ALL devices */
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
                  ? availableTimeSlots.find(
                      (slot) => slot.value === internalTime
                    )?.display || internalTime
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
        )}
      </div>

      {/* Custom Mobile Date Picker */}
      {!disableDateSelection && <CustomMobileDatePicker />}
    </div>
  );
};

export default DateTimePicker;
