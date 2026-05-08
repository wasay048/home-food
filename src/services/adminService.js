import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  deleteDoc,
  writeBatch,
  serverTimestamp,
  Timestamp,
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

// ─── Balance Adjustment (Transactions) Management ───────────────────────────

/**
 * Fetch ALL balance adjustment (transaction) records, sorted by timestamp desc.
 * For the admin Transactions tab — full CRUD over `balanceAdjustment`.
 */
export const getAllBalanceAdjustments = async () => {
  try {
    const adjRef = collection(db, "balanceAdjustment");
    const snapshot = await getDocs(adjRef);

    const txns = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

    txns.sort((a, b) => {
      const dateA = a.timestamp?.toDate
        ? a.timestamp.toDate()
        : new Date(a.timestamp || 0);
      const dateB = b.timestamp?.toDate
        ? b.timestamp.toDate()
        : new Date(b.timestamp || 0);
      return dateB - dateA;
    });

    return txns;
  } catch (error) {
    console.error("[AdminService] Error fetching balance adjustments:", error);
    throw error;
  }
};

/**
 * Update a single balance adjustment document. Only the listed fields are
 * persisted to keep writes safe.
 */
export const updateBalanceAdjustment = async (id, updates) => {
  if (!id) throw new Error("Transaction id is required");

  const allowed = {};
  if (updates.balanceSent !== undefined) {
    const num = Number(updates.balanceSent);
    if (Number.isNaN(num)) throw new Error("balanceSent must be a number");
    allowed.balanceSent = num;
  }
  if (updates.senderUserID !== undefined) {
    allowed.senderUserID = String(updates.senderUserID || "").trim();
  }
  if (updates.receiverUserID !== undefined) {
    allowed.receiverUserID = String(updates.receiverUserID || "").trim();
  }
  if (updates.reason !== undefined) {
    allowed.reason = updates.reason ? String(updates.reason) : null;
  }
  if (updates.timestamp instanceof Date) {
    allowed.timestamp = Timestamp.fromDate(updates.timestamp);
  }

  allowed.lastEditedAt = serverTimestamp();
  allowed.lastEditedBy = "admin";

  try {
    const ref = doc(db, "balanceAdjustment", id);
    await updateDoc(ref, allowed);
    const fresh = await getDoc(ref);
    return { id: fresh.id, ...fresh.data() };
  } catch (error) {
    console.error("[AdminService] Error updating balance adjustment:", error);
    throw error;
  }
};

/**
 * Delete a balance adjustment document.
 */
export const deleteBalanceAdjustment = async (id) => {
  if (!id) throw new Error("Transaction id is required");
  try {
    await deleteDoc(doc(db, "balanceAdjustment", id));
    return true;
  } catch (error) {
    console.error("[AdminService] Error deleting balance adjustment:", error);
    throw error;
  }
};

/**
 * Delete many balance adjustment documents in batched writes.
 * Firestore caps a batch at 500 operations, so we chunk automatically.
 * Returns { deleted, failed } counts.
 */
export const deleteBalanceAdjustmentsBulk = async (ids) => {
  const list = (ids || []).filter(Boolean);
  if (list.length === 0) return { deleted: 0, failed: 0 };

  const CHUNK = 450; // safely below Firestore's 500-op batch limit
  let deleted = 0;
  let failed = 0;

  for (let i = 0; i < list.length; i += CHUNK) {
    const slice = list.slice(i, i + CHUNK);
    const batch = writeBatch(db);
    slice.forEach((id) => {
      batch.delete(doc(db, "balanceAdjustment", id));
    });
    try {
      await batch.commit();
      deleted += slice.length;
    } catch (error) {
      console.error(
        "[AdminService] Bulk delete batch failed:",
        error,
        "ids:",
        slice,
      );
      failed += slice.length;
    }
  }

  if (failed > 0 && deleted === 0) {
    throw new Error(`Failed to delete ${failed} transaction(s).`);
  }
  return { deleted, failed };
};

/**
 * Fetch a lightweight map of every kitchen → identifying user ID.
 * The collection's senderUserID / receiverUserID fields are user IDs, but
 * since each kitchen is owned by one user account, we expose kitchens as
 * a friendlier filter on the admin Transactions tab.
 */
export const getKitchenDirectory = async () => {
  try {
    const kitchensRef = collection(db, "kitchens");
    const snap = await getDocs(kitchensRef);
    return snap.docs.map((d) => {
      const data = d.data() || {};
      return {
        id: d.id,
        name: data.name || data.kitchenName || "Unnamed Kitchen",
        ownerId: data.ownerId || data.ownerID || null,
        // The user ID associated with this kitchen for transaction matching.
        // Most kitchens use kitchen.id === userId; fall back to ownerId.
        userId: d.id || data.ownerId || data.ownerID || null,
        city: data.city || null,
      };
    });
  } catch (error) {
    console.error("[AdminService] Error fetching kitchens directory:", error);
    throw error;
  }
};

/**
 * Fetch a lightweight map of every account → display name.
 * Used by AdminTransactionsTab to resolve sender/receiver IDs to names.
 */
export const getAccountsDirectory = async () => {
  try {
    const accountsRef = collection(db, "accounts");
    const snap = await getDocs(accountsRef);
    const map = {};
    snap.docs.forEach((d) => {
      const data = d.data() || {};
      map[d.id] = {
        id: d.id,
        name: data.name || data.wechatNickname || data.email || null,
        email: data.email || null,
        cellPhone: data.cellPhone || null,
      };
    });
    return map;
  } catch (error) {
    console.error("[AdminService] Error fetching accounts directory:", error);
    throw error;
  }
};

/**
 * Fetch ALL orders across all users, sorted by datePlaced desc.
 * For "Orders by Kitchen" and other global admin views.
 */
export const getAllAdminOrders = async () => {
  try {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      orderBy("datePlaced", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error("[AdminService] Error fetching all orders:", error);
    throw error;
  }
};
