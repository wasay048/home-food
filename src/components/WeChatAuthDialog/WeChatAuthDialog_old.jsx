import React from "react";
import { generateWeChatAuthUrl, isMobileDevice, isWeChatBrowser } from "../../config/wechat";
import { openWeChatMobile } from "../../utils/wechatMobile";
import wechatIcon from "../../assets/wechat-icon.svg";
import "./WeChatAuthDialog.css";

const WeChatAuthDialog = ({ onClose }) => {
  console.log("🚀 WeChatAuthDialog rendered!");

  const handleWeChatAuth = () => {
    try {
      const isMobile = isMobileDevice();
      const isWeChat = isWeChatBrowser();

      console.log("� Auth context:", { isMobile, isWeChat });

      // Store pending action
      sessionStorage.setItem("wechat_pending_cart_action", "true");

      if (isWeChat) {
        // Already in WeChat browser - use simple OAuth
        console.log("📱 WeChat browser detected - using in-app OAuth");
        const authUrl = generateWeChatAuthUrl();
        window.location.href = authUrl;
        
      } else if (isMobile) {
        // Mobile browser - try multiple approaches
        console.log("📱 Mobile browser detected - attempting app opening strategies");
        
        const wechatAppScheme = "weixin://";
        const authUrl = generateWeChatAuthUrl();
        
        // Strategy 1: Try WeChat app scheme first
        const appLink = document.createElement('a');
        appLink.href = wechatAppScheme;
        appLink.style.display = 'none';
        document.body.appendChild(appLink);
        
        // Check if app opened (iOS method)
        const startTime = Date.now();
        
        const handleVisibilityChange = () => {
          if (document.visibilityState === 'hidden') {
            console.log("🎉 WeChat app likely opened successfully");
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.body.removeChild(appLink);
          }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Try to open app
        appLink.click();
        
        // Strategy 2: Fallback to web OAuth after delay
        setTimeout(() => {
          if (Date.now() - startTime < 2500) {
            console.log("🌐 App didn't open - falling back to web OAuth");
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (document.body.contains(appLink)) {
              document.body.removeChild(appLink);
            }
            
            // Show user choice
            if (confirm("WeChat app not detected. Open in browser instead?")) {
              window.location.href = authUrl;
            }
          }
        }, 2000);
        
      } else {
        // Desktop - use standard OAuth
        console.log("🖥️ Desktop detected - using web OAuth");
        const authUrl = generateWeChatAuthUrl();
        window.location.href = authUrl;
      }
      
    } catch (error) {
      console.error("❌ Error initiating WeChat OAuth:", error);
      
      // Fallback: try standard OAuth
      const authUrl = generateWeChatAuthUrl();
      if (confirm("Unable to open WeChat app. Try web authentication?")) {
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
              : "We'll redirect you to WeChat for secure authentication"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeChatAuthDialog;
