import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authenticateWithWeChat } from "../store/slices/authSlice";
import { showToast } from "../utils/toast";

const WeChatCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing"); // processing, success, error

  useEffect(() => {
    const handleWeChatCallback = async () => {
      try {
        // Get the authorization code from URL parameters
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const error = searchParams.get("error");

        console.log("WeChat callback received:", { code, state, error });

        if (error) {
          throw new Error(`WeChat OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error("Authorization code not received from WeChat");
        }

        // Dispatch WeChat authentication
        setStatus("processing");
        const result = await dispatch(authenticateWithWeChat(code)).unwrap();

        console.log("✅ WeChat authentication successful:", result);
        setStatus("success");

        // Show success message
        showToast.success(`Welcome ${result.name || "User"}!`);

        // Check if user was trying to add something to cart before auth
        const pendingCartAction = sessionStorage.getItem(
          "wechat_pending_cart_action"
        );

        if (pendingCartAction === "true") {
          // Clear the pending action
          sessionStorage.removeItem("wechat_pending_cart_action");

          // Show message and redirect back to food detail page
          showToast.info("You can now add items to your cart!");

          // Go back to the previous page or foods list
          setTimeout(() => {
            window.history.back() || navigate("/foods");
          }, 1500);
        } else {
          // Regular auth flow - go to home
          setTimeout(() => {
            navigate("/");
          }, 1500);
        }
      } catch (error) {
        console.error("❌ WeChat authentication failed:", error);
        setStatus("error");

        // Show error message
        showToast.error(error.message || "Authentication failed");

        // Redirect to home after showing error
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    };

    handleWeChatCallback();
  }, [searchParams, dispatch, navigate]);

  return (
    <div className="wechat-callback-page">
      <div className="container py-5">
        <div className="text-center">
          {status === "processing" && (
            <>
              <div className="spinner-border text-success mb-3" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <h2>Processing WeChat Authentication...</h2>
              <p className="text-muted">Please wait while we sign you in.</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="text-success mb-3">
                <svg
                  width="48"
                  height="48"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
                </svg>
              </div>
              <h2>Authentication Successful!</h2>
              <p className="text-muted">Redirecting you now...</p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="text-danger mb-3">
                <svg
                  width="48"
                  height="48"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                </svg>
              </div>
              <h2>Authentication Failed</h2>
              <p className="text-muted">
                Something went wrong. Redirecting to home...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeChatCallbackPage;
