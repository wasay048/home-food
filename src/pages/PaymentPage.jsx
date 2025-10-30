import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import dayjs from "dayjs";
import Edit from "../assets/images/edit.svg";
import WeChatAuthDialog from "../components/WeChatAuthDialog/WeChatAuthDialog";
import { Copy, X, Image as ImageIcon } from "lucide-react";
import { uploadImageToStorage } from "../services/storageService";
import { showToast } from "../utils/toast";
import {
  placeOrder,
  createOrderObject,
  validateItemAvailability,
} from "../services/orderService";
import { clearCart } from "../store/slices/cartSlice";
import DateTimePicker from "../components/DateTimePicker/DateTimePicker";
import { useGenericCart } from "../hooks/useGenericCart";
import "./PaymentPage.css";

export default function PaymentPage() {
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [firebaseImageUrl, setFirebaseImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isDateTimePickerOpen, setIsDateTimePickerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalSelectedDate, setModalSelectedDate] = useState(null);
  const [modalSelectedTime, setModalSelectedTime] = useState(null);
  const [showDateValidationDialog, setShowDateValidationDialog] =
    useState(false);
  const [invalidDateItems, setInvalidDateItems] = useState([]);

  const [showWeChatDialog, setShowWeChatDialog] = useState(false);
  const [paymentType, setPaymentType] = useState("online"); // "online" or "cash"
  const { handleQuantityChange } = useGenericCart();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get cart items from Redux
  const cartItems = useSelector((state) => state.cart.items);
  const currentKitchen = useSelector((state) => state.food.currentKitchen);
  const currentUser = useSelector((state) => state.auth.user);
  // const currentUser = { id: "xWb16hmhx8gJiIF5wPgGkqd7xLo2" };
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  // const isAuthenticated = true;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const value = params.get("firebaseImageUrl");
    console.log("firebaseImageUrl from URL params:", value);
    if (value) {
      setFirebaseImageUrl(value);
      setUploadPreview(value);

      // remove query string without reloading
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  // Get kitchen information from cart items
  const kitchenInfo = useMemo(() => {
    if (currentKitchen) {
      // Get kitchen from currentKitchen in food object
      const kitchen = currentKitchen;
      console.log("kitchen", kitchen);
      if (kitchen) {
        return {
          id: kitchen?.id || kitchen?.ownerId || "", // Use fallback kitchen ID
          name: kitchen?.name || "",
          address: kitchen?.address || "",
          latitude: kitchen?.location?.lat || kitchen?.latitude || 41.5742,
          longitude: kitchen?.location?.lng || kitchen?.longitude || -70.6109,
          preorderSchedule: kitchen?.preorderSchedule || null,
          paypal: kitchen?.paypal || "",
          venmo: kitchen?.venmo || "",
          zelle: kitchen?.zelle || "",
          kitchenImageURL: kitchen?.kitchenCoverPhoto || "",
        };
      }
    }
    return null;
  }, [currentKitchen]);

  // Handle edit pickup time
  const handleEditPickupTime = (item) => {
    setEditingItem(item);
    setModalSelectedDate(item.selectedDate || item.pickupDetails?.date);
    setModalSelectedTime(item.pickupDetails?.time);
    setIsDateTimePickerOpen(true);
  };

  // Handle DateTimePicker close
  const handleDateTimePickerClose = () => {
    setIsDateTimePickerOpen(false);
    setEditingItem(null);
    setModalSelectedDate(null);
    setModalSelectedTime(null);
  };

  // Handle date change in modal
  const handleModalDateChange = (date) => {
    setModalSelectedDate(date);
  };

  // Handle time change in modal
  const handleModalTimeChange = (time) => {
    setModalSelectedTime(time);
  };

  const handleWeChatDialogClose = useCallback(() => {
    setShowWeChatDialog(false);
  }, []);

  // Handle pickup details update from modal
  const handleModalPickupUpdate = async () => {
    if (editingItem && modalSelectedDate && modalSelectedTime) {
      // eslint-disable-next-line no-debugger
      const isPreOrder = editingItem.orderType === "PRE_ORDER";

      const pickupDetails = {
        date: modalSelectedDate,
        time: modalSelectedTime,
        display: isPreOrder
          ? `Pick up ${dayjs(modalSelectedDate).format("MMM D ddd")}`
          : "Pick up today",
        orderType: isPreOrder ? "PRE_ORDER" : "GO_GRAB",
      };

      console.log("🔄 Updating pickup details for item:", editingItem);
      console.log("🔄 New pickup details:", pickupDetails);

      try {
        // Update the cart item with new pickup details
        await handleQuantityChange({
          food: editingItem.food,
          kitchen: kitchenInfo,
          newQuantity: editingItem.quantity,
          // currentQuantity: editingItem.quantity,
          selectedDate: modalSelectedDate,
          selectedTime: modalSelectedTime,
          specialInstructions: editingItem.specialInstructions || "",
          incomingOrderType: isPreOrder ? "PRE_ORDER" : "GO_GRAB",
          calledFrom: "default",
          updateFlag: "date",
        });

        showToast.success(
          `Pickup time updated to ${pickupDetails.display} at ${pickupDetails.time}`
        );

        // Close the modal
        handleDateTimePickerClose();
      } catch (error) {
        console.error("Error updating pickup details:", error);
        showToast.error("Failed to update pickup time");
      }
    } else {
      showToast.error("Please select both date and time");
    }
  };

  // Group cart items by pickup date and time
  const groupedCartItems = useMemo(() => {
    const groups = {
      grabAndGo: [],
      preOrders: {},
    };
    console.log("Grouping cart items:", cartItems);
    cartItems.forEach((item) => {
      const orderType =
        item.pickupDetails?.orderType ||
        item.orderType ||
        (item.isPreOrder ? "PRE_ORDER" : "GO_GRAB");

      if (orderType === "GO_GRAB") {
        groups.grabAndGo.push({
          ...item,
          displayPickupTime: item.pickupDetails?.display || "Pick up today",
          displayPickupClock:
            item.pickupDetails?.time ||
            dayjs().add(30, "minutes").format("h:mm A"),
        });
      } else if (
        orderType === "PRE_ORDER" ||
        item.isPreOrder ||
        item.selectedDate
      ) {
        const dateKey = item.selectedDate || item.pickupDetails?.date;
        if (dateKey) {
          if (!groups.preOrders[dateKey]) {
            groups.preOrders[dateKey] = [];
          }
          groups.preOrders[dateKey].push({
            ...item,
            displayPickupTime:
              item.pickupDetails?.display ||
              `Pick up ${dayjs(dateKey).format("MMM D ddd")}`,
            displayPickupClock: item.pickupDetails?.time || "6:30 PM",
          });
        }
      } else {
        groups.grabAndGo.push({
          ...item,
          displayPickupTime: item.pickupDetails?.display || "Pick up today",
          displayPickupClock:
            item.pickupDetails?.time ||
            dayjs().add(30, "minutes").format("h:mm A"),
        });
      }
    });

    // Sort preOrder dates
    const sortedPreOrders = {};
    Object.keys(groups.preOrders)
      .sort((a, b) => dayjs(a).diff(dayjs(b)))
      .forEach((date) => {
        sortedPreOrders[date] = groups.preOrders[date];
      });
    groups.preOrders = sortedPreOrders;

    return groups;
  }, [cartItems]);

  // Calculate payment totals
  const paymentCalculation = useMemo(() => {
    const subtotal = cartItems.reduce((total, item) => {
      const itemPrice = parseFloat(item.food?.cost || item.food?.price || 0);
      const quantity = parseInt(item.quantity || 1);
      return total + itemPrice * quantity;
    }, 0);

    const salesTaxRate = 0; // 0%
    const salesTax = subtotal * salesTaxRate;
    const totalPayment = subtotal + salesTax;

    return {
      subtotal: subtotal.toFixed(2),
      salesTax: salesTax.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
    };
  }, [cartItems]);

  // Handle file upload with react-dropzone
  const onDrop = async (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      setUploadError(null);

      // Clean up previous preview URL
      if (uploadPreview) {
        URL.revokeObjectURL(uploadPreview);
      }

      // Create new preview URL
      const previewUrl = URL.createObjectURL(file);
      setUploadPreview(previewUrl);

      // Upload to Firebase Storage
      try {
        setIsUploading(true);

        // Get user ID from auth or use anonymous
        const userId = currentUser?.uid || "anonymous";

        // Upload to Firebase Storage
        const downloadURL = await uploadImageToStorage(
          file,
          "payment-screenshots",
          userId
        );

        setFirebaseImageUrl(downloadURL);
        showToast.success("Payment screenshot uploaded successfully!");
        console.log("Firebase Storage URL:", downloadURL);
      } catch (error) {
        console.error("Error uploading to Firebase:", error);
        setUploadError(error.message);
        showToast.error(`Upload failed: ${error.message}`);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".bmp", ".webp"],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB max file size
  });

  // Remove uploaded image
  const removeImage = () => {
    if (uploadPreview) {
      URL.revokeObjectURL(uploadPreview);
    }
    setUploadPreview(null);
    setUploadedFile(null);
    setFirebaseImageUrl(null);
    setUploadError(null);
  };

  // Add this validation function before handlePlaceOrder
  const validatePickupDates = () => {
    // Get today's date as plain string (YYYY-MM-DD format)
    const todayString = dayjs().format("YYYY-MM-DD");
    const invalidItems = [];

    cartItems.forEach((item) => {
      const pickupDate = item?.selectedDate; // Already in YYYY-MM-DD format

      if (pickupDate) {
        // ✅ Compare dates as strings to avoid timezone issues
        // pickupDate format: "YYYY-MM-DD" (e.g., "2025-10-30")
        // todayString format: "YYYY-MM-DD" (e.g., "2025-10-30")
        if (pickupDate < todayString) {
          invalidItems.push({
            name: item.food?.name || "Unknown Item",
            currentPickupDate: dayjs(pickupDate).format("MMMM D, YYYY"),
            pickupTime: item.pickupDetails?.time || item.selectedTime,
            itemData: item,
          });
        }
      }
    });

    console.log("📅 [Validation] Date check:", {
      today: todayString,
      invalidItemsCount: invalidItems.length,
      invalidItems: invalidItems.map((i) => ({
        name: i.name,
        pickupDate: i.itemData.selectedDate,
      })),
    });

    return invalidItems;
  };

  // Handle order placement
  const handlePlaceOrder = async () => {
    try {
      // Validation checks
      if (cartItems.length === 0) {
        showToast.error(
          "Your cart is empty. Please add items before placing an order."
        );
        return;
      }
      console.log("Placing order for user:", currentUser);
      // alert("Placing order for user: " + JSON.stringify(currentUser));
      console.log("Placing order for isAuthenticated:", isAuthenticated);
      // Check authentication FIRST before other validations
      if (!isAuthenticated || !currentUser) {
        console.log("🔒 Authentication required for placing order");
        setShowWeChatDialog(true);
        return;
      }

      // ✅ NEW: Validate pickup dates
      const invalidItems = validatePickupDates();
      if (invalidItems.length > 0) {
        console.log("❌ Invalid pickup dates found:", invalidItems);
        setInvalidDateItems(invalidItems);
        setShowDateValidationDialog(true);
        return;
      }

      // ✅ NEW: Validate item availability using imported function
      console.log("📦 Starting availability validation...");
      const unavailableItems = await validateItemAvailability(
        cartItems,
        kitchenInfo?.id || kitchenInfo?.kitchenId || cartItems[0]?.kitchenId
      );

      if (unavailableItems.length > 0) {
        console.log("❌ Unavailable items found:", unavailableItems);
        setInvalidDateItems(unavailableItems); // Reuse the same state
        setShowDateValidationDialog(true);
        return;
      }

      console.log("✅ All items available, proceeding with order...");

      if (paymentType === "online" && !firebaseImageUrl) {
        showToast.error(
          "Please upload a payment confirmation screenshot before placing your order."
        );
        return;
      }
      if (!kitchenInfo || !kitchenInfo.id || !cartItems[0]?.kitchenId) {
        showToast.error(
          "Kitchen information is missing. Please return to the listing page and try again."
        );
        return;
      }
      setIsPlacingOrder(true);

      // Create order object
      const orderData = createOrderObject({
        cartItems,
        kitchenInfo,
        firebaseImageUrl,
        currentUser,
        paymentCalculation,
        groupedCartItems,
        paymentType,
      });

      console.log("Order data to be placed:", orderData);

      // Place the order in Firestore
      const orderDocId = await placeOrder(orderData);

      // Clear the cart after successful order placement
      dispatch(clearCart());

      showToast.success(
        "Order placed successfully! Redirecting to success page..."
      );

      // Navigate to success page with order details
      setTimeout(() => {
        try {
          localStorage.removeItem("skipListing");
        } catch (error) {
          console.error("Error removing skipListing from localStorage:", error);
        }
        navigate("/success", {
          state: {
            orderID: orderData?.orderID,
            orderDocId: orderDocId,
            totalAmount: paymentCalculation?.totalPayment,
            kitchenName: kitchenInfo?.name,
            pickupAddress: kitchenInfo?.address,
            orderedItems: cartItems.map((item) => {
              const pickupDate = item.selectedDate;
              const orderType = item?.orderType;
              const isPreOrderItem =
                orderType === "PRE_ORDER" ||
                item.isPreOrder ||
                (pickupDate && pickupDate !== dayjs().format("YYYY-MM-DD"));

              console.log("🔍 [PaymentPage] Mapping cart item:", {
                name: item.food?.name,
                pickupDate,
                orderType,
                isPreOrderItem,
                originalIsPreOrder: item.isPreOrder,
              });

              return {
                id: item?.foodId || item?.id,
                foodItemId: item?.foodId || item?.id,
                name: item?.food?.name || "Unknown Item",
                description:
                  item?.food?.description ||
                  "This dish features tender, juicy flavors",
                imageUrl: item?.food?.imageUrl || item?.food?.image,
                price: item?.food?.cost || item?.food?.price || "0.00",
                quantity: item?.quantity || 1,
                pickupDate: item?.selectedDate,
                pickupTime: item?.selectedTime,
                isPreOrder: isPreOrderItem,
                orderType: orderType,
                isFromPreorder: item?.isFromPreorder || isPreOrderItem,
              };
            }),
          },
        });
      }, 2000);
    } catch (error) {
      console.error("Error placing order:", error);
      showToast.error(`Failed to place order: ${error.message}`);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleCopyEmail = async (email) => {
    try {
      await navigator.clipboard.writeText(email);
      showToast.success(`${email} copied to clipboard!`);
    } catch (error) {
      console.error("Failed to copy email:", error);
      // showToast.error("Failed to copy email");
    }
  };

  const handleFixInvalidDate = (item) => {
    console.log("item pickup time select from here", item);
    setShowDateValidationDialog(false);
    handleEditPickupTime(item);
  };

  return (
    <>
      <div className="container">
        <div className="mobile-container">
          <div className="padding-20 order-page">
            <h4 className="medium-title mb-12">Pickup Address</h4>
            <p className="body-text-med mb-20">{kitchenInfo?.address}</p>

            <div className="hr mb-18"></div>

            {/* <div className="payment-method mb-20"> ... */}
            <div className="other-payments-wrapper mb-20">
              <h2 className="title">
                Other Payments acceptable to{" "}
                {kitchenInfo?.name || "the Kitchen"}
              </h2>
              {kitchenInfo?.paypal && kitchenInfo?.paypal !== "" && (
                <div className="item-flex">
                  <div className="left">
                    <div className="text">PayPal to</div>
                    <a className="email">{kitchenInfo?.paypal}</a>
                  </div>
                  <div
                    className="copy"
                    onClick={async () =>
                      await handleCopyEmail(kitchenInfo?.paypal)
                    }
                  >
                    <Copy /> Copy
                  </div>
                </div>
              )}
              {kitchenInfo?.venmo && kitchenInfo?.venmo !== "" && (
                <div className="item-flex">
                  <div className="left">
                    <div className="text">Venmo to</div>
                    <a className="email">{kitchenInfo?.venmo}</a>
                  </div>
                  <div
                    className="copy"
                    onClick={async () =>
                      await handleCopyEmail(kitchenInfo?.venmo)
                    }
                  >
                    <Copy /> Copy
                  </div>
                </div>
              )}

              {kitchenInfo?.zelle && kitchenInfo?.zelle !== "" && (
                <div className="item-flex">
                  <div className="left">
                    <div className="text">Zelle to</div>
                    <a className="email">{kitchenInfo?.zelle}</a>
                  </div>
                  <div
                    className="copy"
                    onClick={async () =>
                      await handleCopyEmail(kitchenInfo?.zelle)
                    }
                  >
                    <Copy /> Copy
                  </div>
                </div>
              )}
            </div>
            <div className="payment-method mb-20">
              <h5 className="medium-title mb-20">Payment Details</h5>
              <div className="hr mb-20"></div>
              <div className="item-flex">
                <span>Subtotal</span>
                <span>${paymentCalculation.subtotal}</span>
              </div>
              <div className="item-flex">
                <span>Sales Tax (0%)</span>
                <span>${paymentCalculation.salesTax}</span>
              </div>
              <div className="hr mb-12"></div>
              <div className="item-flex bold">
                <span>Total Payment</span>
                <span>${paymentCalculation.totalPayment}</span>
              </div>
            </div>

            {/* Order Items with Pickup Times */}
            <div className="order-items-section mb-20">
              <h3 className="order-items-title">Select Pickup Date & Time</h3>

              {/* Check if cart has items */}
              {cartItems.length === 0 ? (
                <div className="empty-cart-message">
                  <p className="body-text-med">No items in cart</p>
                </div>
              ) : (
                <div className="pickup-items-list">
                  {/* Go&Grab Items */}
                  {groupedCartItems.grabAndGo.length > 0 &&
                    groupedCartItems.grabAndGo.map((item, index) => (
                      <div
                        key={`grab-${item.foodId}-${index}`}
                        className="pickup-item-row"
                      >
                        <div className="item-info">
                          <div className="food-image">
                            <img
                              src={item.food?.imageUrl || item.food?.image}
                              alt={item.food?.name}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          </div>
                          <div className="food-details">
                            <h5 className="food-name">
                              {item.food?.name || "Unknown Item"}
                            </h5>
                            <div className="pickup-time">
                              {dayjs(item.selectedDate).format(
                                "dddd, MMMM D, YYYY"
                              )}{" "}
                              at{" "}
                              {dayjs(item.selectedTime, "h:mm A").format(
                                "h:mm A"
                              )}
                            </div>
                            <div className="item-quantity">
                              Qty: {item.quantity} × $
                              {item.food?.cost || item.food?.price || "0.00"}
                            </div>
                          </div>
                        </div>
                        <div
                          className="edit-icon"
                          role="button"
                          tabIndex={0}
                          onClick={() => handleEditPickupTime(item)}
                        >
                          <img src={Edit} alt="Edit pickup time" />
                        </div>
                      </div>
                    ))}

                  {/* Pre-Order Items */}
                  {Object.keys(groupedCartItems.preOrders).length > 0 &&
                    Object.entries(groupedCartItems.preOrders).map(
                      ([date, items]) =>
                        items.map((item, index) => (
                          <div
                            key={`preorder-${item.foodId}-${date}-${index}`}
                            className="pickup-item-row"
                          >
                            <div className="item-info">
                              <div className="food-image">
                                <img
                                  src={item.food?.imageUrl || item.food?.image}
                                  alt={item.food?.name}
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              </div>
                              <div className="food-details">
                                <h5 className="food-name">
                                  {item.food?.name || "Unknown Item"}
                                </h5>
                                <div className="pickup-time">
                                  {dayjs(item.selectedDate).format(
                                    "dddd, MMMM D, YYYY"
                                  )}{" "}
                                  at{" "}
                                  {dayjs(item.selectedTime, "h:mm A").format(
                                    "h:mm A"
                                  )}
                                </div>
                                <div className="item-quantity">
                                  Qty: {item.quantity} × $
                                  {item.food?.cost ||
                                    item.food?.price ||
                                    "0.00"}
                                </div>
                              </div>
                            </div>
                            <div
                              className="edit-icon"
                              role="button"
                              tabIndex={0}
                              onClick={() => handleEditPickupTime(item)}
                            >
                              <img src={Edit} alt="Edit pickup time" />
                            </div>
                          </div>
                        ))
                    )}
                </div>
              )}
            </div>
            <div className="mb-4">
              <div>
                <input
                  type="radio"
                  id="paymentType"
                  value="online"
                  checked={paymentType === "online"}
                  name="paymentType"
                  required
                  onChange={() => setPaymentType("online")}
                />
                <label htmlFor="paymentType" className="body-text-med ms-2">
                  Online payment
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  id="paymentType2"
                  value="cash"
                  checked={paymentType === "cash"}
                  name="paymentType"
                  onChange={() => setPaymentType("cash")}
                />
                <label htmlFor="paymentType2" className="body-text-med ms-2">
                  I will pay cash
                </label>
              </div>
            </div>
            {paymentType === "online" && (
              <div className="upload-section mb-20">
                <h5 className="medium-title mb-12">Payment Confirmation</h5>
                <p className="body-text-med mb-16">
                  Upload payment confirmation screenshot
                </p>

                {uploadPreview ? (
                  <div className="upload-preview-container">
                    <div className="upload-preview">
                      <img
                        src={uploadPreview}
                        alt="Payment confirmation preview"
                        className="preview-image"
                      />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={removeImage}
                        aria-label="Remove image"
                        disabled={isUploading}
                      >
                        <X size={16} />
                      </button>

                      {/* Upload Status Overlay */}
                      {isUploading && (
                        <div className="upload-status-overlay">
                          <div className="upload-spinner"></div>
                          <p>Uploading to Firebase...</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div
                    {...getRootProps()}
                    className={`upload-dropzone ${
                      isDragActive ? "active" : ""
                    }`}
                  >
                    <input {...getInputProps()} />
                    <div className="upload-content">
                      <div className="upload-icon">
                        <ImageIcon size={32} />
                      </div>
                      <h6 className="upload-title">
                        {isDragActive ? "Drop image here" : "Upload Screenshot"}
                      </h6>
                      <p className="upload-description">
                        Drag & drop your payment confirmation or{" "}
                        <span className="upload-link">browse files</span>
                      </p>
                      <p className="upload-formats">
                        Supports: JPG, PNG, GIF, WebP (Max 10MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
            <button
              className="action-button"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || isUploading || cartItems.length === 0}
            >
              {isPlacingOrder
                ? "Placing Order..."
                : !isAuthenticated
                ? "Login to Place Order"
                : "Place My Order"}
            </button>
          </div>
        </div>
      </div>

      {/* DateTimePicker Modal */}
      {isDateTimePickerOpen && editingItem && (
        <div className="modal-overlay" onClick={handleDateTimePickerClose}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Pickup Time</h3>
              <button
                className="modal-close-btn"
                onClick={handleDateTimePickerClose}
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-content">
              <div className="editing-item-info">
                <h4>{editingItem.food?.name || "Food Item"}</h4>
                <p>
                  Current pickup: {editingItem.displayPickupTime} at{" "}
                  {editingItem.displayPickupClock}
                </p>
              </div>

              <div className="date-time-picker-container">
                {/* Use the DateTimePicker component instead of custom inputs */}
                <DateTimePicker
                  food={editingItem.food}
                  kitchen={kitchenInfo}
                  orderType={
                    editingItem.orderType ||
                    editingItem.pickupDetails?.orderType ||
                    "GO_GRAB"
                  }
                  selectedDate={modalSelectedDate}
                  selectedTime={modalSelectedTime}
                  onDateChange={handleModalDateChange}
                  onTimeChange={handleModalTimeChange}
                  disabled={false}
                  className="payment-modal-picker"
                  dateLabel="Select Pickup Date:"
                  timeLabel="Select Pickup Time:"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={handleDateTimePickerClose}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleModalPickupUpdate}
                disabled={!modalSelectedDate || !modalSelectedTime}
              >
                Update Pickup Time
              </button>
            </div>
          </div>
        </div>
      )}
      {showWeChatDialog && (
        <WeChatAuthDialog
          firebaseImageUrl={firebaseImageUrl}
          onClose={handleWeChatDialogClose}
        />
      )}
      {showDateValidationDialog && (
        <div
          className="modal-overlay"
          onClick={() => setShowDateValidationDialog(false)}
        >
          <div
            className="modal-container validation-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h3 className="modal-title">
                {invalidDateItems[0]?.reason?.includes("available") ||
                invalidDateItems[0]?.reason?.includes("stock") ||
                invalidDateItems[0]?.availableQuantity !== undefined
                  ? "⚠️ Items Unavailable"
                  : "⚠️ Invalid Pickup Dates"}
              </h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowDateValidationDialog(false)}
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-content">
              <p className="validation-message">
                {invalidDateItems[0]?.reason?.includes("available") ||
                invalidDateItems[0]?.reason?.includes("stock") ||
                invalidDateItems[0]?.availableQuantity !== undefined
                  ? "The following items are no longer available in the requested quantity:"
                  : "The following items have pickup dates in the past. Please update them to continue:"}
              </p>

              <div className="invalid-items-list">
                {invalidDateItems.map((item, index) => (
                  <div key={index} className="invalid-item-card">
                    <div className="invalid-item-info">
                      <div className="food-image-small">
                        <img
                          src={
                            item.itemData?.food?.imageUrl ||
                            item.itemData?.food?.image
                          }
                          alt={item.name}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                      <div className="invalid-item-details">
                        <h5 className="food-name-bold">{item.name}</h5>
                        <div className="invalid-date-info">
                          {item.reason ? (
                            // Availability error
                            <>
                              <span className="error-text">{item.reason}</span>
                              {item.requestedQuantity && (
                                <span className="date-label">
                                  Requested: {item.requestedQuantity}
                                  {item.availableQuantity !== undefined &&
                                    ` | Available: ${item.availableQuantity}`}
                                </span>
                              )}
                            </>
                          ) : (
                            // Date error
                            <>
                              <span className="date-label">
                                Current pickup date:
                              </span>
                              <span className="error-text">
                                {item.currentPickupDate} at {item.pickupTime}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary full-width"
                onClick={() => {
                  setShowDateValidationDialog(false);
                  // Navigate back to cart to adjust quantities
                  navigate("/order");
                }}
              >
                Go to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
