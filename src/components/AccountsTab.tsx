"use client";

import React, { useState } from "react";
import { useAccountStore, Account, AccountType } from "@/store/accountStore";
import { useTransactionStore } from "@/store/transactionStore";

// ─── Account type metadata ──────────────────────────────────────────────────
const ACCOUNT_TYPES: { value: AccountType; label: string; icon: React.ReactNode; desc: string }[] = [
  {
    value: "bank",
    label: "Bank Account",
    desc: "Savings / Current",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11m16-11v11M8 10v11m8-11v11" />
      </svg>
    ),
  },
  {
    value: "credit",
    label: "Credit Card",
    desc: "Visa / Mastercard",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="5" width="20" height="14" rx="3" />
        <line x1="2" y1="10" x2="22" y2="10" />
        <line x1="6" y1="15" x2="10" y2="15" />
      </svg>
    ),
  },
  {
    value: "savings",
    label: "Savings",
    desc: "FD / RD / PO",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-2.21 0-4 1.343-4 3s1.79 3 4 3 4 1.343 4 3-1.79 3-4 3m0-18v2m0 16v2" />
      </svg>
    ),
  },
  {
    value: "cash",
    label: "Cash Wallet",
    desc: "Physical cash",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    value: "investment",
    label: "Investment",
    desc: "Stocks / MF",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
];

const COLOR_SWATCHES = [
  "#3b82f6","#10b981","#f43f5e","#f59e0b","#8b5cf6",
  "#6366f1","#14b8a6","#f97316","#0ea5e9","#ec4899",
  "#64748b","#84cc16",
];

