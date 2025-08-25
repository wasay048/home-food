import React, { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import Calendar from "../assets/images/calendar.svg";
import Edit from "../assets/images/edit.svg";
import Map from "../assets/images/map.png";
import { Copy } from "lucide-react";

export default function PaymentPage() {
  const [uploadPreview, setUploadPreview] = useState(null);
  const navigate = useNavigate();

  // Get cart items from Redux
  const cartItems = useSelector((state) => state.cart.items);
  const currentKitchen = useSelector((state) => state.food.currentKitchen);
  // Get kitchen information from cart items
  const kitchenInfo = useMemo(() => {
    if (currentKitchen) {
      // Get kitchen from currentKitchen in food object
      const kitchen = currentKitchen;
      console.log("kitchen", kitchen);
      if (kitchen) {
        return {
          name: kitchen.name || "James Kitchen",
          address:
            kitchen.address || "120 Lane San Francisco, East Falmouth MA",
          latitude: kitchen.location?.lat || kitchen.latitude || 41.5742,
          longitude: kitchen.location?.lng || kitchen.longitude || -70.6109,
        };
      }
    }
    return {
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
                  style={{ border: 0, borderRadius: '12px' }}
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

            <p className="body-text-med mb-3">
              Upload payment confirmation screenshot
            </p>
            {uploadPreview && (
              <div className="upload-preview mb-12">
                <img
                  src={uploadPreview}
                  alt="Payment confirmation preview"
                  style={{
                    width: "100%",
                    maxHeight: 220,
                    objectFit: "cover",
                    borderRadius: 12,
                  }}
                />
              </div>
            )}
            <div className="upload-wrapper">
              <div className="upload">
                Upload
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files && e.target.files[0];
                    if (file) {
                      if (uploadPreview) URL.revokeObjectURL(uploadPreview);
                      const url = URL.createObjectURL(file);
                      setUploadPreview(url);
                    }
                  }}
                />
              </div>
            </div>
            <button className="action-button">Place My Order</button>
          </div>
        </div>
      </div>
    </>
  );
}
