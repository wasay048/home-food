import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Calendar from '../assets/images/calendar.svg'
import Edit from '../assets/images/edit.svg'
import Map from '../assets/images/map.png'
import { Copy } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function PaymentPage() {
  const [isChecked, setIsChecked] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const editBtnRef = useRef(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  return (
    <>
      <div className="container">
        <div className="mobile-container">
          <div className="padding-20 order-page">
            <div style={{ position: "relative" }}>
              <div className="date-selection">
                <div className="left">
                  <button className="action">
                    <img src={Calendar} alt="" />
                  </button>
                  <div className="data">
                    <div className="title">Select Pickup Date & Time</div>
                    <div className="date">Date , Time</div>
                  </div>
                </div>
                <button
                  className="action"
                  ref={editBtnRef}
                  type="button"
                  onClick={() => setShowDatePicker((v) => !v)}
                >
                  <img src={Edit} alt="" />
                </button>
              </div>
              {showDatePicker && (
                <div style={{ position: "absolute", right: 0, top: "100%", zIndex: 1000 }}>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      setShowDatePicker(false);
                    }}
                    showTimeSelect
                    dateFormat="Pp"
                    inline
                  />
                </div>
              )}
            </div>
            <h4 className="medium-title mb-12">Pickup Address</h4>
            <p className="body-text-med mb-20">120 Lane San Fransisco , East Falmouth MA</p>
            <div className="map-container">
              <img src={Map} alt="" />
            </div>
            <div className="hr mb-18"></div>
            <button className="add-address mb-20">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9H15M9 15V9L9 3" stroke="#3FC045" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Add New Address
            </button>
            {/* <div className="payment-method mb-20"> ... */}
            <div className="other-payments-wrapper mb-20">
              <h2 className="title">Other Payments acceptable to James Kitchen Kitchen</h2>
              <div className="item-flex">
                <div className="left">
                  <div className="text">PayPal to</div>
                  <a className="email">jamesPayPal00@gmail.com</a>
                </div>
                <div className="copy"><Copy />  Copy</div>
              </div>
              <div className="item-flex">
                <div className="left">
                  <div className="text">Venmo to</div>
                  <a className="email">jamesVenmo00@gmail.com</a>
                </div>
                <div className="copy"><Copy />  Copy</div>
              </div>
            </div>
            <div className="payment-method mb-20">
              <h5 className="medium-title mb-20">Payment Details</h5>
              <div className="hr mb-20"></div>
              <div className="item-flex">
                <span>Sales Tax (7.25%)</span>
                <span>$6.00</span>
              </div>
              <div className="item-flex">
                <span>Service Fee (10%)</span>
                <span>$6.00</span>
              </div>
              <div className="item-flex">
                <span>Grand Subtotal</span>
                <span>$6.00</span>
              </div>
              <div className="item-flex">
                <span>Service Fee</span>
                <span>$1.00</span>
              </div>
              <div className="hr mb-12"></div>
              <div className="item-flex bold">
                <span>Total Payment</span>
                <span>$19.00</span>
              </div>
            </div>
              <p className="body-text-med mb-3">
                Upload payment confirmation screenshot
              </p>
              {uploadPreview && (
                <div className="upload-preview mb-12">
                  <img
                    src={uploadPreview}
                    alt="Payment confirmation preview"
                    style={{ width: '100%', maxHeight: 220, objectFit: 'cover', borderRadius: 12 }}
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
