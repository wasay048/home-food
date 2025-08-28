import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import dayjs from "dayjs";
import Success from "../assets/images/success.svg";
import qrCode from "../assets/images/home-food-qr.svg";

export default function SuccessPage() {
  const location = useLocation();
  const orderDetails = location.state || {};

  const { orderID, totalAmount, kitchenName, pickupAddress, orderedItems } =
    orderDetails;

  // Debug logging
  console.log("🔍 [SuccessPage] Order details received:", {
    orderID,
    totalAmount,
    kitchenName,
    pickupAddress,
    orderedItemsCount: orderedItems?.length || 0,
    orderedItems: orderedItems,
  });

  // Format date function similar to OrderPage
  const formatDate = (dateString) => {
    if (!dateString) return "Today";
    return dayjs(dateString).format("ddd, MMM D");
  };

  // Group ordered items by pickup date and type (similar to OrderPage grouping)
  const groupedOrderedItems = useMemo(() => {
    if (!orderedItems?.length) return { goGrab: [], preOrders: {} };

    const grouped = { goGrab: [], preOrders: {} };

    console.log("🔍 [SuccessPage] Grouping ordered items:", orderedItems);

    orderedItems.forEach((item) => {
      console.log("🔍 [SuccessPage] Processing item:", {
        name: item.name,
        isPreOrder: item.isPreOrder,
        pickupDate: item.pickupDate,
        hasPickupDate: !!item.pickupDate,
      });

      // Check multiple ways an item could be identified as pre-order
      const isPreOrderItem =
        item.orderType === "PRE_ORDER" || item.orderType === "Pre-Order";

      if (isPreOrderItem && item.pickupDate) {
        const dateKey = item.pickupDate;
        if (!grouped.preOrders[dateKey]) {
          grouped.preOrders[dateKey] = [];
        }
        grouped.preOrders[dateKey].push(item);
        console.log("🔍 [SuccessPage] Added to pre-orders for date:", dateKey);
      } else {
        grouped.goGrab.push(item);
        console.log("🔍 [SuccessPage] Added to go&grab");
      }
    });

    console.log("🔍 [SuccessPage] Final grouping:", {
      goGrabCount: grouped.goGrab.length,
      preOrderDates: Object.keys(grouped.preOrders),
      preOrderCounts: Object.entries(grouped.preOrders).map(
        ([date, items]) => ({
          date,
          count: items.length,
        })
      ),
    });

    return grouped;
  }, [orderedItems]);

  // Calculate totals (similar to OrderPage)
  const totals = useMemo(() => {
    if (!orderedItems?.length)
      return { subtotal: "0.00", tax: "0.00", total: "0.00" };

    const subtotal = orderedItems.reduce((sum, item) => {
      const price = parseFloat(item.price || item.cost || 0);
      const quantity = parseInt(item.quantity || 1);
      return sum + price * quantity;
    }, 0);

    const tax = subtotal * 0.0725; // 7.25% tax
    const total = subtotal + tax;

    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
    };
  }, [orderedItems]);

  const totalItemsCount =
    orderedItems?.reduce(
      (sum, item) => sum + parseInt(item.quantity || 1),
      0
    ) || 0;

  return (
    <div className="container">
      <div className="mobile-container">
        <div className="padding-20 order-page">
          {/* <div className="back-link-title">
            <Link className="back-link" to="/">
              <svg
                width="9"
                height="14"
                viewBox="0 0 9 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.94194 0.51631C8.18602 0.760388 8.18602 1.15612 7.94194 1.40019L2.34222 6.99992L7.94194 12.5996C8.18602 12.8437 8.18602 13.2394 7.94194 13.4835C7.69786 13.7276 7.30214 13.7276 7.05806 13.4835L1.01639 7.44186C0.772315 7.19778 0.772315 6.80205 1.01639 6.55798L7.05806 0.51631C7.30214 0.272233 7.69786 0.272233 7.94194 0.51631Z"
                  fill="#212226"
                />
              </svg>
            </Link>
            <div className="title">Payment Success</div>
          </div> */}

          <div className="success-image-wrapper pt-5">
            <img src={Success} alt="Success" />
            <h2 className="title">Your order has been successfully placed</h2>
          </div>

          {/* Ordered Items Sections - Similar to OrderPage structure */}
          {orderedItems && orderedItems.length > 0 ? (
            <>
              {/* Go & Grab Section */}
              {groupedOrderedItems.goGrab.length > 0 && (
                <>
                  <h2 className="small-title mb-16">Go & Grab</h2>
                  <div className="menu-listing">
                    {groupedOrderedItems.goGrab.map((item, index) => (
                      <div
                        key={`go-grab-${item.foodItemId || item.id}-${index}`}
                        className="menu-list"
                      >
                        <div className="left">
                          <div className="image">
                            <img
                              src={
                                item.imageUrl ||
                                "/src/assets/images/product.png"
                              }
                              alt={item.name || "Food item"}
                              onError={(e) => {
                                e.target.src = "/src/assets/images/product.png";
                              }}
                            />
                          </div>
                          <div className="data">
                            <div className="title">
                              {item.name || "Unknown Item"}
                            </div>
                            <div className="text">
                              {item.description ||
                                "This dish features tender, juicy flavors"}
                            </div>
                            <div className="price">
                              $ {item.price || item.cost || "0.00"}
                            </div>
                          </div>
                        </div>
                        <div className="quantity-warpper">
                          <div className="right">
                            <div className="quantity-text">
                              Qty: {item.quantity || 1}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Pre-Order Sections - Show after Go&Grab */}
              {Object.entries(groupedOrderedItems.preOrders).map(
                ([date, items]) => (
                  <div key={date}>
                    <h2 className="small-title mb-16">
                      Pre-order for {formatDate(date)}
                    </h2>
                    <div className="menu-listing">
                      {items.map((item, index) => (
                        <div
                          key={`preorder-${
                            item.foodItemId || item.id
                          }-${date}-${index}`}
                          className="menu-list"
                        >
                          <div className="left">
                            <div className="image">
                              <img
                                src={
                                  item.imageUrl ||
                                  "/src/assets/images/product.png"
                                }
                                alt={item.name || "Food item"}
                                onError={(e) => {
                                  e.target.src =
                                    "/src/assets/images/product.png";
                                }}
                              />
                            </div>
                            <div className="data">
                              <div className="title">
                                {item.name || "Unknown Item"}
                              </div>
                              <div className="text">
                                {item.description ||
                                  "This dish features tender, juicy flavors"}
                              </div>
                              <div className="price">
                                $ {item.price || item.cost || "0.00"}
                              </div>
                            </div>
                          </div>
                          <div className="quantity-warpper">
                            <div className="right flex-column">
                              <div className="quantity-text">
                                Qty: {item.quantity || 1}
                              </div>
                              {item.pickupTime && (
                                <div className="pickup-time-display">
                                  {item.pickupTime}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}

              {/* Order Summary - Similar to OrderPage */}
              <div
                className="order-summary"
                style={{
                  backgroundColor: "#f8f9fa",
                  padding: "16px",
                  borderRadius: "8px",
                  marginTop: "24px",
                  marginBottom: "16px",
                }}
              >
                <div
                  className="summary-row"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span>
                    Subtotal ({totalItemsCount} item
                    {totalItemsCount !== 1 ? "s" : ""}):
                  </span>
                  <span>${totals.subtotal}</span>
                </div>
                <div
                  className="summary-row"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                  }}
                >
                  <span>Tax (7.25%):</span>
                  <span>${totals.tax}</span>
                </div>
                <div
                  className="summary-row"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "600",
                    fontSize: "16px",
                    borderTop: "1px solid #dee2e6",
                    paddingTop: "8px",
                  }}
                >
                  <span>Total:</span>
                  <span>${totals.total}</span>
                </div>
              </div>
            </>
          ) : (
            /* Debug section when no ordered items */
            <div
              style={{
                padding: "20px",
                background: "#f0f0f0",
                margin: "20px 0",
                borderRadius: "8px",
              }}
            >
              <h4>Debug: No Ordered Items Found</h4>
              <p>Order Details: {JSON.stringify(orderDetails, null, 2)}</p>
            </div>
          )}

          <div className="success-actions mb-16">
            {/* <Link to="/order" className="action-button secondary mb-12">
              View Order Details
            </Link> */}
            <Link to="/" className="action-button">
              Back to Home
            </Link>
          </div>
          <div className="scanner-bottom mb-16">
            <div className="text">
              Order can be viewed in the <strong>HomeFresh</strong> app,
              available in the iOS App Store. The app also sends reminders on
              the morning of each scheduled pickup.
            </div>
            <div className="qr">
              <img src={qrCode} alt="QR Code" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
