"use client";

import { useState } from "react";
import { useTransactionStore } from "@/store/transactionStore";

const CATEGORIES = [
  "Groceries", "Salary", "Entertainment", "Dining", "Transport",
  "Utilities", "Shopping", "Freelance", "Health", "Rent", "Insurance", "Other",
];

const ACCOUNTS = [
  "Credit Card •••• 4211",
  "Checking •••• 9920",
  "Debit Card •••• 1122",
  "Savings •••• 3344",
  "Cash",
];

export default function AddTransactionModal({ onClose }: { onClose: () => void }) {
  const addTransaction = useTransactionStore((s) => s.addTransaction);
  const [form, setForm] = useState({
    description: "",
    merchant: "",
    amount: "",
    type: "expense" as "income" | "expense",
    category: "Other",
    account: ACCOUNTS[0],
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!form.description || !form.amount || Number(form.amount) <= 0) {
      setError("Description and amount are required.");
      return;
    }
    addTransaction({
      id: `tx-${Date.now()}`,
      date: new Date(form.date).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      }),
      description: form.description,
      merchant: form.merchant || form.description,
      account: form.account,
      category: form.category,
      notes: form.notes,
      amount: Number(form.amount),
      type: form.type,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest rounded-xl p-6 shadow-xl border border-outline-variant/30 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
            Add Transaction
          </h3>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setForm({ ...form, type: "expense" })}
              className={`flex-1 py-2.5 rounded-lg font-label-md text-label-md transition-all ${
                form.type === "expense"
                  ? "bg-error text-on-error shadow-sm"
                  : "bg-surface-container text-on-surface-variant"
              }`}
            >
              Expense
            </button>
            <button
              onClick={() => setForm({ ...form, type: "income" })}
              className={`flex-1 py-2.5 rounded-lg font-label-md text-label-md transition-all ${
                form.type === "income"
                  ? "bg-secondary text-on-secondary shadow-sm"
                  : "bg-surface-container text-on-surface-variant"
              }`}
            >
              Income
            </button>
          </div>

          <div>
            <label className="font-label-sm text-label-sm text-on-surface-variant mb-1 block">Description *</label>
            <input
              value={form.description}
              onChange={(e) => { setForm({ ...form, description: e.target.value }); setError(""); }}
              className="w-full px-3 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-sm text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder:text-outline"
              placeholder="e.g. Whole Foods Market"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant mb-1 block">Amount *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-body-md">$</span>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => { setForm({ ...form, amount: e.target.value }); setError(""); }}
                  className="w-full pl-7 pr-3 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-sm text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder:text-outline"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant mb-1 block">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-sm text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant mb-1 block">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-sm text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface appearance-none cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-label-sm text-label-sm text-on-surface-variant mb-1 block">Account</label>
              <select
                value={form.account}
                onChange={(e) => setForm({ ...form, account: e.target.value })}
                className="w-full px-3 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-sm text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface appearance-none cursor-pointer"
              >
                {ACCOUNTS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="font-label-sm text-label-sm text-on-surface-variant mb-1 block">Merchant</label>
            <input
              value={form.merchant}
              onChange={(e) => setForm({ ...form, merchant: e.target.value })}
              className="w-full px-3 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-sm text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder:text-outline"
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="font-label-sm text-label-sm text-on-surface-variant mb-1 block">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-3 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-sm text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder:text-outline resize-none"
              rows={2}
              placeholder="Optional"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-outline-variant text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md shadow-sm hover:bg-primary/90 transition-colors"
            >
              Add {form.type === "expense" ? "Expense" : "Income"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
