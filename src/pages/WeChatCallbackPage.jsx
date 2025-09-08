import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const CF_URL =
  "https://us-central1-homefoods-16e56.cloudfunctions.net/exchangeWeChatCode";

const WeChatCallbackPage = () => {
  const [status, setStatus] = useState("loading"); // "loading", "error", "ok"
  const [data, setData] = useState(null);
  const { handleWeChatCallback } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      // alert("code: " + code);
      console.log("code", code);
      const state = params.get("state");
      const expectedState = sessionStorage.getItem("wx_state");

      if (!code) {
        alert("missing code");
        setStatus("error");
        setData({ error: "missing_code" });
        return;
      }
      // if (!state || !expectedState || state !== expectedState) {
      //   alert("bad state");
      //   // CSRF / replay check failed
      //   setStatus("error");
      //   setData({ error: "bad_state" });
      //   return;
      // }

      try {
        // alert("CF_URL: " + CF_URL);
        const res = await fetch(CF_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
          credentials: "omit",
        });
        const json = await res.json();
        // alert("res: " + JSON.stringify(json));

        if (!res.ok || json.error) {
          // alert("error:" + JSON.stringify(json.error));
          setStatus("error");
          setData({ error: json.error || `http_${res.status}` });
          return;
        }
        // alert("json: " + JSON.stringify(json));
        setStatus("ok")
        setData(json);
        handleWeChatCallback(json);
        navigate("/checkout", { replace: true });

      } catch (e) {
        // alert("catch error:" + JSON.stringify(e));
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
