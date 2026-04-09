import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import useWeChatAuth, { encodeStateForRedirect } from "../hooks/useWeChatAuth";
import WeChatAuthDialog from "../components/WeChatAuthDialog/WeChatAuthDialog";
import { Copy, X, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { uploadImageToStorage } from "../services/storageService";
import { useUserAccount } from "../hooks/useUserAccount";
import { showToast } from "../utils/toast";
import { db } from "../services/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs } from "firebase/firestore";
import "./MyBalancePage.css";

export default function MyBalancePage() {
  const navigate = useNavigate();

  // User state
  const currentUser = useSelector((state) => state.auth.user);
  const { isAuthenticated, triggerWeChatAuth } = useWeChatAuth();

  // Balance
  const { getUserBalance } = useUserAccount();
  const [accountBalance, setAccountBalance] = useState(0);

  // Credit form
  const [creditAmount, setCreditAmount] = useState("100");

  // Upload state
  const [uploadPreview, setUploadPreview] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [firebaseImageUrl, setFirebaseImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Pending request check
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [checkingPending, setCheckingPending] = useState(true);

  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Fetch balance and check for pending credit requests on mount
  useEffect(() => {
    const fetchData = async () => {
      if (currentUser?.id) {
        // Fetch balance
        const balance = await getUserBalance(currentUser.id);
        setAccountBalance(balance);

        // Check for existing pending credit request
        try {
          const q = query(
            collection(db, "credit"),
            where("userId", "==", currentUser.id),
            where("status", "==", "pending")
          );
          const snapshot = await getDocs(q);
          setHasPendingRequest(!snapshot.empty);
        } catch (err) {
          console.error("Error checking pending requests:", err);
        } finally {
          setCheckingPending(false);
        }
      } else {
        setCheckingPending(false);
      }
    };
    fetchData();
  }, [currentUser?.id, getUserBalance]);

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (uploadPreview) {
        try {
          URL.revokeObjectURL(uploadPreview);
        } catch (e) {
          console.log("Error revoking URL:", e);
        }
      }
    };
  }, []);

  // Handle file drop
  const onDrop = async (acceptedFiles) => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setUploadedFile(file);
      setUploadError(null);

      // Clean up previous preview
      if (uploadPreview) {
        URL.revokeObjectURL(uploadPreview);
      }

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setUploadPreview(previewUrl);

      // Upload to Firebase Storage
      try {
        setIsUploading(true);
        const userId = currentUser?.uid || currentUser?.id || "anonymous";
        const downloadURL = await uploadImageToStorage(
          file,
          "Credit-Requests",
          userId
        );
        setFirebaseImageUrl(downloadURL);
        showToast.success("Screenshot uploaded successfully!");
        console.log("Firebase Storage URL:", downloadURL);
      } catch (error) {
        console.error("Error uploading to Firebase:", error);
        setUploadError(error.message);
        showToast.error(`Upload failed: ${error.message}`);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".bmp", ".webp"],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024,
  });

  // Remove uploaded image
  const removeImage = () => {
    if (uploadPreview) {
      URL.revokeObjectURL(uploadPreview);
    }
    setUploadPreview(null);
    setUploadedFile(null);
    setFirebaseImageUrl(null);
    setUploadError(null);
  };

  // Copy to clipboard
  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast.success("Copied to clipboard!");
    } catch (err) {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      showToast.success("Copied to clipboard!");
    }
  };

  // Handle Add Credit
  const handleAddCredit = async () => {
    if (hasPendingRequest) {
      showToast.error("You already have a pending credit request under review.");
      return;
    }

    const amount = parseFloat(creditAmount);

    if (!amount || amount <= 0) {
      showToast.error("Please enter a valid amount.");
      return;
    }

    if (!firebaseImageUrl) {
      showToast.error("Please upload a payment screenshot.");
      return;
    }

    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // Create credit request document in Firestore (admin will approve and add balance from iOS app)
      await addDoc(collection(db, "credit"), {
        amount: amount,
        createdAt: serverTimestamp(),
        screenshotUrl: firebaseImageUrl,
        status: "pending",
        userId: currentUser.id,
        userName: currentUser.name || currentUser.displayName || "",
      });

      // Show success and reset
      setShowSuccess(true);
      showToast.success(`$${amount.toFixed(2)} credit request submitted!`);

      // Reset form
      setCreditAmount("100");
      removeImage();

      // Hide success after a few seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting credit request:", error);
      showToast.error(`Failed to submit credit request: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mobile-container my-balance-page">
      {showAuthDialog && (
        <WeChatAuthDialog
          onClose={() => setShowAuthDialog(false)}
          firebaseImageUrl={encodeStateForRedirect("/my-balance")}
        />
      )}
      {/* Header */}
      <div className="my-balance-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="page-title">My Balance</h1>
        <div style={{ width: "40px" }}></div>
      </div>

      {/* Balance Card */}
      <div className="balance-display-card">
        <div className="balance-label">Current Balance</div>
        <div className="balance-amount">${accountBalance.toFixed(2)}</div>
      </div>

      {/* Pending Request Warning */}
      {hasPendingRequest && !showSuccess && (
        <div
          style={{
            background: "#fff3cd",
            border: "1px solid #ffc107",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "24px", marginBottom: "6px" }}>⏳</div>
          <div style={{ fontSize: "15px", fontWeight: "600", color: "#856404" }}>
            Pending Credit Request
          </div>
          <div style={{ fontSize: "13px", color: "#856404", marginTop: "4px" }}>
            You have a credit request that is currently being reviewed by the admin. You'll be able to submit a new request once it's been approved or processed.
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccess && (
        <div className="credit-success-message">
          <div className="success-icon">✅</div>
          <div className="success-text">Credit Request Submitted!</div>
          <div className="success-subtext">
            Your credit will be added once approved by the admin.
          </div>
        </div>
      )}

      {/* Only show the form when there is no pending request */}
      {!hasPendingRequest && (
        <>
          {/* Credit Amount Input */}
          <div className="credit-amount-section">
            <div className="section-title">I want to add credit:</div>
            <div className="credit-amount-input-wrapper">
              <span className="dollar-sign">$</span>
              <input
                type="number"
                className="credit-amount-input"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                min="1"
                step="1"
                placeholder="100"
              />
            </div>
          </div>

          {/* Payment Info */}
          <div className="payment-info-section">
            <div className="section-title">Payment Information</div>

            <div className="payment-info-row">
              <span className="payment-label">PayPal</span>
              <span className="payment-value">
                13817276240@163.com
                <button
                  className="copy-btn"
                  onClick={() => handleCopy("13817276240@163.com")}
                >
                  <Copy size={14} /> Copy
                </button>
              </span>
            </div>

            <div className="payment-info-row">
              <span className="payment-label">Venmo</span>
              <span className="payment-value">
                @Huifang-Qin
                <button
                  className="copy-btn"
                  onClick={() => handleCopy("@Huifang-Qin")}
                >
                  <Copy size={14} /> Copy
                </button>
              </span>
            </div>

            <div className="payment-info-row">
              <span className="payment-label">Zelle</span>
              <span className="payment-value">
                5107389532
                <button
                  className="copy-btn"
                  onClick={() => handleCopy("5107389532")}
                >
                  <Copy size={14} /> Copy
                </button>
              </span>
            </div>
          </div>

          {/* Screenshot Upload */}
          <div className="screenshot-upload-section">
            <div className="section-title">After making credit payment, please upload payment screenshot by clicking the box below:</div>

            {!uploadPreview ? (
              <div
                {...getRootProps()}
                className={`upload-dropzone ${isDragActive ? "drag-active" : ""}`}
              >
                <input {...getInputProps()} />
                <div className="upload-icon">
                  <ImageIcon size={40} color="#999" />
                </div>
                <div className="upload-text">
                  {isDragActive
                    ? "Drop your image here..."
                    : "Tap to upload or drag & drop"}
                </div>
                <div className="upload-hint">JPG, PNG, GIF • Max 10MB</div>
              </div>
            ) : (
              <div className="upload-preview-container">
                <img src={uploadPreview} alt="Payment screenshot" />
                <button className="remove-btn" onClick={removeImage}>
                  <X size={18} />
                </button>
              </div>
            )}

            {isUploading && (
              <div className="upload-status uploading">⏳ Uploading...</div>
            )}
            {firebaseImageUrl && !isUploading && (
              <div className="upload-status success">✅ Upload complete</div>
            )}
            {uploadError && (
              <div className="upload-status error">❌ {uploadError}</div>
            )}
          </div>

          {/* Add Credit Button */}
          <button
            className="add-credit-btn"
            onClick={handleAddCredit}
            disabled={
              isSubmitting ||
              isUploading ||
              !firebaseImageUrl ||
              !creditAmount ||
              parseFloat(creditAmount) <= 0
            }
          >
            {isSubmitting ? "Processing..." : "Add Credit"}
          </button>
        </>
      )}
    </div>
  );
}
