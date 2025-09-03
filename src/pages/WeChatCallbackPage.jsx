import React, { useEffect, useState } from "react";

const CF_URL =
  "https://us-central1-homefoods-16e56.cloudfunctions.net/exchangeWeChatCode";

const WeChatCallbackPage = () => {
  const [status, setStatus] =
    (useState < "loading") | "ok" | ("error" > "loading");
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      console.log("code", code);
      const state = params.get("state");
      const expectedState = sessionStorage.getItem("wx_state");

      if (!code) {
        setStatus("error");
        setData({ error: "missing_code" });
        return;
      }
      if (!state || !expectedState || state !== expectedState) {
        // CSRF / replay check failed
        setStatus("error");
        setData({ error: "bad_state" });
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

        setStatus("ok");
        setData(json);
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
