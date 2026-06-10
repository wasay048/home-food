import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Scale,
  ArrowLeftRight,
  Info,
} from "lucide-react";
import { db } from "../services/firebase";
import MobileLoader from "../components/Loader/MobileLoader";
import dayjs from "../lib/dayjs";
import "../styles/index.css";

/**
 * Fetch a user's account balance from the accounts collection.
 * Port of iOS fetchUserBalance(userId:completion:).
 */
async function fetchUserBalance(userId) {
  if (!userId) {
    throw new Error("User ID is empty");
  }
  const userRef = doc(db, "accounts", userId);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) {
    throw new Error("User not found");
  }
  return snapshot.data()?.accountBalance ?? 0.0;
}

/**
 * Fetch all balanceAdjustment records where the user is sender or receiver.
 * Port of iOS fetchTransactions(for:).
 */
async function fetchTransactions(userId) {
  const balanceRef = collection(db, "balanceAdjustment");

  // Query 1: where user is the sender
  const senderQuery = query(balanceRef, where("senderUserID", "==", userId));
  // Query 2: where user is the receiver
  const receiverQuery = query(
    balanceRef,
    where("receiverUserID", "==", userId),
  );

  const [senderSnap, receiverSnap] = await Promise.all([
    getDocs(senderQuery),
    getDocs(receiverQuery),
  ]);

  const allRecords = [];

  senderSnap.forEach((docSnap) => {
    const data = docSnap.data();
    const sender = data.senderUserID ?? "";
    const receiver = data.receiverUserID ?? "";
    const isOrderPayment = data.isOrderPayment ?? false;

    // Skip the chef's copy of the transaction if the user is the sender (buyer),
    // since the user already has userAdjRecord where receiverUserID is "system".
    if (sender === userId && receiver !== "system" && isOrderPayment) {
      return;
    }

    allRecords.push({
      id: docSnap.id,
      senderUserID: sender,
      receiverUserID: receiver,
      balanceSent: data.balanceSent ?? 0.0,
      timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(),
      orderNumber: data.orderNumber,
      itemName: data.itemName,
      prepaidAmount: data.prepaidAmount,
      editedPoundsInOneOrder: data.editedPoundsInOneOrder,
      perPoundPrice: data.perPoundPrice,
      paymentDue: data.paymentDue,
      isVariableWeightAdjustment: data.isVariableWeightAdjustment,
      isQuantityAdjustment: data.isQuantityAdjustment,
      originalQuantity: data.originalQuantity,
      originalPounds: data.originalPounds,
      isOrderPayment: isOrderPayment,
      orderItemsSummary: data.orderItemsSummary,
    });
  });

  receiverSnap.forEach((docSnap) => {
    // Skip duplicates (same doc already fetched from sender query)
    if (allRecords.some((r) => r.id === docSnap.id)) return;
    const data = docSnap.data();
    allRecords.push({
      id: docSnap.id,
      senderUserID: data.senderUserID ?? "",
      receiverUserID: data.receiverUserID ?? "",
      balanceSent: data.balanceSent ?? 0.0,
      timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : new Date(),
      orderNumber: data.orderNumber,
      itemName: data.itemName,
      prepaidAmount: data.prepaidAmount,
      editedPoundsInOneOrder: data.editedPoundsInOneOrder,
      perPoundPrice: data.perPoundPrice,
      paymentDue: data.paymentDue,
      isVariableWeightAdjustment: data.isVariableWeightAdjustment,
      isQuantityAdjustment: data.isQuantityAdjustment,
      originalQuantity: data.originalQuantity,
      originalPounds: data.originalPounds,
      isOrderPayment: data.isOrderPayment,
      orderItemsSummary: data.orderItemsSummary,
    });
  });

  return allRecords.sort((a, b) => b.timestamp - a.timestamp);
}

