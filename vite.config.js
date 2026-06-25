import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => {
  const isBuild = command === "build";
  return {
    plugins: [react()],
    // Strip console.* and debugger from production builds only. The hot paths
    // log large objects on every mount/foreground, which is non-trivial
    // main-thread cost in the WeChat in-app webview. Real error reporting goes
    // through Sentry.captureException, which is unaffected.
    esbuild: {
      drop: isBuild ? ["console", "debugger"] : [],
    },
    build: {
      target: "es2018",
      // Skip the gzip-size report pass — it walks every chunk after
      // bundling and is a common cause of slow/stalled CI builds.
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
            firebase: ["firebase/app", "firebase/firestore", "firebase/auth"],
          },
        },
      },
    },
    css: {
      devSourcemap: true,
    },
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
  };
});
