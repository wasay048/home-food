import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Admin Service — Firestore queries for debugging user balance & order issues.
 * All functions read-only; no writes.
 */

// ─── User Lookup ────────────────────────────────────────────────────────────

/**
 * Fetch all user accounts, optionally filtered to those with balance > 0.
 * Returns users sorted by accountBalance descending.
 */
export const getAllUsers = async ({ onlyWithBalance = false } = {}) => {
  try {
    const accountsRef = collection(db, "accounts");
    const snapshot = await getDocs(accountsRef);

    let users = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    if (onlyWithBalance) {
      users = users.filter((u) => (u.accountBalance || 0) > 0);
    }

    // Sort by balance descending
    users.sort((a, b) => (b.accountBalance || 0) - (a.accountBalance || 0));

    return users;
  } catch (error) {
    console.error("[AdminService] Error fetching users:", error);
    throw error;
  }
};

/**
 * Search users by name, email, or user ID (case-insensitive client-side filter).
 */
export const searchUsers = async (searchTerm) => {
  try {
    if (!searchTerm || !searchTerm.trim()) {
      return getAllUsers();
    }

    const term = searchTerm.trim().toLowerCase();
    const allUsers = await getAllUsers();

    return allUsers.filter((user) => {
      const name = (user.name || user.wechatNickname || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      const id = (user.id || "").toLowerCase();
      const cellPhone = (user.cellPhone || "").toLowerCase();

      return (
        name.includes(term) ||
        email.includes(term) ||
        id.includes(term) ||
        cellPhone.includes(term)
      );
    });
  } catch (error) {
    console.error("[AdminService] Error searching users:", error);
    throw error;
  }
};

/**
 * Fetch a single user's full profile from the accounts collection.
 */
export const getUserFullProfile = async (userId) => {
  try {
    const accountRef = doc(db, "accounts", userId);
    const accountSnap = await getDoc(accountRef);

    if (!accountSnap.exists()) {
      return null;
    }

    return { id: accountSnap.id, ...accountSnap.data() };
  } catch (error) {
    console.error("[AdminService] Error fetching user profile:", error);
    throw error;
  }
};

// ─── Order History ──────────────────────────────────────────────────────────

/**
 * Fetch ALL orders for a given user, sorted by datePlaced desc.
 * Includes payment breakdown fields: paidFromBalance, paidFromOnline, balanceUsed, etc.
 */
export const getAdminUserOrders = async (userId) => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("userId", "==", userId),
      orderBy("datePlaced", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("[AdminService] Error fetching user orders:", error);
    throw error;
  }
};

// ─── Balance History ────────────────────────────────────────────────────────

/**
 * Reconstruct full balance history for a user from the balanceAdjustment collection.
 * Fetches both sent and received entries, merges and sorts chronologically.
 *
 * Each entry is tagged with:
 *   - direction: "credit" | "debit"
 *   - category: "order_payment" | "refund" | "admin_credit" | "peer_transfer" | "unknown"
 */
export const getUserBalanceHistory = async (userId) => {
  try {
    const balanceRef = collection(db, "balanceAdjustment");

    // Outgoing (user is sender)
    const senderQuery = query(
      balanceRef,
      where("senderUserID", "==", userId)
    );
    // Incoming (user is receiver)
    const receiverQuery = query(
      balanceRef,
      where("receiverUserID", "==", userId)
    );

    const [senderSnap, receiverSnap] = await Promise.all([
      getDocs(senderQuery),
      getDocs(receiverQuery),
    ]);

    const entries = [];

    senderSnap.forEach((d) => {
      const data = d.data();
      const amount = data.balanceSent || 0;

      // Negative balanceSent from senderUserID === user means balance was used (debit)
      entries.push({
        id: d.id,
        direction: amount < 0 ? "debit" : "credit",
        amount: Math.abs(amount),
        rawAmount: amount,
        otherUserId: data.receiverUserID,
        category: categorizeTransaction(data, "sender"),
        timestamp: data.timestamp,
        ...data,
      });
    });

    receiverSnap.forEach((d) => {
      const data = d.data();
      const amount = data.balanceSent || 0;

      entries.push({
        id: d.id,
        direction: "credit",
        amount: Math.abs(amount),
        rawAmount: amount,
        otherUserId: data.senderUserID,
        category: categorizeTransaction(data, "receiver"),
        timestamp: data.timestamp,
        ...data,
      });
    });

    // Sort by timestamp descending (newest first)
    entries.sort((a, b) => {
      const dateA = a.timestamp?.toDate
        ? a.timestamp.toDate()
        : new Date(a.timestamp || 0);
      const dateB = b.timestamp?.toDate
        ? b.timestamp.toDate()
        : new Date(b.timestamp || 0);
      return dateB - dateA;
    });

    return entries;
  } catch (error) {
    console.error("[AdminService] Error fetching balance history:", error);
    throw error;
  }
};

