import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const CF_URL =
  "https://us-central1-homefoods-16e56.cloudfunctions.net/exchangeWeChatCode";

/**
 * Decode the OAuth `state` parameter.
 *
 * Two formats are supported so the existing checkout flow is never broken:
 *
 * 1. LEGACY (checkout flow) — state is a raw Firebase Storage URL string,
 *    e.g. "https://firebasestorage.googleapis.com/...".
 *    Returns: { redirectTo: "/checkout", firebaseImageUrl: <state> }
 *
 * 2. GENERIC (my-orders / my-balance / future pages) — state is a
 *    base64-encoded JSON object, e.g. btoa(JSON.stringify({ redirectTo: "/my-orders" })).
 *    Returns: { redirectTo: "/my-orders", firebaseImageUrl: null }
 *
 * Detection: if `state` starts with "http" it is treated as a legacy URL.
 */
const decodeOAuthState = (state) => {
  if (!state) return { redirectTo: "/checkout", firebaseImageUrl: null };

  // Legacy checkout flow: state is a plain Firebase Storage / HTTPS URL
  if (state.startsWith("http")) {
    return { redirectTo: "/checkout", firebaseImageUrl: state };
  }

  // Generic flow: state is base64-encoded JSON
  try {
    const decoded = JSON.parse(atob(state));
    return {
      redirectTo: decoded.redirectTo || "/checkout",
      firebaseImageUrl: decoded.firebaseImageUrl || null,
    };
  } catch {
    // Unrecognised format — fall back to checkout
    return { redirectTo: "/checkout", firebaseImageUrl: null };
  }
};

const WeChatCallbackPage = () => {
  const [status, setStatus] = useState("loading"); // "loading", "error", "ok"
  const [data, setData] = useState(null);
  const { handleWeChatCallback } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      console.log("code", code);
      const state = params.get("state");

      if (!code) {
        setStatus("error");
        setData({ error: "missing_code" });
        return;
      }

      try {
        const res = await fetch(CF_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
          credentials: "omit",
        });
        const json = await res.json();

        if (!res.ok || json.error) {
          setStatus("error");
          setData({ error: json.error || `http_${res.status}` });
          return;
        }

        const { redirectTo, firebaseImageUrl } = decodeOAuthState(state);

        // Attach firebaseImageUrl to the response payload so AuthContext can
        // consume it downstream (existing checkout behaviour preserved).
        json["firebaseImageUrl"] = firebaseImageUrl;

        setStatus("ok");
        setData(json);
        await handleWeChatCallback(json);

        // Redirect: checkout flow appends firebaseImageUrl as a query param
        // (existing behaviour); generic flow redirects cleanly to the target path.
        if (redirectTo === "/checkout" && firebaseImageUrl) {
          navigate(
            "/checkout?" + new URLSearchParams({ firebaseImageUrl }),
            { replace: true }
          );
        } else {
          navigate(redirectTo, { replace: true });
        }
      } catch (e) {
        setStatus("error");
        setData({ error: e?.message || "network_error" });
      }
    })();
  }, []);

  if (status === "loading") return <p>Exchanging code…</p>;
  if (status === "error")
    return <pre>Error: {JSON.stringify(data, null, 2)}</pre>;

  return (
    <div>
      <h2>WeChat login success</h2>
      <pre style={{ fontSize: 12, background: "#f6f6f6", padding: 12 }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default WeChatCallbackPage;
