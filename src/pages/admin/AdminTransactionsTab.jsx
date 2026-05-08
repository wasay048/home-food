import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  getAllBalanceAdjustments,
  updateBalanceAdjustment,
  deleteBalanceAdjustment,
  deleteBalanceAdjustmentsBulk,
  getKitchenDirectory,
  getAccountsDirectory,
} from "../../services/adminService";
import dayjs from "../../lib/dayjs";
import "./AdminDashboard.css";

const SYSTEM_IDS = new Set(["system", "admin"]);

const formatTs = (ts) => {
  if (!ts) return "—";
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  return dayjs(d).format("MMM D, YYYY h:mm A");
};

const tsToDate = (ts) => {
  if (!ts) return null;
  return ts?.toDate ? ts.toDate() : new Date(ts);
};

const tsToInputValue = (ts) => {
  const d = tsToDate(ts);
  if (!d || Number.isNaN(d.getTime())) return "";
  // yyyy-MM-ddTHH:mm
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
};

const resolveDisplayName = (id, accountsMap, kitchenByUserId) => {
  if (!id) return "—";
  if (SYSTEM_IDS.has(id)) return "Admin / System";
  const acct = accountsMap[id];
  const kitchen = kitchenByUserId[id];
  const baseName = acct?.name || "Unknown User";
  if (kitchen) return `${baseName} · 🏪 ${kitchen.name}`;
  return baseName;
};

