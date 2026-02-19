import { isWeChatBrowser } from "../config/wechat";

// Firebase project ID for constructing the Cloud Function URL
const FIREBASE_PROJECT_ID = "homefoods-16e56";
const FIREBASE_REGION = "us-central1";

/**
 * Build the share URL for the food detail page.
 *
 * - Inside WeChat or for general social sharing, routes through the
 *   `ogMetaProxy` Cloud Function so crawlers receive proper OG meta tags.
 * - For direct browser use, returns the regular SPA URL.
 *
 * @param {Object} params
 * @param {string} params.kitchenId
 * @param {string} params.foodId
 * @param {string} [params.date]
 * @param {string} [params.toggle]
 * @param {boolean} [params.forceProxy] - Always use the proxy URL (for copy-to-clipboard, native share)
 * @returns {string} The share URL
 */
export function buildShareUrl({ kitchenId, foodId, date, toggle, forceProxy = false }) {
  const queryParams = new URLSearchParams({ kitchenId, foodId });
  if (date) queryParams.set("date", date);
  if (toggle) queryParams.set("toggle", toggle);

  // Use the Cloud Function proxy URL for crawlers
  if (forceProxy || isWeChatBrowser()) {
    return `https://${FIREBASE_REGION}-${FIREBASE_PROJECT_ID}.cloudfunctions.net/ogMetaProxy?${queryParams.toString()}`;
  }

  // Regular SPA URL
  return `${window.location.origin}/share?${queryParams.toString()}`;
}

/**
 * Share via the Web Share API (native share sheet on mobile).
 * Falls back to copying the URL to the clipboard.
 *
 * @param {Object} params
 * @param {string} params.title    - Share title
 * @param {string} params.text     - Share description
 * @param {string} params.url      - The URL to share (should be from buildShareUrl with forceProxy=true)
 * @returns {Promise<boolean>} Whether the share was successful
 */
export async function shareFood({ title, text, url }) {
  // Always use the proxy URL for sharing
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return true;
    } catch (err) {
      if (err.name === "AbortError") return false; // User cancelled
      console.warn("Web Share API failed, falling back to clipboard:", err);
    }
  }

  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch (err) {
    console.error("Failed to copy to clipboard:", err);
    return false;
  }
}
