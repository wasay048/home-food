import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setWeChatUser } from "../store/slices/authSlice";
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
 * Read the WeChat user synchronously from localStorage.
 * This is the single source of truth for auth state — it avoids all Redux
 * rehydration timing issues because localStorage is always available before
 * any React render.
 */
const readWeChatUserFromStorage = () => {
  try {
    const raw = localStorage.getItem("wechat_user");
    if (!raw) return null;
    const user = JSON.parse(raw);
    // Must have an id to be considered a valid session
    return user && user.id ? user : null;
  } catch {
    return null;
  }
};

/**
 * useWeChatAuth
 *
 * Single-source-of-truth auth hook for all pages.
 *
 * - Reads from localStorage["wechat_user"] synchronously on mount so there
 *   is zero flickering regardless of Redux Persist / Firebase rehydration timing.
 * - Listens to the "wechat_auth_updated" custom event so that after
 *   WeChatCallbackPage writes the user and dispatches to Redux, every mounted
 *   component using this hook re-renders immediately without a page reload.
 * - Also dispatches to Redux for any components/selectors that still use
 *   state.auth.user directly.
 */
const useWeChatAuth = () => {
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState(() => readWeChatUserFromStorage());

  useEffect(() => {
    // If we found a user in localStorage on mount, make sure Redux is in sync.
    const stored = readWeChatUserFromStorage();
    if (stored) {
      dispatch(setWeChatUser(stored));
    }

    // Listen for auth updates emitted by WeChatCallbackPage after a successful
    // code exchange — this updates all mounted hooks instantly.
    const onAuthUpdated = () => {
      const user = readWeChatUserFromStorage();
      setCurrentUser(user);
      if (user) dispatch(setWeChatUser(user));
    };

    window.addEventListener("wechat_auth_updated", onAuthUpdated);
    return () => window.removeEventListener("wechat_auth_updated", onAuthUpdated);
  }, [dispatch]);

  const isAuthenticated = !!(currentUser && currentUser.id);

  /**
   * Redirect the browser to WeChat OAuth.
   * After the code exchange the callback page will navigate to `redirectTo`.
   *
   * @param {string} redirectTo  App path to return to, e.g. "/my-orders"
   */
  const triggerWeChatAuth = (redirectTo) => {
    const encodedState = encodeStateForRedirect(redirectTo);
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