export default function AdminTransactionsTab() {
  const [transactions, setTransactions] = useState([]);
  const [accountsMap, setAccountsMap] = useState({});
  const [kitchens, setKitchens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [selectedKitchenId, setSelectedKitchenId] = useState("ALL");
  const [kitchenSide, setKitchenSide] = useState("BOTH"); // BOTH | SENDER | RECEIVER
  const [direction, setDirection] = useState("ALL"); // ALL | CREDIT | DEBIT
  const [searchTerm, setSearchTerm] = useState("");
  const [amountMin, setAmountMin] = useState("");
  const [amountMax, setAmountMax] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortBy, setSortBy] = useState("date_desc"); // date_desc | date_asc | amount_desc | amount_asc

  // Modals
  const [editingTxn, setEditingTxn] = useState(null);
  const [deletingTxn, setDeletingTxn] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState(null);

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [bulkConfirmOpen, setBulkConfirmOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [bulkResult, setBulkResult] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const [txns, kitchensList, accounts] = await Promise.all([
        getAllBalanceAdjustments(),
        getKitchenDirectory(),
        getAccountsDirectory(),
      ]);
      setTransactions(txns);
      setKitchens(kitchensList);
      setAccountsMap(accounts);
      setSelectedIds(new Set());
      setError(null);
    } catch (err) {
      console.error("[AdminTransactionsTab] Failed to load data:", err);
      setError(err.message || "Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const kitchenByUserId = useMemo(() => {
    const map = {};
    kitchens.forEach((k) => {
      if (k.userId) map[k.userId] = k;
      if (k.ownerId) map[k.ownerId] = k;
    });
    return map;
  }, [kitchens]);

  const selectedKitchenUserIds = useMemo(() => {
    if (selectedKitchenId === "ALL") return null;
    const k = kitchens.find((kk) => kk.id === selectedKitchenId);
    if (!k) return new Set();
    const ids = new Set();
    if (k.userId) ids.add(k.userId);
    if (k.ownerId) ids.add(k.ownerId);
    if (k.id) ids.add(k.id);
    return ids;
  }, [kitchens, selectedKitchenId]);

  const filteredTxns = useMemo(() => {
    let result = transactions;

    if (selectedKitchenUserIds) {
      result = result.filter((t) => {
        const sender = t.senderUserID;
        const receiver = t.receiverUserID;
        if (kitchenSide === "SENDER")
          return selectedKitchenUserIds.has(sender);
        if (kitchenSide === "RECEIVER")
          return selectedKitchenUserIds.has(receiver);
        return (
          selectedKitchenUserIds.has(sender) ||
          selectedKitchenUserIds.has(receiver)
        );
      });
    }

    if (direction === "CREDIT") {
      result = result.filter((t) => (t.balanceSent || 0) >= 0);
    } else if (direction === "DEBIT") {
      result = result.filter((t) => (t.balanceSent || 0) < 0);
    }

    const minAmt = amountMin === "" ? null : parseFloat(amountMin);
    const maxAmt = amountMax === "" ? null : parseFloat(amountMax);
    if (minAmt !== null && !Number.isNaN(minAmt)) {
      result = result.filter(
        (t) => Math.abs(t.balanceSent || 0) >= minAmt,
      );
    }
    if (maxAmt !== null && !Number.isNaN(maxAmt)) {
      result = result.filter(
        (t) => Math.abs(t.balanceSent || 0) <= maxAmt,
      );
    }

    if (dateFrom) {
      const from = new Date(dateFrom).getTime();
      result = result.filter((t) => {
        const d = tsToDate(t.timestamp);
        return d ? d.getTime() >= from : false;
      });
    }
    if (dateTo) {
      const to = new Date(dateTo).getTime() + 24 * 60 * 60 * 1000 - 1;
      result = result.filter((t) => {
        const d = tsToDate(t.timestamp);
        return d ? d.getTime() <= to : false;
      });
    }

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      result = result.filter((t) => {
        const sender = t.senderUserID || "";
        const receiver = t.receiverUserID || "";
        const senderName = resolveDisplayName(
          sender,
          accountsMap,
          kitchenByUserId,
        ).toLowerCase();
        const receiverName = resolveDisplayName(
          receiver,
          accountsMap,
          kitchenByUserId,
        ).toLowerCase();
        const reason = (t.reason || "").toLowerCase();
        return (
          sender.toLowerCase().includes(term) ||
          receiver.toLowerCase().includes(term) ||
          senderName.includes(term) ||
          receiverName.includes(term) ||
          reason.includes(term) ||
          (t.id || "").toLowerCase().includes(term)
        );
      });
    }

    const sorted = [...result];
    switch (sortBy) {
      case "date_asc":
        sorted.sort((a, b) => {
          const da = tsToDate(a.timestamp)?.getTime() || 0;
          const db = tsToDate(b.timestamp)?.getTime() || 0;
          return da - db;
        });
        break;
      case "amount_desc":
        sorted.sort(
          (a, b) =>
            Math.abs(b.balanceSent || 0) - Math.abs(a.balanceSent || 0),
        );
        break;
      case "amount_asc":
        sorted.sort(
          (a, b) =>
            Math.abs(a.balanceSent || 0) - Math.abs(b.balanceSent || 0),
        );
        break;
      case "date_desc":
      default:
        sorted.sort((a, b) => {
          const da = tsToDate(a.timestamp)?.getTime() || 0;
          const db = tsToDate(b.timestamp)?.getTime() || 0;
          return db - da;
        });
    }
    return sorted;
  }, [
    transactions,
    selectedKitchenUserIds,
    kitchenSide,
    direction,
    amountMin,
    amountMax,
    dateFrom,
    dateTo,
    searchTerm,
    sortBy,
    accountsMap,
    kitchenByUserId,
  ]);

  const stats = useMemo(() => {
    const total = filteredTxns.length;
    let inflow = 0;
    let outflow = 0;
    filteredTxns.forEach((t) => {
      const amt = t.balanceSent || 0;
      if (amt >= 0) inflow += amt;
      else outflow += Math.abs(amt);
    });
    return {
      total,
      inflow,
      outflow,
      net: inflow - outflow,
    };
  }, [filteredTxns]);

  const clearFilters = () => {
    setSelectedKitchenId("ALL");
    setKitchenSide("BOTH");
    setDirection("ALL");
    setSearchTerm("");
    setAmountMin("");
    setAmountMax("");
    setDateFrom("");
    setDateTo("");
    setSortBy("date_desc");
  };

  const openEdit = (txn) => {
    setActionError(null);
    setEditingTxn({
      id: txn.id,
      balanceSent: String(txn.balanceSent ?? ""),
      senderUserID: txn.senderUserID || "",
      receiverUserID: txn.receiverUserID || "",
      reason: txn.reason || "",
      timestamp: tsToInputValue(txn.timestamp),
      _original: txn,
    });
  };

  const saveEdit = async () => {
    if (!editingTxn) return;
    setActionError(null);
    setSavingEdit(true);
    try {
      const payload = {
        balanceSent: parseFloat(editingTxn.balanceSent),
        senderUserID: editingTxn.senderUserID,
        receiverUserID: editingTxn.receiverUserID,
        reason: editingTxn.reason,
      };
      if (Number.isNaN(payload.balanceSent)) {
        throw new Error("Amount must be a valid number.");
      }
      if (!payload.senderUserID || !payload.receiverUserID) {
        throw new Error("Sender and receiver are required.");
      }
      if (editingTxn.timestamp) {
        const d = new Date(editingTxn.timestamp);
        if (!Number.isNaN(d.getTime())) payload.timestamp = d;
      }
      await updateBalanceAdjustment(editingTxn.id, payload);
      setEditingTxn(null);
      await refresh();
    } catch (err) {
      console.error("[AdminTransactionsTab] Save edit failed:", err);
      setActionError(err.message || "Failed to update transaction.");
    } finally {
      setSavingEdit(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingTxn) return;
    setActionError(null);
    setDeleting(true);
    try {
      await deleteBalanceAdjustment(deletingTxn.id);
      setSelectedIds((prev) => {
        if (!prev.has(deletingTxn.id)) return prev;
        const next = new Set(prev);
        next.delete(deletingTxn.id);
        return next;
      });
      setDeletingTxn(null);
      await refresh();
    } catch (err) {
      console.error("[AdminTransactionsTab] Delete failed:", err);
      setActionError(err.message || "Failed to delete transaction.");
    } finally {
      setDeleting(false);
    }
  };

  const toggleRow = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredIds = useMemo(
    () => filteredTxns.map((t) => t.id),
    [filteredTxns],
  );

  const selectedVisibleCount = useMemo(
    () => filteredIds.filter((id) => selectedIds.has(id)).length,
    [filteredIds, selectedIds],
  );

  const allVisibleSelected =
    filteredIds.length > 0 && selectedVisibleCount === filteredIds.length;
  const someVisibleSelected =
    selectedVisibleCount > 0 && !allVisibleSelected;

  const toggleSelectAllVisible = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        filteredIds.forEach((id) => next.delete(id));
      } else {
        filteredIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const selectedTxnsPreview = useMemo(() => {
    if (selectedIds.size === 0) return { count: 0, inflow: 0, outflow: 0 };
    let inflow = 0;
    let outflow = 0;
    transactions.forEach((t) => {
      if (!selectedIds.has(t.id)) return;
      const amt = t.balanceSent || 0;
      if (amt >= 0) inflow += amt;
      else outflow += Math.abs(amt);
    });
    return { count: selectedIds.size, inflow, outflow };
  }, [selectedIds, transactions]);

  const confirmBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    setActionError(null);
    setBulkDeleting(true);
    setBulkResult(null);
    try {
      const ids = Array.from(selectedIds);
      const result = await deleteBalanceAdjustmentsBulk(ids);
      setBulkResult(result);
      if (result.failed === 0) {
        setBulkConfirmOpen(false);
      }
      await refresh();
    } catch (err) {
      console.error("[AdminTransactionsTab] Bulk delete failed:", err);
      setActionError(err.message || "Failed to delete the selected transactions.");
    } finally {
      setBulkDeleting(false);
    }
  };

  const sortedKitchens = useMemo(
    () =>
      [...kitchens].sort((a, b) =>
        (a.name || "").localeCompare(b.name || ""),
      ),
    [kitchens],
  );

  if (loading) {
    return (
      <div className="admin-loading" style={{ marginTop: 40 }}>
        <div className="admin-spinner" />
        <div className="admin-loading-text">Loading transactions…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-empty" style={{ marginTop: 40 }}>
        <div className="admin-empty-icon">⚠️</div>
        <div className="admin-empty-text">{error}</div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 20 }}>
      {/* Stats */}
      <div className="admin-stats-row">
        <div className="admin-stat-card">
          <div className="admin-stat-label">Transactions Shown</div>
          <div className="admin-stat-value">{stats.total}</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total Inflow</div>
          <div className="admin-stat-value highlight">
            +${stats.inflow.toFixed(2)}
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total Outflow</div>
          <div className="admin-stat-value warning">
            -${stats.outflow.toFixed(2)}
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Net</div>
          <div
            className={`admin-stat-value ${
              stats.net >= 0 ? "highlight" : "danger"
            }`}
          >
            {stats.net >= 0 ? "+" : "-"}${Math.abs(stats.net).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      <div
        style={{
          background: "#161b22",
          border: "1px solid #30363d",
          borderRadius: 10,
          padding: 16,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 12,
          }}
        >
          <FilterField label="Kitchen">
            <FilterSelect
              value={selectedKitchenId}
              onChange={(e) => setSelectedKitchenId(e.target.value)}
            >
              <option value="ALL">All Kitchens</option>
              {sortedKitchens.map((k) => (
                <option key={k.id} value={k.id}>
                  {k.name} {k.city ? `· ${k.city}` : ""}
                </option>
              ))}
            </FilterSelect>
          </FilterField>

          <FilterField label="Kitchen Role">
            <FilterSelect
              value={kitchenSide}
              onChange={(e) => setKitchenSide(e.target.value)}
              disabled={selectedKitchenId === "ALL"}
            >
              <option value="BOTH">Either side (sender or receiver)</option>
              <option value="SENDER">As Sender</option>
              <option value="RECEIVER">As Receiver</option>
            </FilterSelect>
          </FilterField>

          <FilterField label="Direction">
            <FilterSelect
              value={direction}
              onChange={(e) => setDirection(e.target.value)}
            >
              <option value="ALL">All</option>
              <option value="CREDIT">Credit (positive)</option>
              <option value="DEBIT">Debit (negative)</option>
            </FilterSelect>
          </FilterField>

          <FilterField label="Sort By">
            <FilterSelect
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date_desc">Newest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="amount_desc">Amount (High → Low)</option>
              <option value="amount_asc">Amount (Low → High)</option>
            </FilterSelect>
          </FilterField>

          <FilterField label="Min Amount ($)">
            <FilterInput
              type="number"
              inputMode="decimal"
              value={amountMin}
              onChange={(e) => setAmountMin(e.target.value)}
              placeholder="0"
            />
          </FilterField>

          <FilterField label="Max Amount ($)">
            <FilterInput
              type="number"
              inputMode="decimal"
              value={amountMax}
              onChange={(e) => setAmountMax(e.target.value)}
              placeholder="∞"
            />
          </FilterField>

          <FilterField label="From Date">
            <FilterInput
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </FilterField>

          <FilterField label="To Date">
            <FilterInput
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </FilterField>
        </div>

        <div style={{ marginTop: 12 }}>
          <FilterField label="Search">
            <FilterInput
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by user name, user ID, reason, or transaction ID…"
            />
          </FilterField>
        </div>

        <div
          style={{
            marginTop: 14,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ color: "#8b949e", fontSize: 13 }}>
            Showing {filteredTxns.length} of {transactions.length} transactions
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={refresh}
              style={{
                padding: "6px 14px",
                background: "rgba(56, 139, 253, 0.1)",
                border: "1px solid rgba(56, 139, 253, 0.4)",
                color: "#58a6ff",
                borderRadius: 8,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              ↻ Refresh
            </button>
            <button
              type="button"
              onClick={clearFilters}
              style={{
                padding: "6px 14px",
                background: "none",
                border: "1px solid #30363d",
                color: "#8b949e",
                borderRadius: 8,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Clear filters
            </button>
          </div>
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div
          style={{
            position: "sticky",
            top: 12,
            zIndex: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            padding: "10px 14px",
            marginBottom: 12,
            background: "linear-gradient(180deg, #1f2733 0%, #161b22 100%)",
            border: "1px solid rgba(56, 139, 253, 0.45)",
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                background: "rgba(56, 139, 253, 0.15)",
                border: "1px solid rgba(56, 139, 253, 0.4)",
                color: "#58a6ff",
                padding: "4px 10px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.3,
              }}
            >
              {selectedIds.size} selected
            </span>
            <span style={{ color: "#8b949e", fontSize: 13 }}>
              {selectedVisibleCount < selectedIds.size && (
                <>
                  ({selectedVisibleCount} visible
                  {selectedIds.size - selectedVisibleCount > 0
                    ? ` · ${selectedIds.size - selectedVisibleCount} hidden by filters`
                    : ""}
                  )
                </>
              )}
            </span>
            <span style={{ color: "#6e7681", fontSize: 12 }}>
              Inflow{" "}
              <span style={{ color: "#3fb950", fontWeight: 600 }}>
                +${selectedTxnsPreview.inflow.toFixed(2)}
              </span>
              {"  ·  "}
              Outflow{" "}
              <span style={{ color: "#f85149", fontWeight: 600 }}>
                -${selectedTxnsPreview.outflow.toFixed(2)}
              </span>
            </span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={clearSelection}
              style={{
                padding: "7px 14px",
                background: "transparent",
                border: "1px solid #30363d",
                color: "#8b949e",
                borderRadius: 8,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Clear selection
            </button>
            <button
              type="button"
              onClick={() => {
                setBulkResult(null);
                setActionError(null);
                setBulkConfirmOpen(true);
              }}
              style={{
                padding: "7px 14px",
                background: "#da3633",
                border: "1px solid #da3633",
                color: "#fff",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              🗑 Delete {selectedIds.size} Selected
            </button>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="admin-table-wrapper">
        {filteredTxns.length === 0 ? (
          <div className="admin-empty">
            <div className="admin-empty-icon">💸</div>
            <div className="admin-empty-text">
              No transactions match your filters.
            </div>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 40, textAlign: "center" }}>
                  <input
                    type="checkbox"
                    aria-label="Select all visible transactions"
                    checked={allVisibleSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someVisibleSelected;
                    }}
                    onChange={toggleSelectAllVisible}
                    style={{
                      width: 16,
                      height: 16,
                      cursor: "pointer",
                      accentColor: "#58a6ff",
                    }}
                  />
                </th>
                <th>Date</th>
                <th>Sender</th>
                <th>Receiver</th>
                <th style={{ textAlign: "right" }}>Amount</th>
                <th>Reason</th>
                <th style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTxns.map((t) => {
                const amt = t.balanceSent || 0;
                const isCredit = amt >= 0;
                const senderName = resolveDisplayName(
                  t.senderUserID,
                  accountsMap,
                  kitchenByUserId,
                );
                const receiverName = resolveDisplayName(
                  t.receiverUserID,
                  accountsMap,
                  kitchenByUserId,
                );
                const isSelected = selectedIds.has(t.id);
                return (
                  <tr
                    key={t.id}
                    style={{
                      cursor: "default",
                      background: isSelected
                        ? "rgba(56, 139, 253, 0.08)"
                        : undefined,
                    }}
                  >
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        aria-label="Select transaction"
                        checked={isSelected}
                        onChange={() => toggleRow(t.id)}
                        style={{
                          width: 16,
                          height: 16,
                          cursor: "pointer",
                          accentColor: "#58a6ff",
                        }}
                      />
                    </td>
                    <td className="admin-date-cell">
                      {formatTs(t.timestamp)}
                    </td>
                    <td>
                      <div className="admin-user-name">{senderName}</div>
                      <div
                        className="admin-user-id"
                        title={t.senderUserID || ""}
                      >
                        {t.senderUserID || "—"}
                      </div>
                    </td>
                    <td>
                      <div className="admin-user-name">{receiverName}</div>
                      <div
                        className="admin-user-id"
                        title={t.receiverUserID || ""}
                      >
                        {t.receiverUserID || "—"}
                      </div>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div
                        className={`admin-balance-cell ${
                          isCredit
                            ? "admin-balance-positive"
                            : "admin-balance-zero"
                        }`}
                        style={{
                          color: isCredit ? "#3fb950" : "#f85149",
                          fontWeight: 700,
                        }}
                      >
                        {isCredit ? "+" : "-"}$
                        {Math.abs(amt).toFixed(2)}
                      </div>
                    </td>
                    <td style={{ color: "#8b949e", fontSize: 13 }}>
                      {t.reason || "—"}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => openEdit(t)}
                          style={actionBtnStyle("primary")}
                        >
                          ✎ Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActionError(null);
                            setDeletingTxn(t);
                          }}
                          style={actionBtnStyle("danger")}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
      {editingTxn && (
        <ModalShell
          title="Edit Transaction"
          subtitle={`ID: ${editingTxn.id}`}
          onClose={() => !savingEdit && setEditingTxn(null)}
        >
          {actionError && <ModalError text={actionError} />}
          <ModalRow label="Amount ($)">
            <ModalInput
              type="number"
              step="0.01"
              value={editingTxn.balanceSent}
              onChange={(e) =>
                setEditingTxn((p) => ({
                  ...p,
                  balanceSent: e.target.value,
                }))
              }
            />
            <ModalHint>
              Use a negative number for a debit (e.g. -25.00) and a positive
              number for a credit.
            </ModalHint>
          </ModalRow>
          <ModalRow label="Sender User ID">
            <ModalInput
              type="text"
              value={editingTxn.senderUserID}
              onChange={(e) =>
                setEditingTxn((p) => ({
                  ...p,
                  senderUserID: e.target.value,
                }))
              }
              placeholder="user document ID, or `system` / `admin`"
            />
            <ModalHint>
              {resolveDisplayName(
                editingTxn.senderUserID,
                accountsMap,
                kitchenByUserId,
              )}
            </ModalHint>
          </ModalRow>
          <ModalRow label="Receiver User ID">
            <ModalInput
              type="text"
              value={editingTxn.receiverUserID}
              onChange={(e) =>
                setEditingTxn((p) => ({
                  ...p,
                  receiverUserID: e.target.value,
                }))
              }
              placeholder="user document ID, or `system` / `admin`"
            />
            <ModalHint>
              {resolveDisplayName(
                editingTxn.receiverUserID,
                accountsMap,
                kitchenByUserId,
              )}
            </ModalHint>
          </ModalRow>
          <ModalRow label="Timestamp">
            <ModalInput
              type="datetime-local"
              value={editingTxn.timestamp}
              onChange={(e) =>
                setEditingTxn((p) => ({ ...p, timestamp: e.target.value }))
              }
            />
          </ModalRow>
          <ModalRow label="Reason (optional)">
            <ModalInput
              type="text"
              value={editingTxn.reason}
              onChange={(e) =>
                setEditingTxn((p) => ({ ...p, reason: e.target.value }))
              }
              placeholder="e.g. pastDueChargePaid, refund, manualAdjustment"
            />
          </ModalRow>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              marginTop: 18,
              paddingTop: 14,
              borderTop: "1px solid #30363d",
            }}
          >
            <button
              type="button"
              onClick={() => setEditingTxn(null)}
              disabled={savingEdit}
              style={modalBtnStyle("ghost")}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveEdit}
              disabled={savingEdit}
              style={modalBtnStyle("primary")}
            >
              {savingEdit ? "Saving…" : "Save Changes"}
            </button>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: 10,
              background: "rgba(210, 153, 34, 0.08)",
              border: "1px solid rgba(210, 153, 34, 0.3)",
              borderRadius: 8,
              color: "#d29922",
              fontSize: 12,
              lineHeight: 1.5,
            }}
          >
            ⚠️ Editing a balance adjustment does <strong>not</strong>{" "}
            automatically recompute the affected users' <code>accountBalance</code>{" "}
            in the <code>accounts</code> collection. After changing an amount,
            verify the related user balances on the Users tab.
          </div>
        </ModalShell>
      )}

      {/* Bulk Delete Modal */}
      {bulkConfirmOpen && (
        <ModalShell
          title={`Delete ${selectedIds.size} transaction${
            selectedIds.size === 1 ? "" : "s"
          }?`}
          subtitle="This action cannot be undone."
          onClose={() => !bulkDeleting && setBulkConfirmOpen(false)}
          width={500}
        >
          {actionError && <ModalError text={actionError} />}
          <div
            style={{
              padding: 14,
              background: "rgba(248, 81, 73, 0.08)",
              border: "1px solid rgba(248, 81, 73, 0.3)",
              borderRadius: 8,
              color: "#f85149",
              fontSize: 13,
              lineHeight: 1.6,
              marginBottom: 16,
            }}
          >
            You are about to permanently delete{" "}
            <strong>{selectedIds.size}</strong> record
            {selectedIds.size === 1 ? "" : "s"} from{" "}
            <code>balanceAdjustment</code>. The affected users'{" "}
            <code>accountBalance</code> values will <strong>not</strong> be
            recomputed automatically — review the Users tab afterward.
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#c9d1d9",
              background: "#0d1117",
              border: "1px solid #30363d",
              borderRadius: 8,
              padding: 12,
              lineHeight: 1.7,
            }}
          >
            <div>
              <strong>Total selected:</strong> {selectedTxnsPreview.count}
            </div>
            <div>
              <strong>Total inflow:</strong>{" "}
              <span style={{ color: "#3fb950" }}>
                +${selectedTxnsPreview.inflow.toFixed(2)}
              </span>
            </div>
            <div>
              <strong>Total outflow:</strong>{" "}
              <span style={{ color: "#f85149" }}>
                -${selectedTxnsPreview.outflow.toFixed(2)}
              </span>
            </div>
          </div>

          {bulkResult && (
            <div
              style={{
                marginTop: 14,
                padding: 10,
                borderRadius: 8,
                fontSize: 13,
                background:
                  bulkResult.failed > 0
                    ? "rgba(210, 153, 34, 0.1)"
                    : "rgba(63, 185, 80, 0.1)",
                border:
                  bulkResult.failed > 0
                    ? "1px solid rgba(210, 153, 34, 0.4)"
                    : "1px solid rgba(63, 185, 80, 0.4)",
                color: bulkResult.failed > 0 ? "#d29922" : "#3fb950",
              }}
            >
              Deleted {bulkResult.deleted}
              {bulkResult.failed > 0
                ? ` · ${bulkResult.failed} failed (see console)`
                : " · all done"}
              .
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              marginTop: 18,
              paddingTop: 14,
              borderTop: "1px solid #30363d",
            }}
          >
            <button
              type="button"
              onClick={() => setBulkConfirmOpen(false)}
              disabled={bulkDeleting}
              style={modalBtnStyle("ghost")}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmBulkDelete}
              disabled={bulkDeleting}
              style={modalBtnStyle("danger")}
            >
              {bulkDeleting
                ? "Deleting…"
                : `Delete ${selectedIds.size} Permanently`}
            </button>
          </div>
        </ModalShell>
      )}

      {/* Delete Modal */}
      {deletingTxn && (
        <ModalShell
          title="Delete Transaction?"
          subtitle={`ID: ${deletingTxn.id}`}
          onClose={() => !deleting && setDeletingTxn(null)}
          width={460}
        >
          {actionError && <ModalError text={actionError} />}
          <div
            style={{
              padding: 14,
              background: "rgba(248, 81, 73, 0.08)",
              border: "1px solid rgba(248, 81, 73, 0.3)",
              borderRadius: 8,
              color: "#f85149",
              fontSize: 13,
              lineHeight: 1.6,
              marginBottom: 16,
            }}
          >
            This will permanently remove the record from{" "}
            <code>balanceAdjustment</code>. The affected users'{" "}
            <code>accountBalance</code> will not be recomputed automatically —
            you must adjust manually if needed.
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#c9d1d9",
              background: "#0d1117",
              border: "1px solid #30363d",
              borderRadius: 8,
              padding: 12,
              lineHeight: 1.7,
            }}
          >
            <div>
              <strong>Amount:</strong>{" "}
              <span
                style={{
                  color:
                    (deletingTxn.balanceSent || 0) >= 0
                      ? "#3fb950"
                      : "#f85149",
                }}
              >
                {(deletingTxn.balanceSent || 0) >= 0 ? "+" : "-"}$
                {Math.abs(deletingTxn.balanceSent || 0).toFixed(2)}
              </span>
            </div>
            <div>
              <strong>From:</strong>{" "}
              {resolveDisplayName(
                deletingTxn.senderUserID,
                accountsMap,
                kitchenByUserId,
              )}
            </div>
            <div>
              <strong>To:</strong>{" "}
              {resolveDisplayName(
                deletingTxn.receiverUserID,
                accountsMap,
                kitchenByUserId,
              )}
            </div>
            <div>
              <strong>Date:</strong> {formatTs(deletingTxn.timestamp)}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              marginTop: 18,
              paddingTop: 14,
              borderTop: "1px solid #30363d",
            }}
          >
            <button
              type="button"
              onClick={() => setDeletingTxn(null)}
              disabled={deleting}
              style={modalBtnStyle("ghost")}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              disabled={deleting}
              style={modalBtnStyle("danger")}
            >
              {deleting ? "Deleting…" : "Delete Permanently"}
            </button>
          </div>
        </ModalShell>
      )}
    </div>
  );
}

