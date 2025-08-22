import React from "react";
import { Link } from "react-router-dom";
import Success from '../assets/images/success.svg'
export default function SuccessPage() {
  return (
     <div className="container">
        <div className="mobile-container">
          <div className="padding-20 order-page">
            <div className="back-link-title">
      <Link className="back-link">
      <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M7.94194 0.51631C8.18602 0.760388 8.18602 1.15612 7.94194 1.40019L2.34222 6.99992L7.94194 12.5996C8.18602 12.8437 8.18602 13.2394 7.94194 13.4835C7.69786 13.7276 7.30214 13.7276 7.05806 13.4835L1.01639 7.44186C0.772315 7.19778 0.772315 6.80205 1.01639 6.55798L7.05806 0.51631C7.30214 0.272233 7.69786 0.272233 7.94194 0.51631Z" fill="#212226"/>
  </svg>
  
      </Link>
      <div className="title">
       Payment Success
      </div>
    </div>
           <div className="success-image-wrapper">
             <img src={Success} alt="Success"  />
             <h2 className="title">
              Your order has been <br /> successfully placed
             </h2>
             <p className="text mb-0">
              Your orders is being worked on. It’ll take <br /> 20-30 min to get ready for pick up.
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
