import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLogout } from "../hooks/useLogout";
import WeChatDebugPanel from "../components/WeChatDebugPanel";
import "./LandingPage.css";

export default function LandingPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [animatedText, setAnimatedText] = useState("");
  const fullText = "Enjoy delicious meal from your favorite chef.";
  console.log("Deployed Version 35");
  // Redux state for debugging persistence
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);
  const { logout } = useLogout();

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Typewriter effect for subtitle
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setAnimatedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: true,
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="landing-page">
      {/* Background Animation */}
      <div className="background-animation">
        <div className="floating-food food-1">🥘</div>
        <div className="floating-food food-2">🍜</div>
        <div className="floating-food food-3">🥗</div>
        <div className="floating-food food-4">🍲</div>
        <div className="floating-food food-5">🥙</div>
        <div className="floating-food food-6">🍱</div>
      </div>

      {/* Main Content */}
      <div className="landing-content">
        <div className="logo-section">
          <div className="logo-circle">
            <span className="logo-icon">🏠</span>
          </div>
          <h1 className="brand-name">
            Home<span className="accent-text">Fresh</span>
          </h1>
        </div>

        <div className="coming-soon-section">
          <h2 className="coming-soon-title">
            Welcome to <span className="gradient-text">HomeFresh!</span>
          </h2>

          <p className="subtitle">
            {animatedText}
            <span className="cursor">|</span>
          </p>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">👨‍🍳</div>
              <h3>Home Chefs</h3>
              <p>Local talented chefs cooking with love</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Fresh Experience</h3>
              <p>Fast and reliable taste you can trust</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💝</div>
              <h3>Made with Love</h3>
              <p>Every meal crafted with care and passion</p>
            </div>
          </div>

          {/* Live Clock */}
          <div className="live-clock">
            <span className="clock-icon">⏰</span>
            <span className="time-display">{formatTime(currentTime)}</span>
          </div>

          {/* CTA Section */}
          <div className="cta-section">
            <p className="launch-text">
              We&apos;re putting the finishing touches on something special!
            </p>
            <Link to="/foods" className="explore-btn">
              <span>Explore Preview</span>
              <div className="btn-arrow">→</div>
            </Link>
          </div>

          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-label">Launch Progress</div>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
            <div className="progress-text">95% Complete</div>
          </div>
        </div>

        {/* Footer */}
        <footer className="landing-footer">
          <p>Get ready for a culinary revolution 🌟</p>

          {/* Debug Panel for Testing Persistence */}
          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "rgba(0,0,0,0.1)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
          >
            <h4>🔧 Debug Panel (Persistence Test)</h4>
            <p>
              <strong>User:</strong>{" "}
              {isAuthenticated
                ? user?.name || "Authenticated"
                : "Not logged in"}
            </p>
            <p>
              <strong>Cart Items:</strong> {totalItems} items
            </p>
            <div style={{ marginTop: "10px" }}>
              <button
                onClick={logout}
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#ff4444",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
              >
                🚪 Test Logout (Clear All Data)
              </button>
              <Link
                to="/foods"
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#44ff44",
                  color: "white",
                  textDecoration: "none",
                  borderRadius: "4px",
                }}
              >
                🛒 Go to Foods (Test Cart)
              </Link>
            </div>
          </div>
        </footer>
      </div>
      <WeChatDebugPanel />
    </div>
  );
}
