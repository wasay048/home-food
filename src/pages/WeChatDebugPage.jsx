import React, { useState } from "react";
import WeChatDiagnosticPanel from "../components/WeChatDiagnosticPanel";
import {
  runWeChatDiagnostics,
  checkWeChatDomain,
} from "../utils/wechatDiagnostics";

const WeChatDebugPage = () => {
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [consoleResults, setConsoleResults] = useState(null);

  const runQuickTest = async () => {
    console.log("🚀 Running quick WeChat test...");
    const results = await runWeChatDiagnostics();
    setConsoleResults(results);
    console.log("✅ Quick test completed:", results);
  };

  const runFullReport = async () => {
    console.log("📊 Generating full WeChat report...");
    const report = await checkWeChatDomain();
    setConsoleResults(report);
    console.log("📋 Full report completed:", report);
  };

  const openWeChatConsole = () => {
    window.open("https://developers.weixin.qq.com/", "_blank");
  };

  const openDiagnosticPage = () => {
    window.open("/wechat-diagnosis.html", "_blank");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>WeChat Authentication Debug</h1>
        <p>
          Diagnostic tools for troubleshooting WeChat domain verification issues
        </p>
      </div>

      <div style={styles.section}>
        <h2>Quick Actions</h2>
        <div style={styles.buttonGrid}>
          <button onClick={runQuickTest} style={styles.button}>
            🔍 Run Quick Test
          </button>
          <button onClick={runFullReport} style={styles.button}>
            📊 Generate Full Report
          </button>
          <button
            onClick={() => setShowDiagnostics(true)}
            style={styles.button}
          >
            🛠️ Open Diagnostic Panel
          </button>
          <button onClick={openDiagnosticPage} style={styles.button}>
            🌐 Open Web Diagnostic Tool
          </button>
        </div>
      </div>

      <div style={styles.section}>
        <h2>External Resources</h2>
        <div style={styles.buttonGrid}>
          <button onClick={openWeChatConsole} style={styles.externalButton}>
            🏗️ WeChat Developer Console
          </button>
          <a
            href="https://homefreshfoods.ai/MP_verify_placeholder.txt"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            📄 Check Verification File
          </a>
        </div>
      </div>

      <div style={styles.section}>
        <h2>Current Configuration</h2>
        <div style={styles.config}>
          <div style={styles.configItem}>
            <strong>Domain:</strong> homefreshfoods.ai
          </div>
          <div style={styles.configItem}>
            <strong>App ID:</strong> wx4a71fe09bb125182
          </div>
          <div style={styles.configItem}>
            <strong>Redirect URI:</strong>{" "}
            https://homefreshfoods.ai/wechat/callback
          </div>
          <div style={styles.configItem}>
            <strong>Environment:</strong> Production
          </div>
        </div>
      </div>

      {consoleResults && (
        <div style={styles.section}>
          <h2>Latest Results</h2>
          <div style={styles.results}>
            <pre style={styles.pre}>
              {JSON.stringify(consoleResults, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div style={styles.section}>
        <h2>Common Issues & Solutions</h2>
        <div style={styles.troubleshooting}>
          <div style={styles.issue}>
            <h3>Error 10003: Redirect URI Domain Mismatch</h3>
            <ul>
              <li>Verify domain is added to Web Authorization Domain list</li>
              <li>Ensure verification file is uploaded and accessible</li>
              <li>
                Check domain status is &quot;Verified&quot; not
                &quot;Pending&quot;
              </li>
              <li>Confirm no typos in domain name</li>
            </ul>
          </div>

          <div style={styles.issue}>
            <h3>Verification File Not Found</h3>
            <ul>
              <li>Download MP_verify_*.txt from WeChat Console</li>
              <li>Upload to website root directory</li>
              <li>Ensure file is accessible via HTTPS</li>
              <li>Check file permissions and hosting configuration</li>
            </ul>
          </div>

          <div style={styles.issue}>
            <h3>Domain Not Verified</h3>
            <ul>
              <li>Upload correct verification file</li>
              <li>Wait for WeChat verification process (can take minutes)</li>
              <li>Try removing and re-adding domain</li>
              <li>Ensure HTTPS is properly configured</li>
            </ul>
          </div>
        </div>
      </div>

      <WeChatDiagnosticPanel
        isVisible={showDiagnostics}
        onClose={() => setShowDiagnostics(false)}
        autoRun={true}
      />
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "2px solid #eee",
  },
  section: {
    marginBottom: "30px",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
  },
  buttonGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "10px",
    marginTop: "15px",
  },
  button: {
    padding: "12px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    textAlign: "center",
  },
  externalButton: {
    padding: "12px 20px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
    textAlign: "center",
  },
  link: {
    display: "inline-block",
    padding: "12px 20px",
    backgroundColor: "#6c757d",
    color: "white",
    textDecoration: "none",
    borderRadius: "6px",
    textAlign: "center",
  },
  config: {
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "6px",
    border: "1px solid #ddd",
  },
  configItem: {
    padding: "8px 0",
    borderBottom: "1px solid #eee",
  },
  results: {
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    maxHeight: "400px",
    overflow: "auto",
  },
  pre: {
    margin: 0,
    fontSize: "12px",
    lineHeight: "1.4",
  },
  troubleshooting: {
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "6px",
    border: "1px solid #ddd",
  },
  issue: {
    marginBottom: "20px",
    paddingBottom: "15px",
    borderBottom: "1px solid #eee",
  },
};

export default WeChatDebugPage;
