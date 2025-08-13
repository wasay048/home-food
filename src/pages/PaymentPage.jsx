import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Calendar from '../assets/images/calendar.svg'
import Edit from '../assets/images/edit.svg'
import Map from '../assets/images/map.png'
import { Copy } from "lucide-react";
export default function PaymentPage() {
   const [isChecked, setIsChecked] = useState(false);
  return (
  <div className="container">
        <div className="mobile-container">
  <div className="padding-20 order-page">
    <div className="top">
      <div className="back-link-title">
      <Link className="back-link">
      <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M7.94194 0.51631C8.18602 0.760388 8.18602 1.15612 7.94194 1.40019L2.34222 6.99992L7.94194 12.5996C8.18602 12.8437 8.18602 13.2394 7.94194 13.4835C7.69786 13.7276 7.30214 13.7276 7.05806 13.4835L1.01639 7.44186C0.772315 7.19778 0.772315 6.80205 1.01639 6.55798L7.05806 0.51631C7.30214 0.272233 7.69786 0.272233 7.94194 0.51631Z" fill="#212226"/>
  </svg>
  
      </Link>
      <div className="title">
        Checkout
      </div>
    </div>
    <h3 className="medium-title mb-16">
      Select Pickup Date & Time
    </h3>
    <div className="date-selection">
      <div className="left">
        <button className="action">
        <img src={Calendar} alt="" />
      </button>
      <div className="data">
        <div className="title">
          Select Pickup Date & Time
        </div>
        <div className="date">
          Date , Time
        </div>
      </div>
      </div>
      <button className="action">
        <img src={Edit} alt="" />
      </button>
    </div>
    <h4 className="medium-title mb-12">
      Pickup Address
    </h4>
    <p className="body-text-med mb-20">
      120 Lane San Fransisco , East Falmouth MA
    </p>
    <div className="map-container">
      <img src={Map} alt="" />
    </div>
    <div className="hr mb-18"></div>
    <button className="add-address mb-20">
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3 9H15M9 15V9L9 3" stroke="#3FC045" stroke-width="1.5" stroke-linecap="round"/>
</svg>
  Add New Address
    </button>
    <div className="payment-method mb-20">
      <h5 className="medium-title mb-20">
Payment Method
      </h5>
    <div className="hr mb-20"></div>
    <div className="other-payment-fee">
      <div className="left">
        <div className="icon">
          $
        </div>
        <span>
          Other Pyaments (No Fee)
        </span>
      </div>
     <input
        type="radio"
        className="input"
        checked={isChecked}
        onChange={() => setIsChecked(true)}
      />
    </div>
    </div>
    {isChecked && (
        <div className="other-payments-wrapper mb-20">
 <h2 className="title">
  Other Payments acceptable to James Kitchen Kitchen
 </h2>
 <div className="item-flex">
 <div className="left">
   <div className="text">
    PayPal to
  </div>
  <a className="email">
    jamesPayPal00@gmail.com
  </a>
 </div>
 <div className="copy">
<Copy />  Copy
 </div>
 </div>
  <div className="item-flex">
 <div className="left">
   <div className="text">
    Venmo to
  </div>
  <a className="email">
    jamesVenmo00@gmail.com
  </a>
 </div>
 <div className="copy">
<Copy />  Copy
 </div>
 </div>
    </div>
      )}
      <div className="payment-method mb-20">
      <h5 className="medium-title mb-20">
Payment Details
      </h5>
    <div className="hr mb-20"></div>
     <div className="item-flex">
      <span>
        Sales Tax (7.25%)
      </span>
      <span>$6.00</span>
     </div>
      <div className="item-flex">
      <span>
       Service Fee (10%)
      </span>
      <span>$6.00</span>
     </div>
      <div className="item-flex">
      <span>
     Grand Subtotal
      </span>
      <span>$6.00</span>
     </div>
      <div className="item-flex">
      <span>
    Service Fee
      </span>
      <span>$1.00</span>
     </div>
     <div className="hr mb-12">

     </div>
      <div className="item-flex bold">
      <span>
  Total Payment
      </span>
      <span>$19.00</span>
     </div>
    </div>
    </div>
    <button className="action-button">
     Place My Order
    </button>
  </div>
        </div>
        
      </div>
  );
}
