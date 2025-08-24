import React, { createContext, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { performCompleteLogout } from "../store/actions/logoutActions";
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
      setInitializing(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setInitializing(false);
    });
    return () => unsub();
  }, [auth]);

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
      "https://master.d5tekh3anrrmn.amplifyapp.com/"
    );
    const scope = "snsapi_userinfo";
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

  const signOut = useCallback(async () => {
    try {
      // Firebase signout first
      if (!firebaseDisabled && auth) {
        await fbSignOut(auth);
      }

      // Then perform complete logout with Redux persist clearing
      await dispatch(performCompleteLogout()).unwrap();

      console.log("✅ Complete logout successful");
    } catch (error) {
      console.error("❌ Logout error:", error);
      // Still attempt basic cleanup if comprehensive logout fails
      if (!firebaseDisabled && auth) {
        await fbSignOut(auth);
      }
    }
  }, [auth, dispatch]);

  const value = {
    user,
    initializing,
    authDisabled: firebaseDisabled,
    signInAnonymously,
    signInWithWeChatPopup,
    handleWeChatCallback,
    signOut,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