// ─── Helper components ──────────────────────────────────────────────────────

function FilterField({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span
        style={{
          color: "#8b949e",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: 0.4,
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

const fieldStyle = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #30363d",
  background: "#0d1117",
  color: "#c9d1d9",
  fontSize: 14,
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};

function FilterSelect({ children, ...props }) {
  return (
    <select {...props} style={fieldStyle}>
      {children}
    </select>
  );
}

function FilterInput(props) {
  return <input {...props} style={fieldStyle} />;
}

function actionBtnStyle(variant) {
  const base = {
    padding: "5px 10px",
    fontSize: 12,
    borderRadius: 6,
    cursor: "pointer",
    border: "1px solid",
    fontWeight: 600,
    transition: "all 0.15s",
    whiteSpace: "nowrap",
  };
  if (variant === "primary") {
    return {
      ...base,
      background: "rgba(56, 139, 253, 0.1)",
      borderColor: "rgba(56, 139, 253, 0.4)",
      color: "#58a6ff",
    };
  }
  if (variant === "danger") {
    return {
      ...base,
      background: "rgba(248, 81, 73, 0.1)",
      borderColor: "rgba(248, 81, 73, 0.4)",
      color: "#f85149",
    };
  }
  return base;
}

function modalBtnStyle(variant) {
  const base = {
    padding: "9px 18px",
    fontSize: 14,
    fontWeight: 600,
    borderRadius: 8,
    cursor: "pointer",
    border: "1px solid",
    minWidth: 100,
  };
  if (variant === "primary") {
    return {
      ...base,
      background: "#2ea043",
      borderColor: "#2ea043",
      color: "#fff",
    };
  }
  if (variant === "danger") {
    return {
      ...base,
      background: "#da3633",
      borderColor: "#da3633",
      color: "#fff",
    };
  }
  return {
    ...base,
    background: "transparent",
    borderColor: "#30363d",
    color: "#c9d1d9",
  };
}

function ModalShell({ title, subtitle, children, onClose, width = 560 }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(1, 4, 9, 0.7)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: width,
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#161b22",
          border: "1px solid #30363d",
          borderRadius: 12,
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6)",
          padding: 22,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 14,
            paddingBottom: 12,
            borderBottom: "1px solid #30363d",
          }}
        >
          <div>
            <div
              style={{
                color: "#e1e4e8",
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                style={{
                  color: "#6e7681",
                  fontSize: 12,
                  marginTop: 2,
                  fontFamily:
                    "'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace",
                }}
              >
                {subtitle}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#8b949e",
              fontSize: 22,
              cursor: "pointer",
              padding: 0,
              lineHeight: 1,
            }}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalRow({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          color: "#8b949e",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: 0.4,
          marginBottom: 5,
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

function ModalInput(props) {
  return <input {...props} style={fieldStyle} />;
}

function ModalHint({ children }) {
  return (
    <div style={{ color: "#6e7681", fontSize: 12, marginTop: 4 }}>
      {children}
    </div>
  );
}

function ModalError({ text }) {
  return (
    <div
      style={{
        padding: 10,
        marginBottom: 14,
        background: "rgba(248, 81, 73, 0.08)",
        border: "1px solid rgba(248, 81, 73, 0.3)",
        borderRadius: 8,
        color: "#f85149",
        fontSize: 13,
      }}
    >
      {text}
    </div>
  );
}
