import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import dayjs from "dayjs";
import Edit from "../assets/images/edit.svg";
import Map from "../assets/images/map.png";
import {
  Copy,
  Upload,
  X,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { uploadImageToStorage } from "../services/storageService";
import { showToast } from "../utils/toast";
import { placeOrder, createOrderObject } from "../services/orderService";
import { clearCart } from "../store/slices/cartSlice";

export default function PaymentPage() {
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [firebaseImageUrl, setFirebaseImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get cart items from Redux
  const cartItems = useSelector((state) => state.cart.items);
  const currentKitchen = useSelector((state) => state.food.currentKitchen);
  const currentUser = useSelector((state) => state.auth.user);
  // Get kitchen information from cart items
  const kitchenInfo = useMemo(() => {
    if (currentKitchen) {
      // Get kitchen from currentKitchen in food object
      const kitchen = currentKitchen;
      console.log("kitchen", kitchen);
      if (kitchen) {
        return {
          id: kitchen.id || kitchen.ownerId || "PKcWQYMxEZQxnKSLp4de", // Use fallback kitchen ID
          name: kitchen.name || "James Kitchen",
          address:
            kitchen.address || "120 Lane San Francisco, East Falmouth MA",
          latitude: kitchen.location?.lat || kitchen.latitude || 41.5742,
          longitude: kitchen.location?.lng || kitchen.longitude || -70.6109,
        };
      }
    }
    return {
      id: "PKcWQYMxEZQxnKSLp4de", // Fallback kitchen ID
      name: "James Kitchen",
      address: "120 Lane San Francisco, East Falmouth MA",
      latitude: 41.5742,
      longitude: -70.6109,
    };
  }, [currentKitchen]);

  // Handle edit pickup time
  const handleEditPickupTime = (item) => {
    // Navigate to order page with the specific item to edit
    navigate("/order", {
      state: {
        editItem: item.id || item.foodId,
        returnTo: "/payment",
      },
    });
  };

  // Group cart items by pickup date and time
  const groupedCartItems = useMemo(() => {
    const groups = {
      grabAndGo: [],
      preOrders: {},
    };

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

  // Format date for display
  const formatDate = (dateString) => {
    return dayjs(dateString).format("MMM D ddd");
  };

  // Get summary of pickup dates and times from cart
  const pickupSummary = useMemo(() => {
    const summary = [];

    // Add Go&Grab items
    if (groupedCartItems.grabAndGo.length > 0) {
      const firstGrabItem = groupedCartItems.grabAndGo[0];
      summary.push({
        type: "Go&Grab",
        date: "Today",
        time: firstGrabItem.displayPickupClock,
        count: groupedCartItems.grabAndGo.length,
      });
    }

    // Add Pre-Order items by date
    Object.entries(groupedCartItems.preOrders).forEach(([date, items]) => {
      const firstItem = items[0];
      summary.push({
        type: "Pre-Order",
        date: formatDate(date),
        time: firstItem.displayPickupClock,
        count: items.length,
      });
    });

    return summary;
  }, [groupedCartItems, formatDate]);

  // Calculate payment totals
  const paymentCalculation = useMemo(() => {
    const subtotal = cartItems.reduce((total, item) => {
      const itemPrice = parseFloat(item.food?.cost || item.food?.price || 0);
      const quantity = parseInt(item.quantity || 1);
      return total + itemPrice * quantity;
    }, 0);

    const salesTaxRate = 0.0725; // 7.25%
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

      if (!firebaseImageUrl) {
        showToast.error(
          "Please upload a payment confirmation screenshot before placing your order."
        );
        return;
      }

      if (!currentUser) {
        showToast.error("Please log in to place an order.");
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
        navigate("/success", {
          state: {
            orderID: orderData.orderID,
            orderDocId: orderDocId,
            totalAmount: paymentCalculation.totalPayment,
            kitchenName: kitchenInfo.name,
            pickupAddress: kitchenInfo.address,
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

  return (
    <>
      <div className="container">
        <div className="mobile-container">
          <div className="padding-20 order-page">
            <h4 className="medium-title mb-12">Pickup Address</h4>
            <p className="body-text-med mb-20">{kitchenInfo.address}</p>
            <div className="map-container">
              <div className="interactive-map">
                {/* For demo purposes, using a styled fallback map */}
                <div className="map-fallback">
                  <img
                    src={Map}
                    alt="Kitchen location map"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "12px",
                    }}
                  />
                  <div className="map-overlay">
                    <div className="map-pin">
                      <div className="pin-icon">📍</div>
                      <span className="pin-label">{kitchenInfo.name}</span>
                    </div>
                  </div>
                </div>
                {/* Uncomment below for real Google Maps integration */}
                {/* <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${kitchenInfo.latitude},${kitchenInfo.longitude}&zoom=15`}
                  width="100%"
                  height="200"
                  style={{ border: 0, borderRadius: "12px" }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Kitchen Location"
                /> */}
              </div>
            </div>
            <div className="hr mb-18"></div>

            {/* <div className="payment-method mb-20"> ... */}
            <div className="other-payments-wrapper mb-20">
              <h2 className="title">
                Other Payments acceptable to James Kitchen Kitchen
              </h2>
              <div className="item-flex">
                <div className="left">
                  <div className="text">PayPal to</div>
                  <a className="email">jamesPayPal00@gmail.com</a>
                </div>
                <div className="copy">
                  <Copy /> Copy
                </div>
              </div>
              <div className="item-flex">
                <div className="left">
                  <div className="text">Venmo to</div>
                  <a className="email">jamesVenmo00@gmail.com</a>
                </div>
                <div className="copy">
                  <Copy /> Copy
                </div>
              </div>
            </div>
            <div className="payment-method mb-20">
              <h5 className="medium-title mb-20">Payment Details</h5>
              <div className="hr mb-20"></div>
              <div className="item-flex">
                <span>Subtotal</span>
                <span>${paymentCalculation.subtotal}</span>
              </div>
              <div className="item-flex">
                <span>Sales Tax (7.25%)</span>
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
                              Today, {item.displayPickupClock}
                            </div>
                            <div className="item-quantity">
                              Qty: {item.quantity} × $
                              {item.food?.cost || item.food?.price || "0.00"}
                            </div>
                          </div>
                        </div>
                        <div
                          className="edit-icon"
                          onClick={() => handleEditPickupTime(item)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              handleEditPickupTime(item);
                            }
                          }}
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
                                  {formatDate(date)}, {item.displayPickupClock}
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
                              onClick={() => handleEditPickupTime(item)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  handleEditPickupTime(item);
                                }
                              }}
                            >
                              <img src={Edit} alt="Edit pickup time" />
                            </div>
                          </div>
                        ))
                    )}
                </div>
              )}
            </div>

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

                  <div className="file-info">
                    <div className="file-details">
                      <p className="file-name">{uploadedFile?.name}</p>
                      <p className="file-size">
                        {uploadedFile &&
                          (uploadedFile.size / 1024 / 1024).toFixed(2)}{" "}
                        MB
                      </p>
                    </div>

                    {/* Upload Status */}
                    <div className="upload-status">
                      {isUploading && (
                        <div className="status-item uploading">
                          <Upload size={16} />
                          <span>Uploading...</span>
                        </div>
                      )}

                      {firebaseImageUrl && !isUploading && (
                        <div className="status-item success">
                          <CheckCircle size={16} />
                          <span>Uploaded to Firebase</span>
                        </div>
                      )}

                      {uploadError && (
                        <div className="status-item error">
                          <AlertCircle size={16} />
                          <span>Upload failed</span>
                        </div>
                      )}
                    </div>

                    {/* Firebase URL */}
                    {firebaseImageUrl && (
                      <div className="firebase-url">
                        <p className="url-label">Firebase Storage URL:</p>
                        <a
                          href={firebaseImageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="url-link"
                        >
                          View uploaded image
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className={`upload-dropzone ${isDragActive ? "active" : ""}`}
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
            <button
              className="action-button"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || isUploading || cartItems.length === 0}
            >
              {isPlacingOrder ? "Placing Order..." : "Place My Order"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
