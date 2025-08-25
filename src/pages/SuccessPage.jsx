import React from "react";
import {           <div className="success-image-wrapper">
            <img src={Success} alt="Success" />
            <h2 className="title">
              Your order has been <br /> successfully placed
            </h2>
            <p className="text mb-20">
              Your order is being worked on. It'll take <br /> 20-30 min to get
              ready for pick up.
            </p>
            
            {/* Order Details */}
            {orderID && (
              <div className="order-summary-card">
                <h4 className="order-summary-title">Order Summary</h4>
                
                <div className="order-detail-row">
                  <span className="detail-label">Order ID:</span>
                  <span className="detail-value">#{orderID}</span>
                </div>
                
                {totalAmount && (
                  <div className="order-detail-row">
                    <span className="detail-label">Total Amount:</span>
                    <span className="detail-value">${totalAmount}</span>
                  </div>
                )}
                
                {kitchenName && (
                  <div className="order-detail-row">
                    <span className="detail-label">Kitchen:</span>
                    <span className="detail-value">{kitchenName}</span>
                  </div>
                )}
                
                {pickupAddress && (
                  <div className="order-detail-row">
                    <span className="detail-label">Pickup Address:</span>
                    <span className="detail-value">{pickupAddress}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="success-actions">
            <Link to="/order" className="action-button secondary mb-12">
              View Order Details
            </Link>
            <Link to="/" className="action-button">
              Back to Home
            </Link>
          </div>tion } from "react-router-dom";
import Success from "../assets/images/success.svg";

export default function SuccessPage() {
  const location = useLocation();
  const orderDetails = location.state || {};
  
  const {
    orderID,
    orderDocId,
    totalAmount,
    kitchenName,
    pickupAddress
  } = orderDetails;

  return (
    <div className="container">
      <div className="mobile-container">
        <div className="padding-20 order-page">
          <div className="back-link-title">
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
          </div>
          <div className="success-image-wrapper">
            <img src={Success} alt="Success" />
            <h2 className="title">
              Your order has been <br /> successfully placed
            </h2>
            <p className="text mb-0">
              Your orders is being worked on. It’ll take <br /> 20-30 min to get
              ready for pick up.
            </p>
          </div>
          <Link to="/" className="action-button">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