function AccountTypeBadge({ type }: { type: AccountType }) {
  const styles: Record<AccountType, { bg: string; text: string; label: string }> = {
    bank: { bg: "bg-blue-50 border-blue-100", text: "text-blue-700", label: "Bank Account" },
    credit: { bg: "bg-rose-50 border-rose-100", text: "text-rose-700", label: "Credit Card" },
    savings: { bg: "bg-purple-50 border-purple-100", text: "text-purple-700", label: "Savings" },
    cash: { bg: "bg-amber-50 border-amber-100", text: "text-amber-700", label: "Cash Wallet" },
    investment: { bg: "bg-emerald-50 border-emerald-100", text: "text-emerald-700", label: "Investment" },
  };

  const s = styles[type] || styles.bank;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

export function AccountsTab() {
  const { accounts, addAccount, updateAccount, deleteAccount } = useAccountStore();
  const { transactions } = useTransactionStore();

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingAcc, setEditingAcc] = useState<Account | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState("");
  const [formType, setFormType] = useState<AccountType>("bank");
  const [formBalance, setFormBalance] = useState("0");
  const [formNumber, setFormNumber] = useState("");
  const [formNote, setFormNote] = useState("");
  const [formColor, setFormColor] = useState("#3b82f6");

  // Calculate live dynamic balance per account based on transactions
  const accountBalances = React.useMemo(() => {
    const balances: Record<string, { income: number; expense: number; current: number }> = {};

    accounts.forEach((acc) => {
      balances[acc.name] = { income: 0, expense: 0, current: acc.initialBalance };
    });

    transactions.forEach((tx) => {
      const accName = tx.account || "HDFC Bank";
      if (!balances[accName]) {
        balances[accName] = { income: 0, expense: 0, current: 0 };
      }
      if (tx.type === "income") {
        balances[accName].income += tx.amount;
        balances[accName].current += tx.amount;
      } else {
        balances[accName].expense += tx.amount;
        balances[accName].current -= tx.amount;
      }
    });

    return balances;
  }, [accounts, transactions]);

  // Overall financial summary metrics
  const totalAssets = accounts
    .filter((a) => a.type !== "credit")
    .reduce((sum, a) => sum + (accountBalances[a.name]?.current ?? a.initialBalance), 0);

  const totalCreditDebt = accounts
    .filter((a) => a.type === "credit")
    .reduce((sum, a) => {
      const cur = accountBalances[a.name]?.current ?? a.initialBalance;
      return sum + (cur < 0 ? Math.abs(cur) : 0);
    }, 0);

  const netWorth = totalAssets - totalCreditDebt;

  const handleOpenAdd = () => {
    setFormName("");
    setFormType("bank");
    setFormBalance("0");
    setFormNumber("");
    setFormNote("");
    setFormColor("#3b82f6");
    setIsAddOpen(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    addAccount({
      name: formName.trim(),
      type: formType,
      initialBalance: parseFloat(formBalance) || 0,
      accountNumber: formNumber.trim() || undefined,
      note: formNote.trim() || undefined,
      color: formColor,
    });

    setIsAddOpen(false);
  };

  const handleOpenEdit = (acc: Account) => {
    setEditingAcc(acc);
    setFormName(acc.name);
    setFormType(acc.type);
    setFormBalance(acc.initialBalance.toString());
    setFormNumber(acc.accountNumber || "");
    setFormNote(acc.note || "");
    setFormColor(acc.color || "#3b82f6");
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAcc || !formName.trim()) return;

    updateAccount(editingAcc.id, {
      name: formName.trim(),
      type: formType,
      initialBalance: parseFloat(formBalance) || 0,
      accountNumber: formNumber.trim() || undefined,
      note: formNote.trim() || undefined,
      color: formColor,
    });

    setEditingAcc(null);
  };

  return (
    <div className="tab-panel space-y-6">
      {/* Header & Primary Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Financial Accounts</h3>
          <p className="text-xs text-slate-500 mt-0.5">Manage cash, bank balances, credit cards, and investments with live tracking</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-xs transition active:scale-[0.98] cursor-pointer flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>+ Add Account</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Net Worth</p>
          <p className={`text-2xl font-extrabold mt-1 tabular-nums ${netWorth >= 0 ? "text-slate-900" : "text-rose-600"}`}>
            ₹{netWorth.toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Liquid Assets minus Liabilities</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Liquid Cash</p>
          <p className="text-2xl font-extrabold mt-1 text-emerald-600 tabular-nums">
            ₹{totalAssets.toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Across bank accounts & cash</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Credit Card Debt</p>
          <p className="text-2xl font-extrabold mt-1 text-rose-600 tabular-nums">
            ₹{totalCreditDebt.toLocaleString("en-IN")}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Total pending credit balance</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Accounts</p>
          <p className="text-2xl font-extrabold mt-1 text-slate-900">
            {accounts.length}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Managed accounts</p>
        </div>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {accounts.map((acc) => {
          const stats = accountBalances[acc.name] || { income: 0, expense: 0, current: acc.initialBalance };
          const currentBal = stats.current;

          return (
            <div
              key={acc.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: acc.color }} />
                    <h4 className="font-bold text-slate-900 text-base">{acc.name}</h4>
                  </div>
                  <AccountTypeBadge type={acc.type} />
                </div>

                {acc.accountNumber && (
                  <p className="text-xs text-slate-400 font-mono mt-1">{acc.accountNumber}</p>
                )}

                <div className="mt-4">
                  <span className="text-xs text-slate-400 font-medium block">Current Balance</span>
                  <span className={`text-2xl font-extrabold tabular-nums ${currentBal < 0 ? "text-rose-600" : "text-slate-900"}`}>
                    ₹{currentBal.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Initial: ₹{acc.initialBalance.toLocaleString("en-IN")}</span>
                  <span>Spent: <strong className="text-slate-700">₹{stats.expense.toLocaleString("en-IN")}</strong></span>
                </div>

                {acc.note && (
                  <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg mt-3 font-normal italic">
                    "{acc.note}"
                  </p>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(acc)}
                  className="px-3 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition cursor-pointer"
                >
                  Edit / Modify
                </button>
                <button
                  onClick={() => setDeletingId(acc.id)}
                  className="px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= ADD ACCOUNT MODAL ================= */}
      {isAddOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setIsAddOpen(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-lg shadow-2xl shadow-slate-900/20 overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold text-base leading-tight">Add Financial Account</h3>
                  <p className="text-slate-400 text-[11px] mt-0.5">Track balances, spending and credit</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveAdd} className="p-6 space-y-5">

              {/* Account Name */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Account Name *</label>
                <input
                  autoFocus
                  type="text"
                  required
                  placeholder="e.g. HDFC Bank, Axis Credit Card"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-semibold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
                />
              </div>

              {/* Account Type — visual card grid */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Account Type</label>
                <div className="grid grid-cols-5 gap-2">
                  {ACCOUNT_TYPES.map((t) => {
                    const isSelected = formType === t.value;
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setFormType(t.value)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition cursor-pointer text-center ${
                          isSelected
                            ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-400 hover:bg-white"
                        }`}
                      >
                        <span className={isSelected ? "text-white" : "text-slate-500"}>{t.icon}</span>
                        <span className="text-[10px] font-bold leading-tight">{t.label.split(" ")[0]}</span>
                        <span className={`text-[9px] leading-tight ${isSelected ? "text-slate-300" : "text-slate-400"}`}>{t.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Initial Balance + Account Number */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Initial Balance (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">₹</span>
                    <input
                      type="number"
                      value={formBalance}
                      onChange={(e) => setFormBalance(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl pl-7 pr-3 py-2.5 text-sm text-slate-900 font-bold text-right focus:outline-none focus:ring-2 focus:ring-slate-900 transition"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Last 4 Digits</label>
                  <input
                    type="text"
                    placeholder="•••• 4291"
                    maxLength={9}
                    value={formNumber}
                    onChange={(e) => setFormNumber(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-semibold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 transition font-mono"
                  />
                </div>
              </div>

              {/* Color swatches */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Account Colour</label>
                  <span className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
                    <span className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: formColor }} />
                    {formColor}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {COLOR_SWATCHES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition transform hover:scale-110 cursor-pointer ${
                        formColor === c ? "border-slate-800 scale-110 shadow-md" : "border-white shadow-sm"
                      }`}
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Note (optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Primary salary account, cashback card…"
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 transition resize-none"
                />
              </div>

              {/* Preview strip */}
              <div className="rounded-2xl p-4 border-2 flex items-center gap-4" style={{ borderColor: formColor + "40", backgroundColor: formColor + "10" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ backgroundColor: formColor }}>
                  {ACCOUNT_TYPES.find(t => t.value === formType)?.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{formName || "Account name"}</p>
                  <p className="text-[11px] text-slate-500 font-medium">{ACCOUNT_TYPES.find(t => t.value === formType)?.label} {formNumber ? `· ${formNumber}` : ""}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-extrabold text-slate-900">₹{parseFloat(formBalance || "0").toLocaleString("en-IN")}</p>
                  <p className="text-[10px] text-slate-400">Initial balance</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-sm rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-2 flex-[2] py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-lg transition cursor-pointer active:scale-[0.98]"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= EDIT ACCOUNT MODAL ================= */}
      {editingAcc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setEditingAcc(null)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-lg shadow-2xl shadow-slate-900/20 overflow-hidden animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white border border-white/20" style={{ backgroundColor: formColor }}>
                  {ACCOUNT_TYPES.find(t => t.value === formType)?.icon}
                </div>
                <div>
                  <h3 className="text-white font-bold text-base leading-tight">Edit Account</h3>
                  <p className="text-indigo-300 text-[11px] mt-0.5 truncate max-w-[200px]">{editingAcc.name}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingAcc(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-5">
              {/* Account Name */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Account Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>

              {/* Account Type */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">Account Type</label>
                <div className="grid grid-cols-5 gap-2">
                  {ACCOUNT_TYPES.map((t) => {
                    const isSelected = formType === t.value;
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setFormType(t.value)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition cursor-pointer text-center ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-600 text-white shadow-lg"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-400 hover:bg-white"
                        }`}
                      >
                        <span className={isSelected ? "text-white" : "text-slate-500"}>{t.icon}</span>
                        <span className="text-[10px] font-bold leading-tight">{t.label.split(" ")[0]}</span>
                        <span className={`text-[9px] leading-tight ${isSelected ? "text-indigo-200" : "text-slate-400"}`}>{t.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Balance + Number */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Initial Balance (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">₹</span>
                    <input
                      type="number"
                      value={formBalance}
                      onChange={(e) => setFormBalance(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl pl-7 pr-3 py-2.5 text-sm text-slate-900 font-bold text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Last 4 Digits</label>
                  <input
                    type="text"
                    maxLength={9}
                    value={formNumber}
                    onChange={(e) => setFormNumber(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition font-mono"
                    placeholder="•••• 4291"
                  />
                </div>
              </div>

              {/* Color */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Account Colour</label>
                  <span className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold">
                    <span className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: formColor }} />
                    {formColor}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {COLOR_SWATCHES.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFormColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition transform hover:scale-110 cursor-pointer ${
                        formColor === c ? "border-slate-800 scale-110 shadow-md" : "border-white shadow-sm"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Note (optional)</label>
                <textarea
                  rows={2}
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
                  placeholder="e.g. Primary salary account…"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setEditingAcc(null)}
                  className="flex-1 py-2.5 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-sm rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg transition cursor-pointer active:scale-[0.98]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h4 className="font-bold text-slate-900 text-lg">Delete Account?</h4>
            <p className="text-xs text-slate-500">
              Are you sure you want to delete this account? Existing transactions under this account name will remain in your history.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteAccount(deletingId);
                  setDeletingId(null);
                }}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition cursor-pointer"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
