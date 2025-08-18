import React from "react";
import Menu1 from '../assets/images/order1.png'
import Menu2 from '../assets/images/order2.png'
import { Link } from "react-router-dom";
import { useState } from "react";
import Edit from '../assets/images/edit.svg'
export default function ListingPage() {
   const [count, setCount] = useState(1);

  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => (c > 1 ? c - 1 : 1));
  return (
      <div className="container">
        <div className="mobile-container">
  <div className="padding-20">
     <div className="back-link-title">
      <Link className="back-link">
      <svg width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M7.94194 0.51631C8.18602 0.760388 8.18602 1.15612 7.94194 1.40019L2.34222 6.99992L7.94194 12.5996C8.18602 12.8437 8.18602 13.2394 7.94194 13.4835C7.69786 13.7276 7.30214 13.7276 7.05806 13.4835L1.01639 7.44186C0.772315 7.19778 0.772315 6.80205 1.01639 6.55798L7.05806 0.51631C7.30214 0.272233 7.69786 0.272233 7.94194 0.51631Z" fill="#212226"/>
  </svg>
  
      </Link>
      <div className="title">
        More offers from HomeFresh
      </div>
    </div>
    <h2 className="small-title mb-2">
      Coco's Kitchen
    </h2>
    <h2 className="small-title mb-20">
      Grab & Go
    </h2>
    <div className="menu-listing">
      <div className="menu-list">
           <div className="left">
            <div className="image">
              <img src={Menu1} alt="" />
            </div>
            <div className="data">
              <div className="title">
                Dim Sum (Dumplings) 
              </div>
              <div className="text">
This dish features tender, juicy chicken in aromatic herbs 
              </div>
              <div className="price">
                $ 22.45
              </div>
            </div>
           </div>
           
            <div className="quantity-warpper">
         
          <div className="right mb-1">
            <div className="count">{count}</div>
            <div className="counter">
              <div className="button" onClick={decrement}>
                <svg width="13" height="2" viewBox="0 0 13 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.887695" width="11.6854" height="1.46067" fill="white"/>
                </svg>
              </div>
              <div className="button dark" onClick={increment}>
                <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.707673 5.27007H12.3931V6.73075H0.707673V5.27007Z" fill="white"/>
                  <path d="M7.28071 0.157715L7.28071 11.8431H5.82003L5.82003 0.157715L7.28071 0.157715Z" fill="white"/>
                </svg>
              </div>
            </div>
          </div>
          <div className="title">
            Pick up today
          </div>
          <div className="bottom">
            <div className="time">6:22 PM</div>
            <div className="icon">
              <img src={Edit} alt="" />
            </div>
          </div>
        </div>
           
      </div>
      <div className="menu-list">
           <div className="left">
            <div className="image">
              <img src={Menu2} alt="" />
            </div>
            <div className="data">
              <div className="title">
                Margherita Pizza
              </div>
              <div className="text">
This dish features tender, juicy chicken in aromatic herbs spices,...
              </div>
              <div className="price">
                $ 12.45
              </div>
            </div>
           </div>
           
            <div className="quantity-warpper">
         
          <div className="right mb-1">
            <div className="count">{count}</div>
            <div className="counter">
              <div className="button" onClick={decrement}>
                <svg width="13" height="2" viewBox="0 0 13 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.887695" width="11.6854" height="1.46067" fill="white"/>
                </svg>
              </div>
              <div className="button dark" onClick={increment}>
                <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.707673 5.27007H12.3931V6.73075H0.707673V5.27007Z" fill="white"/>
                  <path d="M7.28071 0.157715L7.28071 11.8431H5.82003L5.82003 0.157715L7.28071 0.157715Z" fill="white"/>
                </svg>
              </div>
            </div>
          </div>
          <div className="title">
            Pick up today
          </div>
          <div className="bottom">
            <div className="time">6:22 PM</div>
            <div className="icon">
              <img src={Edit} alt="" />
            </div>
          </div>
        </div>
           
      </div>
       <h2 className="small-title mb-16">
     Pre-order for  Aug. 8 Fri
    </h2>
    <div className="menu-list">
           <div className="left">
            <div className="image">
              <img src={Menu1} alt="" />
            </div>
            <div className="data">
              <div className="title">
                Dim Sum (Dumplings) 
              </div>
              <div className="text">
This dish features tender, juicy chicken in aromatic herbs 
              </div>
              <div className="price">
                $ 22.45
              </div>
            </div>
           </div>
           
            <div className="quantity-warpper">
         
          <div className="right mb-1">
            <div className="count">{count}</div>
            <div className="counter">
              <div className="button" onClick={decrement}>
                <svg width="13" height="2" viewBox="0 0 13 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.887695" width="11.6854" height="1.46067" fill="white"/>
                </svg>
              </div>
              <div className="button dark" onClick={increment}>
                <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.707673 5.27007H12.3931V6.73075H0.707673V5.27007Z" fill="white"/>
                  <path d="M7.28071 0.157715L7.28071 11.8431H5.82003L5.82003 0.157715L7.28071 0.157715Z" fill="white"/>
                </svg>
              </div>
            </div>
          </div>
          <div className="title">
            Pick up today
          </div>
          <div className="bottom">
            <div className="time">6:22 PM</div>
            <div className="icon">
              <img src={Edit} alt="" />
            </div>
          </div>
        </div>
           
      </div>
      <div className="menu-list">
           <div className="left">
            <div className="image">
              <img src={Menu2} alt="" />
            </div>
            <div className="data">
              <div className="title">
                Margherita Pizza
              </div>
              <div className="text">
This dish features tender, juicy chicken in aromatic herbs spices,...
              </div>
              <div className="price">
                $ 12.45
              </div>
            </div>
           </div>
           
            <div className="quantity-warpper">
         
          <div className="right mb-1">
            <div className="count">{count}</div>
            <div className="counter">
              <div className="button" onClick={decrement}>
                <svg width="13" height="2" viewBox="0 0 13 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.887695" width="11.6854" height="1.46067" fill="white"/>
                </svg>
              </div>
              <div className="button dark" onClick={increment}>
                <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.707673 5.27007H12.3931V6.73075H0.707673V5.27007Z" fill="white"/>
                  <path d="M7.28071 0.157715L7.28071 11.8431H5.82003L5.82003 0.157715L7.28071 0.157715Z" fill="white"/>
                </svg>
              </div>
            </div>
          </div>
          <div className="title">
            Pick up today
          </div>
          <div className="bottom">
            <div className="time">6:22 PM</div>
            <div className="icon">
              <img src={Edit} alt="" />
            </div>
          </div>
        </div>
           
      </div>
    </div>
    <button className="action-button mb-16">
      Continue to View Cart
    </button>
    <div className="scanner-bottom mb-16">
      <div className="text">
        Full menus from your local home kitchens can be found in the HomeFresh app, available in the iOS App Store.
      </div>
      <div className="qr">
        {/* Dummy QR code SVG */}
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="80" height="80" rx="12" fill="#F7F7FA"/>
          <rect x="10" y="10" width="18" height="18" rx="3" fill="#191A26"/>
          <rect x="52" y="10" width="18" height="18" rx="3" fill="#191A26"/>
          <rect x="10" y="52" width="18" height="18" rx="3" fill="#191A26"/>
          <rect x="52" y="52" width="18" height="18" rx="3" fill="#191A26"/>
          <rect x="32" y="32" width="16" height="16" rx="2" fill="#191A26"/>
          <rect x="20" y="20" width="4" height="4" fill="#3FC045"/>
          <rect x="56" y="20" width="4" height="4" fill="#3FC045"/>
          <rect x="20" y="56" width="4" height="4" fill="#3FC045"/>
          <rect x="56" y="56" width="4" height="4" fill="#3FC045"/>
        </svg>
      </div>
    </div>
    </div>
    </div>
      
    </div>
  );
}
