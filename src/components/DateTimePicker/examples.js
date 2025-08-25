/**
 * DateTimePicker Component Usage Examples
 *
 * This component is reusable across the application for handling both
 * Go&Grab and Pre-Order scenarios with automatic date/time availability.
 */

import React, { useState } from "react";
import DateTimePicker from "../components/DateTimePicker/DateTimePicker";

// Example 1: Go&Grab scenario (only today, kitchen hours)
const GoGrabExample = ({ food, kitchen }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  return (
    <DateTimePicker
      food={food}
      kitchen={kitchen}
      orderType="GO_GRAB"
      selectedDate={selectedDate}
      selectedTime={selectedTime}
      onDateChange={setSelectedDate}
      onTimeChange={setSelectedTime}
      dateLabel="Pickup Date:"
      timeLabel="Pickup Time:"
    />
  );
};

// Example 2: Pre-Order scenario (scheduled dates and times)
const PreOrderExample = ({ food, kitchen }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  return (
    <DateTimePicker
      food={food}
      kitchen={kitchen}
      orderType="PRE_ORDER"
      selectedDate={selectedDate}
      selectedTime={selectedTime}
      onDateChange={setSelectedDate}
      onTimeChange={setSelectedTime}
      dateLabel="Pre-order Date:"
      timeLabel="Preferred Time:"
    />
  );
};

// Example 3: Listing Page usage (with order type auto-detection)
const ListingPageExample = ({ food, kitchen }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // Auto-detect order type based on availability
  const orderType =
    food?.availability?.numAvailable > 0 ? "GO_GRAB" : "PRE_ORDER";

  return (
    <DateTimePicker
      food={food}
      kitchen={kitchen}
      orderType={orderType}
      selectedDate={selectedDate}
      selectedTime={selectedTime}
      onDateChange={setSelectedDate}
      onTimeChange={setSelectedTime}
      className="listing-page-picker"
      disabled={!food || !kitchen}
    />
  );
};

// Example 4: Cart Page usage (editing existing orders)
const CartEditExample = ({ food, kitchen, existingDate, existingTime }) => {
  const [selectedDate, setSelectedDate] = useState(existingDate);
  const [selectedTime, setSelectedTime] = useState(existingTime);

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    // Update cart item with new date
  };

  const handleTimeChange = (newTime) => {
    setSelectedTime(newTime);
    // Update cart item with new time
  };

  return (
    <DateTimePicker
      food={food}
      kitchen={kitchen}
      orderType={existingDate ? "PRE_ORDER" : "GO_GRAB"}
      selectedDate={selectedDate}
      selectedTime={selectedTime}
      onDateChange={handleDateChange}
      onTimeChange={handleTimeChange}
      className="cart-edit-picker"
      showTimeFirst={true} // Show time picker first for editing
    />
  );
};

export { GoGrabExample, PreOrderExample, ListingPageExample, CartEditExample };
