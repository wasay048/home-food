import React from "react";
import "./ErrorBoundary.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Generate unique error ID for tracking
    const errorId = `ERR_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Log error details
    console.error("🚨 [ERROR BOUNDARY] Application crashed:", {
      errorId,
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    });

    // Update state with error details
    this.setState({
      error,
      errorInfo,
      errorId,
    });

    // Optional: Send error to logging service
    this.logErrorToService(error, errorInfo, errorId);
  }

  logErrorToService = (error, errorInfo, errorId) => {
    // You can implement error logging to your preferred service here
    // Example: Sentry, LogRocket, or custom analytics
    console.log("📡 [ERROR BOUNDARY] Logging error to service:", errorId);
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoBack = () => {
    window.history.back();
  };

  handleCopyError = () => {
    const errorDetails = {
      errorId: this.state.errorId,
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
    };

    navigator.clipboard
      .writeText(JSON.stringify(errorDetails, null, 2))
      .then(() => {
        alert("Error details copied to clipboard!");
      })
      .catch(() => {
        console.error("Failed to copy error details");
      });
  };

  toggleErrorDetails = () => {
    this.setState((prevState) => ({
      showDetails: !prevState.showDetails,
    }));
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, errorId, showDetails } = this.state;

      return (
        <div className="error-boundary">
          <div className="error-boundary-container">
            <div className="error-boundary-header">
              <div className="error-icon">🚨</div>
              <h1>Oops! Something went wrong</h1>
              <p className="error-subtitle">
                The application encountered an unexpected error and crashed.
              </p>
            </div>

            <div className="error-boundary-content">
              <div className="error-summary">
                <h3>Error Summary</h3>
                <div className="error-item">
                  <span className="error-label">Error ID:</span>
                  <code className="error-value">{errorId}</code>
                </div>
                <div className="error-item">
                  <span className="error-label">Message:</span>
                  <code className="error-value">
                    {error?.message || "Unknown error"}
                  </code>
                </div>
                <div className="error-item">
                  <span className="error-label">Time:</span>
                  <code className="error-value">
                    {new Date().toLocaleString()}
                  </code>
                </div>
                <div className="error-item">
                  <span className="error-label">Page:</span>
                  <code className="error-value">
                    {window.location.pathname}
                  </code>
                </div>
              </div>

              <div className="error-actions">
                <button
                  onClick={this.handleReload}
                  className="error-btn error-btn-primary"
                >
                  🔄 Reload Page
                </button>
                <button
                  onClick={this.handleGoBack}
                  className="error-btn error-btn-secondary"
                >
                  ⬅️ Go Back
                </button>
                <button
                  onClick={this.handleCopyError}
                  className="error-btn error-btn-copy"
                >
                  📋 Copy Error Details
                </button>
              </div>

              <div className="error-details-section">
                <button
                  onClick={this.toggleErrorDetails}
                  className="error-details-toggle"
                >
                  {showDetails ? "▼" : "▶"} Developer Details
                  {!showDetails && (
                    <span className="toggle-hint">(Click to expand)</span>
                  )}
                </button>

                {showDetails && (
                  <div className="error-details">
                    <div className="error-detail-block">
                      <h4>Stack Trace</h4>
                      <pre className="error-stack">
                        {error?.stack || "No stack trace available"}
                      </pre>
                    </div>

                    <div className="error-detail-block">
                      <h4>Component Stack</h4>
                      <pre className="error-stack">
                        {errorInfo?.componentStack ||
                          "No component stack available"}
                      </pre>
                    </div>

                    <div className="error-detail-block">
                      <h4>Browser Info</h4>
                      <pre className="error-stack">
                        {`User Agent: ${navigator.userAgent}
URL: ${window.location.href}
Timestamp: ${new Date().toISOString()}`}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              <div className="error-help">
                <p>
                  <strong>Need help?</strong> This error has been logged with
                  ID: <code>{errorId}</code>
                </p>
                <p>
                  You can copy the error details above and share them with the
                  development team.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
