import React from "react";
import { useAuth } from "../hooks/useAuth";
import wechatIcon from "../assets/wechat-icon.svg";

export default function LoginPage() {
  const { signInWithWeChatPopup, signInAnonymously } = useAuth();
  return (
    <div className="container py-5">
      <h1 className="h5 mb-4 text-center">Sign In</h1>
      <div className="d-grid gap-3">
        <button
          className="btn btn-success d-flex align-items-center justify-content-center gap-2"
          onClick={signInWithWeChatPopup}
        >
          <img
            src={wechatIcon}
            alt="WeChat"
            style={{ width: 20, height: 20 }}
          />
          <span>Continue with WeChat</span>
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={signInAnonymously}
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
}
