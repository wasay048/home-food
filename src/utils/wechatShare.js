import { isWeChatBrowser, WECHAT_CONFIG } from "../config/wechat";
import { buildShareUrl } from "./shareUrl";

const FIREBASE_PROJECT_ID = "homefoods-16e56";
const FIREBASE_REGION = "us-central1";
const FUNCTION_BASE = `https://${FIREBASE_REGION}-${FIREBASE_PROJECT_ID}.cloudfunctions.net`;
const JSSDK_ENDPOINT = `${FUNCTION_BASE}/wechatJssdkSignature`;

// Track whether the JSSDK script has been loaded
let jssdkLoaded = false;
let jssdkLoading = false;

/**
 * Load the WeChat JS-SDK script dynamically.
 */
function loadJssdkScript() {
  return new Promise((resolve, reject) => {
    if (jssdkLoaded) {
      resolve();
      return;
    }
    if (jssdkLoading) {
      // Wait for the ongoing load
      const interval = setInterval(() => {
        if (jssdkLoaded) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
      return;
    }

    jssdkLoading = true;
    const script = document.createElement("script");
    script.src = "https://res.wx.qq.com/open/js/jweixin-1.6.0.js";
    script.onload = () => {
      jssdkLoaded = true;
      jssdkLoading = false;
      resolve();
    };
    script.onerror = (err) => {
      jssdkLoading = false;
      reject(new Error("Failed to load WeChat JS-SDK script"));
    };
    document.head.appendChild(script);
  });
}

/**
 * Configure WeChat JS-SDK share data for the current page.
 *
 * This sets up the "Send to Friend" and "Share to Moments" actions
 * within WeChat's in-app browser with custom title, description, image, and link.
 *
 * @param {Object} params
 * @param {string} params.title       - Share title (e.g., "Kung Pao Chicken from Coco's Kitchen")
 * @param {string} params.description - Share description
 * @param {string} params.imageUrl    - Image URL for the share card
 * @param {string} params.kitchenId   - Kitchen ID for building the share link
 * @param {string} params.foodId      - Food ID for building the share link
 * @param {string} [params.date]      - Optional date parameter
 * @param {string} [params.toggle]    - Optional toggle parameter
 */
export async function configureWeChatShare({
  title,
  description,
  imageUrl,
  kitchenId,
  foodId,
  date,
  toggle,
}) {
  // Only run inside WeChat browser
  if (!isWeChatBrowser()) {
    console.log("[WeChatShare] Not in WeChat browser, skipping JSSDK config");
    return;
  }

  try {
    // 1) Load the JS-SDK script
    await loadJssdkScript();

    // 2) Get the signature from our backend
    const currentUrl = window.location.href.split("#")[0]; // WeChat requires URL without hash
    const sigRes = await fetch(
      `${JSSDK_ENDPOINT}?url=${encodeURIComponent(currentUrl)}`
    );

    if (!sigRes.ok) {
      console.error("[WeChatShare] Failed to get JSSDK signature:", sigRes.status);
      return;
    }

    const sigData = await sigRes.json();

    // 3) Configure wx.config
    /* global wx */
    wx.config({
      debug: false,
      appId: sigData.appId,
      timestamp: sigData.timestamp,
      nonceStr: sigData.nonceStr,
      signature: sigData.signature,
      jsApiList: [
        "updateAppMessageShareData",
        "updateTimelineShareData",
      ],
    });

    // 4) Build the share link (goes through ogMetaProxy for rich previews)
    const shareLink = buildShareUrl({
      kitchenId,
      foodId,
      date,
      toggle,
      forceProxy: true, // Always use proxy for sharing
    });

    // 5) Set share data once wx.config is ready
    wx.ready(() => {
      console.log("[WeChatShare] JSSDK ready, configuring share data");

      // Use ogFoodImage proxy for the image (Firebase Storage blocked in China)
      const proxiedImgUrl = kitchenId && foodId
        ? `${FUNCTION_BASE}/ogFoodImage?kitchenId=${kitchenId}&foodId=${foodId}`
        : imageUrl || "https://www.homefreshfoods.ai/favicon.svg";

      // "Send to Friend" / "Forward"
      wx.updateAppMessageShareData({
        title: title || "Home Fresh",
        desc: description || "Check out on HomeFresh",
        link: shareLink,
        imgUrl: proxiedImgUrl,
        success: () => {
          console.log("[WeChatShare] updateAppMessageShareData configured");
        },
      });

      // "Share to Moments" (Timeline)
      wx.updateTimelineShareData({
        title: title || "Home Fresh",
        link: shareLink,
        imgUrl: proxiedImgUrl,
        success: () => {
          console.log("[WeChatShare] updateTimelineShareData configured");
        },
      });
    });

    wx.error((res) => {
      console.error("[WeChatShare] JSSDK config error:", res);
    });
  } catch (err) {
    console.error("[WeChatShare] Failed to configure WeChat share:", err);
    // Non-fatal — the page still works, just without custom share data
  }
}
