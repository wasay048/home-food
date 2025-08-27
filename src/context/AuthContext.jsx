import React, { createContext, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { performCompleteLogout } from "../store/actions/logoutActions";
import { setTestUser } from "../store/slices/authSlice";
import { firebaseApp, firebaseDisabled } from "../services/firebase";
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
    const appId = "wx4a71fe09bb125182";
    const redirect = encodeURIComponent(
      "https://www.homefreshfoods.ai/wechat/callback"
    );
    const scope = "snsapi_base";
    const state = "we_" + Math.random().toString(36).slice(2);
    window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appId}&redirect_uri=${redirect}&response_type=code&scope=${scope}&state=${state}#wechat_redirect`;
  }, []);

  // Placeholder: exchange code with backend to obtain Firebase custom token OR OAuth credential
  const handleWeChatCallback = useCallback(
    async (code) => {
      // You would call your backend: `${API}/auth/wechat?code=${code}` to get a custom token
      console.log("WeChat code obtained:", code);
      // Example using custom token
      // const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/wechat?code=${code}`);
      // const { customToken } = await res.json();
      // await signInWithCustomToken(auth, customToken);

      // If using generic OAuthProvider (not typical for official WeChat), placeholder:
      const provider = new OAuthProvider("wechat"); // may need custom provider via backend
      const credential = provider.credential({
        accessToken: "placeholder_access_token",
      });
      if (!firebaseDisabled && auth) {
        await signInWithCredential(auth, credential).catch((err) => {
          console.warn(
            "WeChat credential sign-in failed (expected in placeholder):",
            err.message
          );
        });
      } else {
        console.info(
          "Auth disabled: skipping credential sign-in (placeholder)"
        );
      }
    },
    [auth]
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

      // Clear test user session
      localStorage.removeItem("test_user_session");
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
      // Clear test session even if logout fails
      localStorage.removeItem("test_user_session");
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
