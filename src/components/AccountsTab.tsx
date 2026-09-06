"use client";

import React, { useState } from "react";
import { useAccountStore, Account, AccountType } from "@/store/accountStore";
import { useTransactionStore } from "@/store/transactionStore";

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-900 text-lg">Add Financial Account</h4>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Account Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Axis Bank, Amazon Credit Card"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-slate-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Account Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as AccountType)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-slate-900 outline-none cursor-pointer"
                  >
                    <option value="bank">Bank Account</option>
                    <option value="credit">Credit Card</option>
                    <option value="savings">Savings</option>
                    <option value="cash">Cash Wallet</option>
                    <option value="investment">Investment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Initial Balance (₹)</label>
                  <input
                    type="number"
                    value={formBalance}
                    onChange={(e) => setFormBalance(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold text-right focus:ring-2 focus:ring-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Account Number / Last 4 Digits</label>
                <input
                  type="text"
                  placeholder="e.g. •••• 4291"
                  value={formNumber}
                  onChange={(e) => setFormNumber(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Account Color Tag</label>
                <input
                  type="color"
                  value={formColor}
                  onChange={(e) => setFormColor(e.target.value)}
                  className="w-full h-9 p-1 border border-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Note / Description</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Primary salary account or cashback card"
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-slate-900 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-900 text-lg">Modify Account: {editingAcc.name}</h4>
              <button onClick={() => setEditingAcc(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Account Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-slate-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Account Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as AccountType)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-slate-900 outline-none cursor-pointer"
                  >
                    <option value="bank">Bank Account</option>
                    <option value="credit">Credit Card</option>
                    <option value="savings">Savings</option>
                    <option value="cash">Cash Wallet</option>
                    <option value="investment">Investment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Initial Balance (₹)</label>
                  <input
                    type="number"
                    value={formBalance}
                    onChange={(e) => setFormBalance(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-bold text-right focus:ring-2 focus:ring-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Account Number / Last 4 Digits</label>
                <input
                  type="text"
                  value={formNumber}
                  onChange={(e) => setFormNumber(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Account Color Tag</label>
                <input
                  type="color"
                  value={formColor}
                  onChange={(e) => setFormColor(e.target.value)}
                  className="w-full h-9 p-1 border border-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Note / Description</label>
                <textarea
                  rows={2}
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-slate-900 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingAcc(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
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
