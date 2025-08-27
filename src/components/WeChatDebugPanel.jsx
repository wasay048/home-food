import React, { useEffect } from "react";

const WeChatDebugPanel = () => {
  useEffect(() => {
    const debugInfo = {
      currentUrl: window.location.href,
      hostname: window.location.hostname,
      origin: window.location.origin,
      userAgent: navigator.userAgent,
      isWeChatBrowser: /micromessenger/i.test(navigator.userAgent),
      isMobile:
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ),
      timestamp: new Date().toISOString(),
    };

    console.log("🔍 WeChat Debug Info:", debugInfo);

    // Store debug info in localStorage for troubleshooting
    localStorage.setItem(
      "wechat_debug_info",
      JSON.stringify(debugInfo, null, 2)
    );
  }, []);

  const testWeChatConfig = () => {
    import("../config/wechat.js").then((module) => {
      const { WECHAT_CONFIG, generateWeChatAuthUrl, getRedirectUri } = module;

      console.log("🔧 WeChat Configuration Test:");
      console.log("APP_ID:", WECHAT_CONFIG.APP_ID);
      console.log("Redirect URI:", getRedirectUri());
      console.log("Generated Auth URL:", generateWeChatAuthUrl("debug_test"));

      // Test the actual redirect URI
      const testUri = getRedirectUri();
      console.log(`🧪 Testing redirect URI: ${testUri}`);

      // Check if verification file would be accessible
      const domain = new URL(testUri).origin;
      console.log(
        `🔍 Verification file should be at: ${domain}/MP_verify_xxxxxxxx.txt`
      );
    });
  };

  if (process.env.NODE_ENV !== "development") {
    return null; // Hide in production
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "10px",
        right: "10px",
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        fontSize: "12px",
        zIndex: 9999,
        maxWidth: "300px",
      }}
    >
      <div style={{ marginBottom: "5px" }}>
        <strong>WeChat Debug Panel</strong>
      </div>
      <div>URL: {window.location.hostname}</div>
      <div>
        WeChat Browser:{" "}
        {/micromessenger/i.test(navigator.userAgent) ? "Yes" : "No"}
      </div>
      <div>
        Mobile:{" "}
        {/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
          ? "Yes"
          : "No"}
      </div>
      <button
        onClick={testWeChatConfig}
        style={{
          marginTop: "5px",
          padding: "5px 10px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "3px",
          cursor: "pointer",
        }}
      >
        Test Config
      </button>
    </div>
  );
};

export default WeChatDebugPanel;
