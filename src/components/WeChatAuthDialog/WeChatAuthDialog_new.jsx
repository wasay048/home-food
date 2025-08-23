import React from "react";
import {
  generateWeChatAuthUrl,
  isMobileDevice,
  isWeChatBrowser,
} from "../../config/wechat";
import { openWeChatMobile } from "../../utils/wechatMobile";
import wechatIcon from "../../assets/wechat-icon.svg";
import "./WeChatAuthDialog.css";

const WeChatAuthDialog = ({ onClose }) => {
  console.log("🚀 WeChatAuthDialog rendered!");

  const handleWeChatAuth = async () => {
    try {
      const isMobile = isMobileDevice();
      const isWeChat = isWeChatBrowser();

      console.log("🔍 Auth context:", { isMobile, isWeChat });

      // Store pending action
      sessionStorage.setItem("wechat_pending_cart_action", "true");

      // Generate auth URL
      const authUrl = generateWeChatAuthUrl();
      console.log("🔗 Generated auth URL:", authUrl);

      if (isWeChat) {
        // Already in WeChat browser - direct redirect
        console.log("📱 WeChat browser detected - direct redirect");
        window.location.href = authUrl;
      } else {
        // Use enhanced mobile integration
        console.log("🚀 Using enhanced mobile WeChat integration");
        const result = await openWeChatMobile(authUrl);
        console.log("📊 Mobile integration result:", result);

        if (!result.success) {
          console.warn("❌ Mobile integration failed:", result);
        }
      }
    } catch (error) {
      console.error("❌ Error in WeChat authentication:", error);

      // Final fallback
      const authUrl = generateWeChatAuthUrl();
      if (confirm("Authentication error. Try web version?")) {
        window.location.href = authUrl;
      }
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
            {isMobileDevice() && !isWeChatBrowser()
              ? "This will open WeChat app for secure authentication"
              : "We'll redirect you to WeChat for secure authentication"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeChatAuthDialog;
