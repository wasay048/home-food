import React, { useState, useEffect } from "react";
import { WeChatDiagnostics } from "../utils/wechatDiagnostics";

const WeChatDiagnosticPanel = ({
  isVisible = false,
  onClose = () => {},
  autoRun = false,
}) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  useEffect(() => {
    if (autoRun && isVisible) {
      runDiagnostics();
    }
  }, [autoRun, isVisible]);

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const diagnostics = new WeChatDiagnostics();
      const testResults = await diagnostics.runAllTests();
      const fullReport = diagnostics.generateReport();

      setResults(testResults);
      setReport(fullReport);
    } catch (error) {
      console.error("Diagnostic error:", error);
      setResults({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (success) => {
    return success ? "✅" : "❌";
  };

  const getStatusColor = (success) => {
    return success ? "#4CAF50" : "#F44336";
  };

  if (!isVisible) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.panel}>
        <div style={styles.header}>
          <h2>WeChat Diagnostics</h2>
          <button onClick={onClose} style={styles.closeButton}>
            ×
          </button>
        </div>

        <div style={styles.actions}>
          <button
            onClick={runDiagnostics}
            disabled={loading}
            style={styles.runButton}
          >
            {loading ? "Running Tests..." : "Run Diagnostics"}
          </button>
        </div>

        {loading && (
          <div style={styles.loading}>
            <div style={styles.spinner}></div>
            <p>Running WeChat diagnostic tests...</p>
          </div>
        )}

        {results && !loading && (
          <div style={styles.results}>
            {results.error ? (
              <div style={styles.error}>
                <h3>Error</h3>
                <p>{results.error}</p>
              </div>
            ) : (
              <>
                <div style={styles.overall}>
                  <h3>
                    Overall Status: {getStatusIcon(results.overall?.success)}
                  </h3>
                  <p
                    style={{ color: getStatusColor(results.overall?.success) }}
                  >
                    {results.overall?.message}
                  </p>
                  <p>Score: {results.overall?.score}</p>
                </div>

                <div style={styles.tests}>
                  <h3>Test Results</h3>
                  {Object.entries(results.tests).map(([testName, test]) => (
                    <div key={testName} style={styles.testItem}>
                      <div style={styles.testHeader}>
                        <span style={styles.testIcon}>
                          {getStatusIcon(test.success)}
                        </span>
                        <strong>{test.name}</strong>
                      </div>
                      <p style={styles.testMessage}>{test.message}</p>
                      {test.url && (
                        <p style={styles.testUrl}>
                          URL:{" "}
                          <a
                            href={test.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {test.url}
                          </a>
                        </p>
                      )}
                      {test.qrCodeUrl && (
                        <div style={styles.qrCode}>
                          <p>QR Code for mobile testing:</p>
                          <img
                            src={test.qrCodeUrl}
                            alt="WeChat Auth QR"
                            style={styles.qrImage}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {report && (
                  <div style={styles.recommendations}>
                    <h3>Recommendations</h3>
                    {report.recommendations.map((rec, index) => (
                      <div key={index} style={styles.recommendation}>
                        <span style={styles.bullet}>•</span> {rec}
                      </div>
                    ))}

                    <h3>Next Steps</h3>
                    {report.nextSteps.map((step, index) => (
                      <div key={index} style={styles.nextStep}>
                        <span style={styles.stepNumber}>{index + 1}.</span>{" "}
                        {step}
                      </div>
                    ))}
                  </div>
                )}

                <div style={styles.checklist}>
                  <h3>WeChat Console Checklist</h3>
                  <p>
                    <a
                      href="https://developers.weixin.qq.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.link}
                    >
                      Open WeChat Developer Console
                    </a>
                  </p>
                  {report?.checklist.steps.map((step) => (
                    <div key={step.step} style={styles.checklistItem}>
                      <span style={styles.stepNumber}>{step.step}.</span>
                      <span>{step.action}</span>
                      {step.status === "critical" && (
                        <span style={styles.critical}> (Critical)</span>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 10000,
    overflow: "auto",
  },
  panel: {
    backgroundColor: "white",
    margin: "20px auto",
    padding: "20px",
    maxWidth: "800px",
    borderRadius: "8px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
    marginBottom: "20px",
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    padding: "0",
    width: "30px",
    height: "30px",
  },
  actions: {
    marginBottom: "20px",
  },
  runButton: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  loading: {
    textAlign: "center",
    padding: "20px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #3498db",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 10px",
  },
  results: {
    marginTop: "20px",
  },
  overall: {
    backgroundColor: "#f8f9fa",
    padding: "15px",
    borderRadius: "4px",
    marginBottom: "20px",
  },
  error: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    padding: "15px",
    borderRadius: "4px",
  },
  tests: {
    marginBottom: "20px",
  },
  testItem: {
    border: "1px solid #ddd",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "4px",
  },
  testHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "5px",
  },
  testIcon: {
    marginRight: "8px",
  },
  testMessage: {
    margin: "5px 0",
    fontSize: "14px",
  },
  testUrl: {
    margin: "5px 0",
    fontSize: "12px",
    color: "#666",
  },
  qrCode: {
    textAlign: "center",
    marginTop: "10px",
  },
  qrImage: {
    maxWidth: "200px",
    height: "auto",
  },
  recommendations: {
    backgroundColor: "#fff3cd",
    padding: "15px",
    borderRadius: "4px",
    marginBottom: "20px",
  },
  recommendation: {
    display: "flex",
    alignItems: "flex-start",
    marginBottom: "5px",
  },
  bullet: {
    marginRight: "8px",
    color: "#856404",
  },
  nextStep: {
    display: "flex",
    alignItems: "flex-start",
    marginBottom: "5px",
  },
  stepNumber: {
    marginRight: "8px",
    color: "#856404",
    fontWeight: "bold",
  },
  checklist: {
    backgroundColor: "#e1f5fe",
    padding: "15px",
    borderRadius: "4px",
  },
  checklistItem: {
    display: "flex",
    alignItems: "flex-start",
    marginBottom: "8px",
  },
  critical: {
    color: "#d32f2f",
    fontWeight: "bold",
  },
  link: {
    color: "#1976d2",
    textDecoration: "none",
  },
};

export default WeChatDiagnosticPanel;