/**
 * Categorize a balanceAdjustment transaction.
 */
function categorizeTransaction(data, role) {
  const receiver = data.receiverUserID || "";
  const sender = data.senderUserID || "";
  const amount = data.balanceSent || 0;

  // Order payment: sender is user, receiver is "system", amount is negative
  if (receiver === "system" && amount < 0) {
    return "order_payment";
  }

  // Refund or admin credit: if sender is "system" or admin-like
  if (sender === "system" || sender === "admin") {
    return "admin_credit";
  }

  // Peer transfer
  if (role === "sender" && receiver !== "system") {
    return "peer_transfer";
  }
  if (role === "receiver" && sender !== "system") {
    return "peer_transfer";
  }

  return "unknown";
}

// ─── Credit Requests ────────────────────────────────────────────────────────

/**
 * Fetch all credit requests for a user from the `credit` collection.
 * Sorted by createdAt descending.
 */
export const getUserCreditRequests = async (userId) => {
  try {
    const creditRef = collection(db, "credit");
    const q = query(creditRef, where("userId", "==", userId));

    const snapshot = await getDocs(q);

    const requests = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    // Sort by createdAt descending
    requests.sort((a, b) => {
      const dateA = a.createdAt?.toDate
        ? a.createdAt.toDate()
        : new Date(a.createdAt || 0);
      const dateB = b.createdAt?.toDate
        ? b.createdAt.toDate()
        : new Date(b.createdAt || 0);
      return dateB - dateA;
    });

    return requests;
  } catch (error) {
    console.error("[AdminService] Error fetching credit requests:", error);
    throw error;
  }
};

// ─── Summary Stats ──────────────────────────────────────────────────────────

/**
 * Compute summary statistics for a user (for the detail page header).
 */
export const getUserSummaryStats = async (userId) => {
  try {
    const [orders, balanceHistory, creditRequests, profile] = await Promise.all([
      getAdminUserOrders(userId),
      getUserBalanceHistory(userId),
      getUserCreditRequests(userId),
      getUserFullProfile(userId),
    ]);

    const totalOrders = orders.length;
    const totalSpent = orders.reduce(
      (sum, o) => sum + (parseFloat(o.orderTotalCoast) || 0),
      0
    );
    const totalPaidFromBalance = orders.reduce(
      (sum, o) => sum + (parseFloat(o.paidFromBalance) || 0),
      0
    );
    const totalPaidOnline = orders.reduce(
      (sum, o) => sum + (parseFloat(o.paidFromOnline) || 0),
      0
    );
    const totalBalanceUsed = orders.reduce(
      (sum, o) => sum + (parseFloat(o.balanceUsed) || 0),
      0
    );

    const totalCreditsReceived = balanceHistory
      .filter((e) => e.direction === "credit")
      .reduce((sum, e) => sum + e.amount, 0);

    const totalDebits = balanceHistory
      .filter((e) => e.direction === "debit")
      .reduce((sum, e) => sum + e.amount, 0);

    const pendingCreditRequests = creditRequests.filter(
      (r) => r.status === "pending"
    ).length;
    const approvedCreditRequests = creditRequests.filter(
      (r) => r.status === "approved"
    ).length;
    const totalCreditRequestAmount = creditRequests.reduce(
      (sum, r) => sum + (r.amount || 0),
      0
    );

    return {
      profile,
      totalOrders,
      totalSpent,
      totalPaidFromBalance,
      totalPaidOnline,
      totalBalanceUsed,
      totalCreditsReceived,
      totalDebits,
      pendingCreditRequests,
      approvedCreditRequests,
      totalCreditRequestAmount,
      currentBalance: profile?.accountBalance || 0,
      orders,
      balanceHistory,
      creditRequests,
    };
  } catch (error) {
    console.error("[AdminService] Error computing summary stats:", error);
    throw error;
  }
};
