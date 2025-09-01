import React, { createContext, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { performCompleteLogout } from "../store/actions/logoutActions";
import { setTestUser } from "../store/slices/authSlice";
import { firebaseApp, firebaseDisabled } from "../services/firebase";
import { WECHAT_CONFIG, getRedirectUri } from "../config/wechat";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously as fbAnon,
  signOut as fbSignOut,
  signInWithCredential,
  OAuthProvider,
} from "firebase/auth";

const AuthContext = createContext(null);

const auth = firebaseApp ? getAuth(firebaseApp) : null;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (firebaseDisabled || !auth) {
      // Skip auth subscription when disabled
      // Check for existing test user session
      const testSession = localStorage.getItem("test_user_session");
      if (testSession) {
        try {
          const mockUser = JSON.parse(testSession);
          setUser(mockUser);
          // IMPORTANT: Also restore to Redux store
          dispatch(setTestUser(mockUser));
          console.log("🧪 Restored test user session:", mockUser);
        } catch (e) {
          console.warn("Failed to restore test session:", e);
          localStorage.removeItem("test_user_session");
        }
      }

      // Check for existing WeChat user session
      const wechatSession = localStorage.getItem("wechat_user");
      if (wechatSession) {
        try {
          const wechatUser = JSON.parse(wechatSession);
          setUser(wechatUser);
          dispatch(setTestUser(wechatUser)); // Use same action for consistency
          console.log("🔄 Restored WeChat user session:", wechatUser);
        } catch (e) {
          console.warn("Failed to restore WeChat session:", e);
          localStorage.removeItem("wechat_user");
        }
      }

      setInitializing(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setInitializing(false);
    });
    return () => unsub();
  }, [auth, dispatch]);

  const signInAnonymously = useCallback(async () => {
    if (firebaseDisabled || !auth) {
      console.info("Auth disabled: anonymous sign-in skipped");
      return;
    }
    await fbAnon(auth);
  }, [auth]);

  // Placeholder: In real impl, redirect user to WeChat OAuth authorize URL
  const signInWithWeChatPopup = useCallback(() => {
    const appId = WECHAT_CONFIG.APP_ID;
    const redirect = encodeURIComponent(getRedirectUri());
    const scope = WECHAT_CONFIG.SCOPE;
    const state = "we_" + Math.random().toString(36).slice(2);

    const authUrl = `${WECHAT_CONFIG.QR_AUTHORIZE_URL}?appid=${appId}&redirect_uri=${redirect}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;

    console.log("🔗 [AuthContext] WeChat OAuth URL:", authUrl);
    console.log("🔍 [AuthContext] Using redirect URI:", getRedirectUri());

    window.location.href = authUrl;
  }, []);

  // Handle WeChat OAuth callback - Frontend-only implementation
  const handleWeChatCallback = useCallback(
    async (code) => {
      try {
        console.log("🔄 Exchanging WeChat code for user info...");

        // Import WECHAT_API here to avoid circular dependencies
        const { WECHAT_API } = await import("../config/wechat");

        // Step 1: Exchange code for access token
        const tokenData = await WECHAT_API.getAccessToken(code);

        if (tokenData.errcode) {
          throw new Error(`WeChat API Error: ${tokenData.errmsg}`);
        }

        console.log("✅ Got access token:", tokenData);

        // Step 2: Get user information
        const userInfo = await WECHAT_API.getUserInfo(
          tokenData.access_token,
          tokenData.openid
        );

        if (userInfo.errcode) {
          throw new Error(`WeChat User Info Error: ${userInfo.errmsg}`);
        }

        console.log("✅ Got user info:", userInfo);

        // Step 3: Create user object
        const wechatUser = {
          id: `wechat_${userInfo.openid}`,
          uid: userInfo.openid,
          openid: userInfo.openid,
          name: userInfo.nickname,
          displayName: userInfo.nickname,
          avatar: userInfo.headimgurl,
          photoURL: userInfo.headimgurl,
          country: userInfo.country,
          province: userInfo.province,
          city: userInfo.city,
          sex: userInfo.sex,
          language: userInfo.language,
          isAuthenticated: true,
          authMethod: "wechat",
          wechatOpenId: userInfo.openid,
          accessToken: tokenData.access_token,
          createdAt: new Date().toISOString(),
        };

        // Step 4: Store user data in localStorage
        localStorage.setItem('wechat_user', JSON.stringify(wechatUser));

        // Step 5: Update React state
        setUser(wechatUser);

        // Step 6: Update Redux store
        dispatch(setTestUser(wechatUser));

        console.log("✅ WeChat authentication successful:", wechatUser);
        return wechatUser;
      } catch (error) {
        console.error("❌ WeChat authentication failed:", error);
        throw error;
      }
    },
    [dispatch]
  );

  // TEMPORARY: Bypass WeChat auth for testing purposes
  const signInWithTestUser = useCallback(async () => {
    console.log("🧪 Using test user bypass");

    // Create a mock user object similar to what WeChat would provide
    const mockUser = {
      id: `test_user_${Date.now()}`,
      uid: `test_user_${Date.now()}`,
      openid: `test_openid_${Date.now()}`,
      name: "Test User",
      displayName: "Test User",
      avatar: null,
      photoURL: null,
      email: null,
      country: "Test Country",
      province: "Test Province",
      city: "Test City",
      sex: 0,
      language: "en",
      isAuthenticated: true,
      authMethod: "test",
      wechatOpenId: `test_openid_${Date.now()}`,
      accessToken: "test_access_token",
      providerId: "test",
      isAnonymous: false,
      createdAt: new Date().toISOString(),
    };

    // Set the mock user in React Context
    setUser(mockUser);

    // IMPORTANT: Also dispatch to Redux store so the app recognizes the user
    dispatch(setTestUser(mockUser));

    // Store test session in localStorage for persistence
    localStorage.setItem("test_user_session", JSON.stringify(mockUser));

    console.log("✅ Test user signed in:", mockUser);
    return mockUser;
  }, [dispatch]);

  const signOut = useCallback(async () => {
    try {
      // Firebase signout first
      if (!firebaseDisabled && auth) {
        await fbSignOut(auth);
      }

      // Clear all user sessions
      localStorage.removeItem("test_user_session");
      localStorage.removeItem("wechat_user");
      setUser(null);

      // Then perform complete logout with Redux persist clearing
      await dispatch(performCompleteLogout()).unwrap();

      console.log("✅ Complete logout successful");
    } catch (error) {
      console.error("❌ Logout error:", error);
      // Still attempt basic cleanup if comprehensive logout fails
      if (!firebaseDisabled && auth) {
        await fbSignOut(auth);
      }
      // Clear all sessions even if logout fails
      localStorage.removeItem("test_user_session");
      localStorage.removeItem("wechat_user");
      setUser(null);
    }
  }, [auth, dispatch]);

  const value = {
    user,
    initializing,
    authDisabled: firebaseDisabled,
    signInAnonymously,
    signInWithWeChatPopup,
    signInWithTestUser, // TEMPORARY: for testing
    handleWeChatCallback,
    signOut,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
