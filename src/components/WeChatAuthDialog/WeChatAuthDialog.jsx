import React from "react";
import { generateWeChatAuthUrl } from "../../config/wechat";
import wechatIcon from "../../assets/wechat-icon.svg";
import "./WeChatAuthDialog.css";

const WeChatAuthDialog = ({ onClose }) => {
  console.log("🚀 WeChatAuthDialog rendered!");

  const handleWeChatAuth = () => {
    try {
      // Generate WeChat auth URL and redirect
      const authUrl = generateWeChatAuthUrl();
      console.log("Redirecting to WeChat OAuth:", authUrl);

      // Store the fact that user is trying to add to cart
      // so we can complete the action after auth
      sessionStorage.setItem("wechat_pending_cart_action", "true");

      // Redirect to WeChat OAuth
      window.location.href = authUrl;
    } catch (error) {
      console.error("Error initiating WeChat OAuth:", error);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="wechat-auth-dialog-overlay" onClick={handleBackdropClick}>
      <div className="wechat-auth-dialog">
        <div className="wechat-auth-header">
          <h3>Sign in to Continue</h3>
          <button
            className="wechat-auth-close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>

        <div className="wechat-auth-content">
          <div className="wechat-auth-icon">
            <img src={wechatIcon} alt="WeChat" />
          </div>

          <p className="wechat-auth-message">
            Please sign in with WeChat to add items to your cart
          </p>

          <button className="wechat-auth-button" onClick={handleWeChatAuth}>
            <img src={wechatIcon} alt="WeChat" />
            Continue with WeChat
          </button>

          <p className="wechat-auth-note">
            We&apos;ll redirect you to WeChat for secure authentication
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeChatAuthDialog;
