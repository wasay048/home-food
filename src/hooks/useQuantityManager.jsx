import { useState, useEffect, useMemo } from "react";

/**
 * Custom hook for managing quantity with business logic
 * Handles both Go&Grab and Pre-Order scenarios
 */
export function useQuantityManager({
  food,
  kitchen,
  selectedDate = null,
  initialQuantity = 1,
  onQuantityChange = null,
  onError = null,
  onWarning = null,
}) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);

  // Determine order type based on selectedDate
  const orderType = selectedDate ? "PRE_ORDER" : "GO_GRAB";

  // Calculate availability limits and constraints
  const availabilityInfo = useMemo(() => {
    if (!food) {
      return {
        isAvailable: false,
        maxQuantity: 0,
        minQuantity: 1,
        orderType: "UNKNOWN",
        reason: "Food data not available",
      };
    }

    console.log(
      `[useQuantityManager] Calculating availability for ${orderType}`,
      {
        food: food.name,
        selectedDate,
        kitchen: kitchen?.name,
      }
    );

    if (orderType === "GO_GRAB") {
      // Go&Grab logic - check numAvailable
      const numAvailable =
        food.numAvailable || food.availability?.numAvailable || 0;

      return {
        isAvailable: numAvailable > 0,
        maxQuantity: Math.max(0, numAvailable),
        minQuantity: 1,
        orderType: "GO_GRAB",
        reason: numAvailable <= 0 ? "Out of stock" : null,
        availableItems: numAvailable,
      };
    } else {
      // Pre-Order logic - check preorderSchedule
      if (!kitchen || !kitchen.preorderSchedule) {
        return {
          isAvailable: false,
          maxQuantity: 0,
          minQuantity: 1,
          orderType: "PRE_ORDER",
          reason: "Pre-order schedule not available",
        };
      }

      const schedule = kitchen.preorderSchedule;
      const dateSchedule = schedule.dates?.[selectedDate];

      if (!dateSchedule) {
        return {
          isAvailable: false,
          maxQuantity: 0,
          minQuantity: 1,
          orderType: "PRE_ORDER",
          reason: `No schedule available for ${selectedDate}`,
        };
      }

      // Find the food item in the schedule
      const foodItemId = dateSchedule.foodItemId;
      const isTargetFood = foodItemId === food.id;

      if (!isTargetFood) {
        return {
          isAvailable: false,
          maxQuantity: 0,
          minQuantity: 1,
          orderType: "PRE_ORDER",
          reason: `Food not available for pre-order on ${selectedDate}`,
        };
      }

      // Check if limited order
      const isLimitedOrder = dateSchedule.isLimitedOrder;

      if (isLimitedOrder === false) {
        // Unlimited items
        return {
          isAvailable: true,
          maxQuantity: Infinity,
          minQuantity: 1,
          orderType: "PRE_ORDER",
          isUnlimited: true,
          reason: null,
        };
      } else {
        // Limited items - check numOfAvailableItems
        const availableItems = dateSchedule.numOfAvailableItems || 0;
        return {
          isAvailable: availableItems > 0,
          maxQuantity: Math.max(0, availableItems),
          minQuantity: 1,
          orderType: "PRE_ORDER",
          availableItems,
          reason:
            availableItems <= 0 ? "No items available for pre-order" : null,
        };
      }
    }
  }, [food, kitchen, selectedDate, orderType]);

  // Validate quantity against constraints
  const validateQuantity = (newQuantity) => {
    const { isAvailable, maxQuantity, minQuantity, reason, isUnlimited } =
      availabilityInfo;

    if (!isAvailable) {
      return {
        isValid: false,
        error: reason || "Item not available",
        correctedQuantity: 0,
      };
    }

    if (newQuantity < minQuantity) {
      return {
        isValid: false,
        error: `Minimum quantity is ${minQuantity}`,
        correctedQuantity: minQuantity,
      };
    }

    if (!isUnlimited && newQuantity > maxQuantity) {
      return {
        isValid: false,
        error: `Maximum available quantity is ${maxQuantity}`,
        correctedQuantity: maxQuantity,
        warning: `Only ${maxQuantity} items available`,
      };
    }

    return {
      isValid: true,
      error: null,
      warning: null,
      correctedQuantity: newQuantity,
    };
  };

  // Increment quantity
  const increment = () => {
    const newQuantity = quantity + 1;
    const validation = validateQuantity(newQuantity);

    if (validation.isValid) {
      setQuantity(newQuantity);
      setError(null);
      setWarning(validation.warning);
      onQuantityChange?.(newQuantity);
    } else {
      if (validation.correctedQuantity > quantity) {
        setQuantity(validation.correctedQuantity);
        onQuantityChange?.(validation.correctedQuantity);
      }
      setError(validation.error);
      setWarning(validation.warning);
      onError?.(validation.error);
      onWarning?.(validation.warning);
    }
  };

  // Decrement quantity
  const decrement = () => {
    const newQuantity = quantity - 1;
    const validation = validateQuantity(newQuantity);

    if (validation.isValid) {
      setQuantity(newQuantity);
      setError(null);
      setWarning(null);
      onQuantityChange?.(newQuantity);
    } else {
      if (validation.correctedQuantity >= availabilityInfo.minQuantity) {
        setQuantity(validation.correctedQuantity);
        onQuantityChange?.(validation.correctedQuantity);
      }
      setError(validation.error);
      onError?.(validation.error);
    }
  };

  // Set specific quantity
  const setSpecificQuantity = (newQuantity) => {
    const validation = validateQuantity(newQuantity);

    if (validation.isValid) {
      setQuantity(newQuantity);
      setError(null);
      setWarning(validation.warning);
      onQuantityChange?.(newQuantity);
    } else {
      setQuantity(validation.correctedQuantity);
      setError(validation.error);
      setWarning(validation.warning);
      onQuantityChange?.(validation.correctedQuantity);
      onError?.(validation.error);
      onWarning?.(validation.warning);
    }
  };

  // Reset quantity
  const resetQuantity = () => {
    const validation = validateQuantity(initialQuantity);
    setQuantity(validation.correctedQuantity);
    setError(null);
    setWarning(null);
    onQuantityChange?.(validation.correctedQuantity);
  };

  // Effect to validate current quantity when dependencies change
  useEffect(() => {
    if (food && availabilityInfo) {
      const validation = validateQuantity(quantity);
      if (!validation.isValid && validation.correctedQuantity !== quantity) {
        setQuantity(validation.correctedQuantity);
        setError(validation.error);
        setWarning(validation.warning);
        onQuantityChange?.(validation.correctedQuantity);
        onError?.(validation.error);
        onWarning?.(validation.warning);
      }
    }
  }, [
    food,
    kitchen,
    selectedDate,
    availabilityInfo.isAvailable,
    availabilityInfo.maxQuantity,
  ]);

  return {
    quantity,
    increment,
    decrement,
    setQuantity: setSpecificQuantity,
    resetQuantity,
    error,
    warning,
    availabilityInfo,
    canIncrement:
      availabilityInfo.isAvailable &&
      (availabilityInfo.isUnlimited || quantity < availabilityInfo.maxQuantity),
    canDecrement: quantity > availabilityInfo.minQuantity,
    isValid:
      availabilityInfo.isAvailable &&
      quantity >= availabilityInfo.minQuantity &&
      (availabilityInfo.isUnlimited ||
        quantity <= availabilityInfo.maxQuantity),
  };
}
