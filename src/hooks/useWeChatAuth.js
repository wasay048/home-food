import { useSelector } from "react-redux";
import {
  generateWeChatAuthUrlWeb,
  generateWeChatAuthUrlMobile,
  isMobileDevice,
  isWeChatBrowser,
} from "../config/wechat";

/**
 * Encode a redirect target into the WeChat OAuth `state` parameter.
 *
 * The checkout flow (legacy) passes a plain Firebase Storage URL as `state`.
 * For all other pages we pass a base64-encoded JSON object so the callback
 * page knows where to send the user after a successful code exchange.
 *
 * Format: btoa(JSON.stringify({ redirectTo: "/my-orders" }))
 */
export const encodeStateForRedirect = (redirectTo) => {
  return btoa(JSON.stringify({ redirectTo }));
};

/**
 * useWeChatAuth
 *
 * Generic hook that:
 *   1. Reads the authenticated user from Redux (state.auth.user).
 *   2. Exposes `isAuthenticated` and `currentUser`.
 *   3. Provides `triggerWeChatAuth(redirectTo)` — starts the WeChat OAuth
 *      flow and, after the code exchange, redirects the user back to the
 *      given path instead of the checkout page.
 *
 * Usage:
 *   const { isAuthenticated, currentUser, triggerWeChatAuth } = useWeChatAuth();
 *
 *   // In a component's auth-gate check:
 *   if (!isAuthenticated) {
 *     triggerWeChatAuth("/my-orders");
 *     return <LoadingScreen />;
 *   }
 */
const useWeChatAuth = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const isAuthenticated = !!(currentUser && currentUser.id);

  /**
   * Redirect the browser to WeChat OAuth.
   * After the code exchange the callback page will navigate to `redirectTo`.
   *
   * @param {string} redirectTo  App path to return to, e.g. "/my-orders"
   */
  const triggerWeChatAuth = (redirectTo) => {
    const encodedState = encodeStateForRedirect(redirectTo);

    // generateWeChatAuthUrlWeb / Mobile accept a `state` string as their
    // first argument — they pass it verbatim to WeChat.
    const isMobile = isMobileDevice();
    const isWeChat = isWeChatBrowser();

    let authUrl;
    if (isWeChat || isMobile) {
      authUrl = generateWeChatAuthUrlMobile(encodedState);
    } else {
      authUrl = generateWeChatAuthUrlWeb(encodedState);
    }

    window.location.href = authUrl;
  };

  return { isAuthenticated, currentUser, triggerWeChatAuth };
};

export default useWeChatAuth;
