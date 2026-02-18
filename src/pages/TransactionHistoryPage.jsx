import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "../services/firebase";
import MobileLoader from "../components/Loader/MobileLoader";
import dayjs from "../lib/dayjs";
import "../styles/index.css";

export default function TransactionHistoryPage() {
  const navigate = useNavigate();
   const currentUser = useSelector((state) => state.auth.user);
  // const currentUser = { id: "5MhENXvWZ8QYsavYrvNCoFTnIA82" };

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cache for user names so we don't fetch the same user multiple times
  const [userNames, setUserNames] = useState({});

  /**
   * Fetch user name from accounts collection
   */
  const fetchUserName = useCallback(
    async (userId) => {
      if (!userId) return "Unknown User";
      if (userNames[userId]) return userNames[userId];

      try {
        const accountRef = doc(db, "accounts", userId);
        const accountSnap = await getDoc(accountRef);

        if (accountSnap.exists()) {
          const data = accountSnap.data();
          const name = data.name || data.wechatNickname || data.email || "Unknown User";
          setUserNames((prev) => ({ ...prev, [userId]: name }));
          return name;
        }
        return "Unknown User";
      } catch (err) {
        console.error("Error fetching user name:", err);
        return "Unknown User";
      }
    },
    [userNames]
  );

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!currentUser?.id) {
        setLoading(false);
        setError("Please log in to view transactions");
        return;
      }

      try {
        setLoading(true);
        const userId = currentUser.id;
        const balanceRef = collection(db, "balanceAdjustment");

        // Query for transactions where user is sender
        const senderQuery = query(
          balanceRef,
          where("senderUserID", "==", userId)
        );
        // Query for transactions where user is receiver
        const receiverQuery = query(
          balanceRef,
          where("receiverUserID", "==", userId)
        );

        const [senderSnap, receiverSnap] = await Promise.all([
          getDocs(senderQuery),
          getDocs(receiverQuery),
        ]);

        const allTransactions = [];

        // Process sent transactions (outgoing)
        senderSnap.forEach((docSnap) => {
          const data = docSnap.data();
          allTransactions.push({
            id: docSnap.id,
            type: "outgoing",
            amount: data.balanceSent || 0,
            otherUserId: data.receiverUserID,
            timestamp: data.timestamp,
            ...data,
          });
        });

        // Process received transactions (incoming)
        receiverSnap.forEach((docSnap) => {
          const data = docSnap.data();
          allTransactions.push({
            id: docSnap.id,
            type: "incoming",
            amount: data.balanceSent || 0,
            otherUserId: data.senderUserID,
            timestamp: data.timestamp,
            ...data,
          });
        });

        // Sort by timestamp descending (newest first)
        allTransactions.sort((a, b) => {
          const dateA = a.timestamp?.toDate
            ? a.timestamp.toDate()
            : new Date(a.timestamp);
          const dateB = b.timestamp?.toDate
            ? b.timestamp.toDate()
            : new Date(b.timestamp);
          return dateB - dateA;
        });

        setTransactions(allTransactions);

        // Fetch all unique user names
        const uniqueUserIds = new Set();
        allTransactions.forEach((t) => {
          if (t.otherUserId) uniqueUserIds.add(t.otherUserId);
        });

        const nameCache = {};
        for (const uid of uniqueUserIds) {
          try {
            const accountRef = doc(db, "accounts", uid);
            const accountSnap = await getDoc(accountRef);
            if (accountSnap.exists()) {
              const data = accountSnap.data();
              nameCache[uid] =
                data.name || data.wechatNickname || data.email || "Unknown User";
            } else {
              nameCache[uid] = "Unknown User";
            }
          } catch {
            nameCache[uid] = "Unknown User";
          }
        }
        setUserNames(nameCache);

        setError(null);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transactions. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [currentUser?.id]);

  /**
   * Format the timestamp for display
   */
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
    return dayjs(date).format("MMM D, YYYY h:mm A");
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
      <div className="mobile-container">
        <div className="transaction-history-page">
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
            <h1 className="page-title">Transaction History</h1>
            <div style={{ width: "24px" }}></div>
          </div>

          {/* Error State */}
          {error && (
            <div className="orders-empty">
              <p>{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!error && transactions.length === 0 && (
            <div className="orders-empty">
              <p>No transactions found.</p>
            </div>
          )}

          {/* Transactions List */}
          {!error && transactions.length > 0 && (
            <div className="transactions-list">
              {transactions.map((transaction) => {
                const isIncoming = transaction.type === "incoming";
                const otherUserName =
                  userNames[transaction.otherUserId] || "Unknown User";

                return (
                  <div key={transaction.id} className="transaction-row">
                    {/* Icon */}
                    <div
                      className={`transaction-icon ${
                        isIncoming ? "incoming" : "outgoing"
                      }`}
                    >
                      {isIncoming ? (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 5V19"
                            stroke="#3fc045"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5 12L12 19L19 12"
                            stroke="#3fc045"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 19V5"
                            stroke="#e74c3c"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5 12L12 5L19 12"
                            stroke="#e74c3c"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Details */}
                    <div className="transaction-details">
                      <div className="transaction-label">
                        {isIncoming
                          ? `Received from ${otherUserName}`
                          : `Sent to ${otherUserName}`}
                      </div>
                      <div className="transaction-date">
                        {formatTimestamp(transaction.timestamp)}
                      </div>
                    </div>

                    {/* Amount */}
                    <div
                      className={`transaction-amount ${
                        isIncoming ? "incoming" : "outgoing"
                      }`}
                    >
                      {isIncoming ? "+" : "-"}${transaction.amount.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
