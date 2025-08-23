// WeChat Mobile Integration Utilities
export const WECHAT_MOBILE_CONFIG = {
  // WeChat app schemes for different platforms
  IOS_SCHEME: "weixin://",
  ANDROID_SCHEME: "weixin://",

  // App Store and Play Store URLs for WeChat
  IOS_STORE_URL: "https://apps.apple.com/app/wechat/id414478124",
  ANDROID_STORE_URL:
    "https://play.google.com/store/apps/details?id=com.tencent.mm",

  // WeChat Universal Links (requires domain verification with WeChat)
  UNIVERSAL_LINK_PREFIX: "https://open.weixin.qq.com/connect/oauth2/authorize",
};

// Detect platform
export const getPlatform = () => {
  const userAgent = navigator.userAgent.toLowerCase();

  if (/iphone|ipad|ipod/.test(userAgent)) {
    return "ios";
  } else if (/android/.test(userAgent)) {
    return "android";
  } else {
    return "desktop";
  }
};

// Check if WeChat app is likely installed
export const checkWeChatInstalled = async () => {
  return new Promise((resolve) => {
    const platform = getPlatform();

    if (platform === "desktop") {
      resolve(false);
      return;
    }

    // Try to open WeChat scheme and detect response
    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = WECHAT_MOBILE_CONFIG.IOS_SCHEME;

    document.body.appendChild(iframe);

    let timeout;

    const cleanup = () => {
      clearTimeout(timeout);
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
      document.removeEventListener("visibilitychange", visibilityHandler);
    };

    const visibilityHandler = () => {
      if (document.visibilityState === "hidden") {
        cleanup();
        resolve(true); // App opened
      }
    };

    document.addEventListener("visibilitychange", visibilityHandler);

    // If app doesn't open in 1.5 seconds, assume not installed
    timeout = setTimeout(() => {
      cleanup();
      resolve(false);
    }, 1500);
  });
};

// Get appropriate store URL for installing WeChat
export const getWeChatStoreUrl = () => {
  const platform = getPlatform();

  switch (platform) {
    case "ios":
      return WECHAT_MOBILE_CONFIG.IOS_STORE_URL;
    case "android":
      return WECHAT_MOBILE_CONFIG.ANDROID_STORE_URL;
    default:
      return null;
  }
};

// Enhanced mobile WeChat opening strategy
export const openWeChatMobile = async (authUrl) => {
  const platform = getPlatform();

  if (platform === "desktop") {
    // Desktop - just redirect
    window.location.href = authUrl;
    return { success: true, method: "desktop_redirect" };
  }

  console.log(`📱 Attempting WeChat mobile integration on ${platform}`);

  try {
    // Check if WeChat is installed
    const isInstalled = await checkWeChatInstalled();
    console.log(`WeChat installed: ${isInstalled}`);

    if (isInstalled) {
      // Try to open WeChat app
      window.location.href = authUrl;
      return { success: true, method: "app_redirect" };
    } else {
      // WeChat not installed - offer options
      const storeUrl = getWeChatStoreUrl();
      const message = `WeChat app is not installed. You can:
      
1. Install WeChat and try again
2. Continue with web authentication (limited features)`;

      if (confirm(message)) {
        if (storeUrl && confirm("Install WeChat from app store?")) {
          window.open(storeUrl, "_blank");
          return { success: false, method: "store_redirect" };
        } else {
          // Fallback to web
          window.location.href = authUrl;
          return { success: true, method: "web_fallback" };
        }
      }

      return { success: false, method: "user_cancelled" };
    }
  } catch (error) {
    console.error("WeChat mobile integration error:", error);

    // Final fallback
    if (confirm("Unable to open WeChat app. Try web authentication?")) {
      window.location.href = authUrl;
      return { success: true, method: "error_fallback" };
    }

    return { success: false, method: "error", error };
  }
};