export default function TransactionHistoryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
   const currentUser = useSelector((state) => state.auth.user);
  // const currentUser = { id: "5MhENXvWZ8QYsavYrvNCoFTnIA82" }; // Husnain
  // const currentUser = { id: "ao5qvI8dSjZI52Wf2hrR8vWL37s1" }; // James

  // Target user for viewing history (if provided) — mirrors iOS targetUserId
  const targetUserId = searchParams.get("userId") || null;
  const targetUserName = searchParams.get("userName") || null;

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(null);
  const [showInfoOverlay, setShowInfoOverlay] = useState(false);

  // Cache of other-party names — mirrors iOS userNames dictionary
  const [userNames, setUserNames] = useState({});

  // Pull-to-refresh (web analog of iOS .refreshable)
  const [refreshing, setRefreshing] = useState(false);
  const touchStartY = useRef(0);
  const containerRef = useRef(null);

  /**
   * Resolve a user's display name with the iOS hardcoded overrides.
   * Port of iOS fetchUserName(uid:).
   */
  const fetchUserName = useCallback(async (uid) => {
    if (!uid) return "Unknown";
    if (uid === "admin") return "Admin (Credit)";
    if (uid === "system") return "System (Order)";
    try {
      const accountRef = doc(db, "accounts", uid);
      const accountSnap = await getDoc(accountRef);
      if (accountSnap.exists()) {
        const data = accountSnap.data();
        return data.name || data.wechatNickname || data.email || "Unknown";
      }
      return "Unknown";
    } catch {
      return "Unknown";
    }
  }, []);

  const loadData = useCallback(async () => {
    const userId = targetUserId ?? currentUser?.id ?? "";
    if (!userId) {
      setLoading(false);
      setError("Please log in to view transactions");
      return;
    }

    try {
      const records = await fetchTransactions(userId);
      setTransactions(records);
      console.log(
        `✅ Fetched ${records.length} transactions for user ${userId}`,
      );

      // Resolve all other-party names (cached by uid)
      const uniqueIds = new Set();
      records.forEach((t) => {
        const isSender = t.senderUserID === userId;
        const otherPartyId = isSender ? t.receiverUserID : t.senderUserID;
        // Add even when empty so userNames[""] resolves to "Unknown" rather
        // than leaving a malformed row stuck on the "Loading..." fallback.
        uniqueIds.add(otherPartyId ?? "");
      });
      const nameEntries = await Promise.all(
        [...uniqueIds].map(async (uid) => [uid, await fetchUserName(uid)]),
      );
      setUserNames(Object.fromEntries(nameEntries));

      setError(null);
    } catch (err) {
      console.error("❌ Failed to fetch transactions:", err);
      setError("Failed to load transactions. Please try again.");
    }

    try {
      const balance = await fetchUserBalance(userId);
      setCurrentBalance(balance);
    } catch (err) {
      console.error("❌ Failed to fetch balance:", err);
    }
  }, [targetUserId, currentUser?.id, fetchUserName]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadData();
      setLoading(false);
    })();
  }, [loadData]);

  // Pull-to-refresh — refetches transactions and balance like iOS .refreshable
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const onTouchEnd = async (e) => {
      const delta = e.changedTouches[0].clientY - touchStartY.current;
      // The window is the scroll container (.mobile-container has no overflow),
      // so check window.scrollY, not el.scrollTop which is always 0 here.
      if (delta > 70 && window.scrollY === 0) {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
    // `loading` is a dep so listeners attach to the real container once the
    // loader's early-return tree is replaced after the first fetch.
  }, [loadData, loading]);

  /**
   * Format the timestamp for display — iOS "MMM d, yyyy h:mm a"
   */
  const formatTimestamp = (date) => {
    if (!date) return "";
    return dayjs(date).format("MMM D, YYYY h:mm A");
  };

  /**
   * Render one transaction row. Port of iOS transactionRow(_:).
   */
  const renderTransactionRow = (transaction) => {
    const currentUserId = targetUserId ?? currentUser?.id ?? "";

    const isSender = transaction.senderUserID === currentUserId;
    // For transactions against "system" (order payment, refund, past-due
    // settlement) `balanceSent` is already signed from the user's
    // perspective — negative means money left the account, positive means
    // it came in — so its sign is the source of truth. Order payments are
    // written with a negative `balanceSent` and the user as sender, which
    // the role-based rule below misreads as an incoming credit, showing a
    // debit as a green "+". Peer/manual transfers and weight adjustments
    // carry a positive magnitude with direction encoded by sender/receiver,
    // so those keep the role-based rule.
    const counterpartyIsSystem =
      transaction.senderUserID === "system" ||
      transaction.receiverUserID === "system";
    const myBalanceDecreased =
      counterpartyIsSystem && transaction.isVariableWeightAdjustment !== true
        ? transaction.balanceSent < 0
        : isSender === (transaction.balanceSent > 0);
    const isDeduction = myBalanceDecreased;
    const directionClass = myBalanceDecreased ? "outgoing" : "incoming";
    const amountPrefix = myBalanceDecreased ? "-" : "+";
    const otherPartyId = isSender
      ? transaction.receiverUserID
      : transaction.senderUserID;

    const otherPartyName = userNames[otherPartyId] ?? "Loading...";

    let directionLabel;
    if (transaction.isVariableWeightAdjustment === true) {
      // Weight-based delivery adjustment — already very specific, keep it
      directionLabel = `Weight Adj: ${transaction.itemName ?? "Item"}`;
    } else if (
      transaction.senderUserID === currentUserId &&
      transaction.receiverUserID === "system" &&
      transaction.isOrderPayment === true
    ) {
      // User paid for an order using their account balance
      directionLabel = "Balance Payment";
    } else if (transaction.isOrderPayment === true) {
      // Chef purchase session — user paid from balance at chef's POS
      if (currentUserId === transaction.receiverUserID) {
        directionLabel = "Chef Purchase Payment";
      } else {
        directionLabel = isDeduction
          ? "Chef Purchase Payment"
          : "Chef Purchase Refund";
      }
    } else if (
      transaction.senderUserID === "system" &&
      transaction.isOrderPayment !== true
    ) {
      // System refunded a canceled order back to the user
      directionLabel = "Order Refund";
    } else if (
      transaction.senderUserID === currentUserId &&
      transaction.receiverUserID === "system"
    ) {
      // Any other system deduction (catch-all)
      directionLabel = "Balance Payment";
    } else if (transaction.senderUserID === "system") {
      // Any other system credit (catch-all)
      directionLabel = "Order Refund";
    } else if (otherPartyId === "admin" || transaction.senderUserID === "admin") {
      // Admin manually credited the user's account
      directionLabel = "Admin Deposit";
    } else {
      // Manual balance transfer between chef and user
      directionLabel = isDeduction
        ? `Balance Deducted by ${otherPartyName}`
        : `Balance Added by ${otherPartyName}`;
    }

    const DirectionIcon =
      transaction.isVariableWeightAdjustment === true
        ? Scale
        : myBalanceDecreased
          ? ArrowUpRight
          : ArrowDownLeft;

    return (
      <div key={transaction.id} className="transaction-row-wrapper">
        <div className="transaction-row">
          {/* Direction icon */}
          <div className={`transaction-icon ${directionClass}`}>
            <DirectionIcon size={18} strokeWidth={2.5} />
          </div>

          {/* Details */}
          <div className="transaction-details">
            <div className="transaction-label">{directionLabel}</div>
            <div className="transaction-date">
              {formatTimestamp(transaction.timestamp)}
            </div>
          </div>

          {/* Amount: show absolute value with correct sign and color */}
          <div className={`transaction-amount ${directionClass}`}>
            {amountPrefix}${Math.abs(transaction.balanceSent).toFixed(2)}
          </div>
        </div>

        {/* Extended details for variable weight adjustments */}
        {transaction.isVariableWeightAdjustment === true && (
          <div className="transaction-extended-details">
            {transaction.orderNumber != null && (
              <div className="transaction-detail-primary">
                Order #{transaction.orderNumber},{" "}
                {transaction.originalQuantity ?? 1} x{" "}
                {transaction.itemName ?? ""}
              </div>
            )}
            {transaction.isQuantityAdjustment === true ? (
              <div className="transaction-detail-secondary">
                Prepaid {transaction.originalQuantity ?? 1} qty, Picked up{" "}
                {Math.trunc(transaction.editedPoundsInOneOrder ?? 1.0)} qty
              </div>
            ) : (
              <div className="transaction-detail-secondary">
                Prepaid{" "}
                {(
                  (transaction.originalQuantity ?? 1) *
                  (transaction.originalPounds ?? 3.0)
                ).toFixed(1)}{" "}
                lb, Picked up{" "}
                {(
                  (transaction.editedPoundsInOneOrder ?? 0.0) *
                  (transaction.originalQuantity ?? 1)
                ).toFixed(1)}{" "}
                lb
              </div>
            )}
            <div className="transaction-detail-secondary">
              Prepaid ${(transaction.prepaidAmount ?? 0.0).toFixed(2)}, Final
              Price $
              {(
                (transaction.prepaidAmount ?? 0.0) +
                (transaction.paymentDue ?? 0.0)
              ).toFixed(2)}
            </div>
          </div>
        )}

        {/* Extended details for order payment (balance used at checkout) */}
        {transaction.isOrderPayment === true &&
          transaction.orderNumber != null && (
            <div className="transaction-extended-details">
              <div className="transaction-detail-primary">
                {transaction.orderItemsSummary
                  ? `Order #${transaction.orderNumber}, ${transaction.orderItemsSummary}`
                  : `Order #${transaction.orderNumber}`}
              </div>
            </div>
          )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container">
        <div className="mobile-container">
          <MobileLoader
            isLoading={loading}
            text="Loading transactions..."
            overlay={true}
            size="medium"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="mobile-container" ref={containerRef}>
        <div className="transaction-history-page">
          {/* Pull-to-refresh indicator */}
          {refreshing && (
            <div className="transaction-refresh-indicator">Refreshing…</div>
          )}

          {/* Header */}
          <div className="my-orders-header">
            <button
              className="back-button"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="#333"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <h1 className="page-title">
              {targetUserId
                ? `${targetUserName ?? "User"} History`
                : "Transaction History"}
            </h1>
            <div style={{ width: "24px" }}></div>
          </div>

          {/* Current balance banner — pinned at the top of the page for both
              the user's own history and a target user's history (chef mode),
              matching the iOS layout */}
          {!error && (
            <div className="transaction-balance-banner">
              <span className="banner-label">
                Current Balance
                <button
                  className="banner-info-btn"
                  onClick={() => setShowInfoOverlay(true)}
                  aria-label="Transaction info"
                >
                  <Info size={16} />
                </button>
              </span>
              {currentBalance != null ? (
                <span
                  className={`banner-amount ${
                    currentBalance >= 0 ? "positive" : "negative"
                  }`}
                >
                  {currentBalance < 0
                    ? `-$${Math.abs(currentBalance).toFixed(2)}`
                    : `$${currentBalance.toFixed(2)}`}
                </span>
              ) : (
                <span className="banner-amount">…</span>
              )}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="orders-empty">
              <p>{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!error && transactions.length === 0 && (
            <div className="orders-empty transaction-empty-state">
              <ArrowLeftRight size={50} color="rgba(141, 147, 161, 0.5)" />
              <p>No transactions yet</p>
            </div>
          )}

          {/* Transactions List */}
          {!error && transactions.length > 0 && (
            <>
              <div className="transactions-list">
                {transactions.map((transaction) =>
                  renderTransactionRow(transaction),
                )}
              </div>
            </>
          )}

          {/* Info overlay — port of iOS infoOverlay ToastView */}
          {showInfoOverlay && (
            <div
              className="transaction-info-overlay"
              onClick={() => setShowInfoOverlay(false)}
            >
              <div
                className="transaction-info-card"
                onClick={(e) => e.stopPropagation()}
              >
                <h3>Information</h3>
                <p>
                  {'"Prepay order canceled" indicates an automatic deduction ' +
                    "or addition for a placed order."}
                </p>
                <p>
                  {'"Received from" or "Sent to" indicates a manual balance ' +
                    "transfer between users."}
                </p>
                <p>
                  {'"Weight Adj" indicates an automatic balance refund or ' +
                    "charge for a variable-weight food item after exact weighing."}
                </p>
                <button
                  className="transaction-info-close-btn"
                  onClick={() => setShowInfoOverlay(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
