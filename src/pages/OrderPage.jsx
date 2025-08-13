import React from "react";
import Order1 from '../assets/images/order1.png'
import Order2 from '../assets/images/order2.png'
import { Link } from "react-router-dom";
export default function OrderPage() {
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
      Order
    </div>
  </div>
  <div className="orders-top">
    <div className="text">
      3 Item in the Cart
    </div>
    <div className="action">
      Remove all
    </div>
  </div>
  <div className="order-item">
    <div className="left">
      <div className="image">
        <img src={Order1} alt="Order image" />
      </div>
      <div className="data">
        <div className="title">
          Dim Sum (Dumplings)
        </div>
        <div className="cusine">
          Chinese
        </div>
        <div className="price">
          $18.2
        </div>
      </div>
    </div>
    <div className="counter">
      <div className="action dec">
        <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.33325 1H10.6666" stroke="#3FC045" stroke-width="0.875" stroke-linecap="round"/>
</svg>

      </div>
      <div className="count">
        1
      </div>
       <div className="action inc">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.33325 6.00016H10.6666M5.99992 10.6668V6.00016L5.99992 1.3335" stroke="white" stroke-width="0.875" stroke-linecap="round"/>
</svg>


      </div>
    </div>
  </div>
   <div className="order-item">
    <div className="left">
      <div className="image">
        <img src={Order2} alt="Order image" />
      </div>
      <div className="data">
        <div className="title">
          Margherita Pizza
        </div>
        <div className="cusine">
          Chinese
        </div>
        <div className="price">
         $10.21
        </div>
      </div>
    </div>
    <div className="counter">
      <div className="action dec">
        <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.33325 1H10.6666" stroke="#3FC045" stroke-width="0.875" stroke-linecap="round"/>
</svg>

      </div>
      <div className="count">
        2
      </div>
       <div className="action inc">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.33325 6.00016H10.6666M5.99992 10.6668V6.00016L5.99992 1.3335" stroke="white" stroke-width="0.875" stroke-linecap="round"/>
</svg>


      </div>
    </div>
  </div>
  </div>
  <button className="action-button">
    Continue
  </button>
</div>
      </div>
      
    </div>
  );
}
