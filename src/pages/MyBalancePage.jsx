import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

  // User state — localStorage-backed, no timing issues
  const currentUser = useSelector((state) => state.auth.user);
  const { isAuthenticated } = useWeChatAuth();

  // Balance
  const { getUserBalance } = useUserAccount();
  const [accountBalance, setAccountBalance] = useState(0);

  // Credit form
  const [creditAmount, setCreditAmount] = useState("100");

  // Upload state
  const [uploadPreview, setUploadPreview] = useState(null);
  const [firebaseImageUrl, setFirebaseImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Pending request check
  const [hasPendingRequest, setHasPendingRequest] = useState(false);

  // Auth dialog — only shown on explicit user action
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Pull-to-refresh
  const [refreshing, setRefreshing] = useState(false);
  const touchStartY = useRef(0);
  const containerRef = useRef(null);

  // ─── Back navigation ─────────────────────────────────────────────────────
  // After a WeChat OAuth round-trip the browser history looks like:
  //   [detail page] → [wechat oauth] → [/my-balance]   (callback used replace:true)
  // So navigate(-1) would go to wechat's server which would re-trigger auth.
  // Instead we navigate to wherever the user came from (location.state.from)
  // or fall back to the detail/foods page.
  const handleBack = () => {
    const from = location.state?.from;
    if (from) {
      navigate(from);
    } else {
      // If there's real history behind us (not an OAuth redirect) go back,
      // otherwise fall back to the food listing.
      navigate("/foods");
    }
  };

  // ─── Data fetching ────────────────────────────────────────────────────────
  const fetchData = async () => {
    if (!currentUser?.id) return;
    const balance = await getUserBalance(currentUser.id);
    setAccountBalance(balance);
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
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser?.id]);

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (uploadPreview) URL.revokeObjectURL(uploadPreview);
    };
  }, [uploadPreview]);

  // ─── Pull-to-refresh ─────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchEnd = async (e) => {
      const delta = e.changedTouches[0].clientY - touchStartY.current;
      // Only trigger when pulled down >70px and page is scrolled to top
      if (delta > 70 && el.scrollTop === 0) {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [currentUser?.id]);

  // ─── File upload ──────────────────────────────────────────────────────────
  const onDrop = async (acceptedFiles) => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }
    if (!acceptedFiles.length) return;

    const file = acceptedFiles[0];
    if (uploadPreview) URL.revokeObjectURL(uploadPreview);
    setUploadPreview(URL.createObjectURL(file));
    setUploadError(null);

    try {
      setIsUploading(true);
      const userId = currentUser?.uid || currentUser?.id || "anonymous";
      const downloadURL = await uploadImageToStorage(file, "Credit-Requests", userId);
      setFirebaseImageUrl(downloadURL);
      showToast.success("Screenshot uploaded successfully!");
    } catch (error) {
      setUploadError(error.message);
      showToast.error(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".bmp", ".webp"] },
    multiple: false,
    maxSize: 10 * 1024 * 1024,
  });

  const removeImage = () => {
    if (uploadPreview) URL.revokeObjectURL(uploadPreview);
    setUploadPreview(null);
    setFirebaseImageUrl(null);
    setUploadError(null);
  };

  // ─── Copy to clipboard ────────────────────────────────────────────────────
  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast.success("Copied to clipboard!");
    } catch {
      showToast.error("Copy failed — please copy manually.");
    }
  };

  // ─── Add credit ───────────────────────────────────────────────────────────
  const handleAddCredit = async () => {
    if (!isAuthenticated) {
      setShowAuthDialog(true);
      return;
    }
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

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "credit"), {
        amount,
        createdAt: serverTimestamp(),
        screenshotUrl: firebaseImageUrl,
        status: "pending",
        userId: currentUser.id,
        userName: currentUser.name || currentUser.displayName || "",
      });
      setShowSuccess(true);
      showToast.success(`$${amount.toFixed(2)} credit request submitted!`);
      setCreditAmount("100");
      removeImage();
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      showToast.error(`Failed to submit credit request: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="mobile-container my-balance-page" ref={containerRef}>
      {showAuthDialog && (
        <WeChatAuthDialog
          onClose={() => setShowAuthDialog(false)}
          firebaseImageUrl={encodeStateForRedirect("/my-balance")}
        />
      )}

      {/* Pull-to-refresh indicator */}
      {refreshing && (
        <div style={{ textAlign: "center", padding: "8px 0", fontSize: "13px", color: "#888" }}>
          Refreshing…
        </div>
      )}

      {/* Header */}
      <div className="my-balance-header">
        <button className="back-button" onClick={handleBack} aria-label="Go back">
          <ArrowLeft size={24} />
        </button>
        <h1 className="page-title">My Balance</h1>
        <div style={{ width: "40px" }} />
      </div>

      {/* Balance Card */}
      <div className="balance-display-card">
        <div className="balance-label">Current Balance</div>
        <div className="balance-amount">${accountBalance.toFixed(2)}</div>
      </div>

      {/* Pending Request Warning */}
      {hasPendingRequest && !showSuccess && (
        <div style={{ background: "#fff3cd", border: "1px solid #ffc107", borderRadius: "12px", padding: "16px", marginBottom: "20px", textAlign: "center" }}>
          <div style={{ fontSize: "24px", marginBottom: "6px" }}>⏳</div>
          <div style={{ fontSize: "15px", fontWeight: "600", color: "#856404" }}>Pending Credit Request</div>
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
          <div className="success-subtext">Your credit will be added once approved by the admin.</div>
        </div>
      )}

      {/* Form — hidden while a request is pending */}
      {!hasPendingRequest && (
        <>
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

          <div className="payment-info-section">
            <div className="section-title">Payment Information</div>
            {[
              { label: "PayPal", value: "13817276240@163.com" },
              { label: "Venmo",  value: "@Huifang-Qin" },
              { label: "Zelle",  value: "5107389532" },
            ].map(({ label, value }) => (
              <div className="payment-info-row" key={label}>
                <span className="payment-label">{label}</span>
                <span className="payment-value">
                  {value}
                  <button className="copy-btn" onClick={() => handleCopy(value)}>
                    <Copy size={14} /> Copy
                  </button>
                </span>
              </div>
            ))}
          </div>

          <div className="screenshot-upload-section">
            <div className="section-title">
              After making credit payment, please upload payment screenshot by clicking the box below:
            </div>

            {!uploadPreview ? (
              <div
                {...getRootProps()}
                className={`upload-dropzone ${isDragActive ? "drag-active" : ""}`}
              >
                <input {...getInputProps()} />
                <div className="upload-icon"><ImageIcon size={40} color="#999" /></div>
                <div className="upload-text">
                  {isDragActive ? "Drop your image here..." : "Tap to upload or drag & drop"}
                </div>
                <div className="upload-hint">JPG, PNG, GIF • Max 10MB</div>
              </div>
            ) : (
              <div className="upload-preview-container">
                <img src={uploadPreview} alt="Payment screenshot" />
                <button className="remove-btn" onClick={removeImage}><X size={18} /></button>
              </div>
            )}

            {isUploading && <div className="upload-status uploading">⏳ Uploading...</div>}
            {firebaseImageUrl && !isUploading && <div className="upload-status success">✅ Upload complete</div>}
            {uploadError && <div className="upload-status error">❌ {uploadError}</div>}
          </div>

          <button
            className="add-credit-btn"
            onClick={handleAddCredit}
            disabled={isSubmitting || isUploading || !firebaseImageUrl || !creditAmount || parseFloat(creditAmount) <= 0}
          >
            {isSubmitting ? "Processing..." : "Add Credit"}
          </button>
        </>
      )}
    </div>
  );
}
