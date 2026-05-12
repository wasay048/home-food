import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import * as Sentry from "@sentry/react";
import VConsole from "vconsole";
import { store, persistor } from "./store";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";

import "./styles/index.css";

// vConsole — Tencent's in-page DevTools panel. Hidden from end users in
// production; opt-in via `?debug=1` on any URL when we need to inspect a
// live WeChat session again. Package stays installed so re-enabling is a
// one-line condition change, no rebuild of dependencies.
const enableVConsole = /[?&]debug=1\b/.test(window.location.search);
if (enableVConsole) {
  new VConsole();
}

Sentry.init({
  dsn: "https://9a5057c3a5d839bbd8658186c927939b@o4510702897790976.ingest.us.sentry.io/4511375868952576",
  sendDefaultPii: true,
});

// Tag every event with whether the user is inside WeChat's in-app webview —
// makes the WeChat-only crashes one filter click away in the dashboard.
Sentry.setTag(
  "is_wechat",
  /MicroMessenger/i.test(navigator.userAgent) ? "yes" : "no"
);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Sentry.ErrorBoundary
      fallback={({ error, resetError }) => (
        <div style={{ padding: 24, fontFamily: "sans-serif" }}>
          <h3>Something went wrong</h3>
          <p style={{ color: "#666" }}>
            {error?.message || "An unexpected error occurred."}
          </p>
          <button onClick={resetError}>Try again</button>
        </div>
      )}
    >
      <Provider store={store}>
        <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
          <BrowserRouter>
            <AuthProvider>
              <AppRoutes />
              <Toaster
              position="top-center"
              reverseOrder={false}
              gutter={8}
              toastOptions={{
                duration: 3000,
                style: {
                  background: "#fff",
                  color: "#333",
                  borderRadius: "12px",
                  padding: "16px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e0e0e0",
                },
                success: {
                  iconTheme: {
                    primary: "#10B981",
                    secondary: "#fff",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#EF4444",
                    secondary: "#fff",
                  },
                },
              }}
            />
            </AuthProvider>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </Sentry.ErrorBoundary>
  </React.StrictMode>
);
