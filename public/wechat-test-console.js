/**
 * Quick WeChat Domain Test Script
 * Copy and paste this into browser console at homefreshfoods.ai
 */

(async function wechatQuickTest() {
  console.log("🔍 Starting WeChat Domain Quick Test...");

  const results = {
    timestamp: new Date().toISOString(),
    domain: "homefreshfoods.ai",
    appId: "wx4a71fe09bb125182",
    tests: {},
  };

  // Test 1: Domain Access
  try {
    const response = await fetch("https://homefreshfoods.ai/", {
      method: "HEAD",
    });
    results.tests.domainAccess = {
      success: response.ok,
      status: response.status,
      message: response.ok ? "Domain accessible" : `HTTP ${response.status}`,
    };
    console.log("✅ Domain Access:", results.tests.domainAccess);
  } catch (error) {
    results.tests.domainAccess = {
      success: false,
      error: error.message,
      message: "Domain not accessible",
    };
    console.log("❌ Domain Access:", results.tests.domainAccess);
  }

  // Test 2: Verification File
  const verificationFiles = [
    "MP_verify_placeholder.txt",
    "MP_verify_wx4a71fe09bb125182.txt",
  ];

  let verificationFound = false;
  for (const filename of verificationFiles) {
    try {
      const response = await fetch(`https://homefreshfoods.ai/${filename}`);
      if (response.ok) {
        const content = await response.text();
        results.tests.verificationFile = {
          success: true,
          filename: filename,
          content: content.substring(0, 50) + "...",
          message: `Found: ${filename}`,
        };
        verificationFound = true;
        console.log("✅ Verification File:", results.tests.verificationFile);
        break;
      }
    } catch (error) {
      // Continue checking
    }
  }

  if (!verificationFound) {
    results.tests.verificationFile = {
      success: false,
      checkedFiles: verificationFiles,
      message: "No verification file found",
    };
    console.log("❌ Verification File:", results.tests.verificationFile);
  }

  // Test 3: Generate WeChat Auth URL
  const redirectUri = "https://homefreshfoods.ai/wechat/callback";
  const state = `test_${Math.random().toString(36).substring(7)}`;
  const params = new URLSearchParams({
    appid: "wx4a71fe09bb125182",
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "snsapi_base",
    state: state,
  });

  const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?${params.toString()}#wechat_redirect`;
  results.tests.authUrl = {
    success: true,
    url: authUrl,
    state: state,
    message: "WeChat auth URL generated",
  };
  console.log("✅ Auth URL Generated:", results.tests.authUrl);

  // Test 4: QR Code URL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    authUrl
  )}`;
  results.tests.qrCode = {
    success: true,
    url: qrCodeUrl,
    message: "QR code URL generated",
  };
  console.log("✅ QR Code:", results.tests.qrCode);

  // Summary
  const passedTests = Object.values(results.tests).filter(
    (test) => test.success
  ).length;
  const totalTests = Object.keys(results.tests).length;

  console.group("📊 WeChat Test Summary");
  console.log(`Passed: ${passedTests}/${totalTests} tests`);
  console.log("Full Results:", results);

  if (passedTests === totalTests) {
    console.log("🎉 All tests passed! Domain configuration looks good.");
  } else {
    console.log(
      "⚠️ Some tests failed. Check WeChat Developer Console configuration."
    );
  }

  console.log("Next Steps:");
  console.log("1. Verify domain is added to WeChat Developer Console");
  console.log("2. Check verification file is uploaded correctly");
  console.log('3. Ensure domain status is "Verified" in console');
  console.log("4. Test on mobile WeChat using QR code");
  console.groupEnd();

  // Make results available globally
  window.wechatTestResults = results;

  return results;
})();

// Additional helper functions
window.testWeChatAuth = function () {
  const authUrl = window.wechatTestResults?.tests?.authUrl?.url;
  if (authUrl) {
    console.log("🔗 Opening WeChat Auth URL:", authUrl);
    window.open(authUrl, "_blank");
  } else {
    console.log("❌ No auth URL available. Run wechatQuickTest() first.");
  }
};

window.showQRCode = function () {
  const qrUrl = window.wechatTestResults?.tests?.qrCode?.url;
  if (qrUrl) {
    console.log("📱 QR Code URL:", qrUrl);
    const img = document.createElement("img");
    img.src = qrUrl;
    img.style.position = "fixed";
    img.style.top = "50%";
    img.style.left = "50%";
    img.style.transform = "translate(-50%, -50%)";
    img.style.zIndex = "10000";
    img.style.background = "white";
    img.style.padding = "20px";
    img.style.border = "2px solid #ccc";
    img.onclick = () => document.body.removeChild(img);
    document.body.appendChild(img);
  } else {
    console.log("❌ No QR code available. Run wechatQuickTest() first.");
  }
};

console.log("WeChat testing utilities loaded. Available functions:");
console.log("- wechatQuickTest() - Run automated tests");
console.log("- testWeChatAuth() - Open auth URL in new tab");
console.log("- showQRCode() - Display QR code on page");
