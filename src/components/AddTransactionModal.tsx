"use client";

import React, { useState } from "react";
import { useTransactionStore } from "@/store/transactionStore";
import Dropdown, { DropdownItem } from "./Dropdown";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
  const addTransaction = useTransactionStore((s) => s.addTransaction);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food & Dining");
  const [type, setType] = useState<"expense" | "income">("expense");
  const [account, setAccount] = useState("HDFC Credit Card");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    addTransaction({
      description,
      merchant: description,
      category,
      account,
      date: `${new Date().getDate()} Sep 2026`,
      notes: "Modal entry",
      amount: parseFloat(amount),
      type,
    });

    setDescription("");
    setAmount("");
    onClose();
  };

  const categories = [
    "Food & Dining",
    "Shopping",
    "Transport",
    "Bills & Utilities",
    "Entertainment",
    "Income",
    "Other",
  ];

  const accounts = ["HDFC Credit Card", "HDFC Bank", "Savings Account", "Cash"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-[#111c1e] border border-white/10 rounded-3xl shadow-2xl p-6 text-white space-y-6 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">Add New Transaction</h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type Toggle Pills */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 border border-white/10 rounded-xl">
            <button
              type="button"
              onClick={() => setType("expense")}
              className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                type === "expense" ? "bg-rose-500 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              ↓ Expense
            </button>
            <button
              type="button"
              onClick={() => setType("income")}
              className={`py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                type === "income" ? "bg-emerald-500 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              ↑ Income
            </button>
          </div>

          {/* Description Input */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Description / Merchant
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Starbucks Coffee"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition"
            />
          </div>

          {/* Amount Input */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Amount (₹)
            </label>
            <input
              type="number"
              required
              step="any"
              placeholder="e.g. 450"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Category
            </label>
            <Dropdown
              trigger={
                <button
                  type="button"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white flex items-center justify-between cursor-pointer focus:ring-2 focus:ring-emerald-500/50 transition"
                >
                  <span>{category}</span>
                  <span className="material-symbols-outlined text-[16px] text-slate-400">expand_more</span>
                </button>
              }
            >
              {categories.map((c) => (
                <DropdownItem
                  key={c}
                  active={category === c}
                  onClick={() => setCategory(c)}
                  icon="label"
                >
                  {c}
                </DropdownItem>
              ))}
            </Dropdown>
          </div>

          {/* Account Dropdown */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Payment Account
            </label>
            <Dropdown
              trigger={
                <button
                  type="button"
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white flex items-center justify-between cursor-pointer focus:ring-2 focus:ring-emerald-500/50 transition"
                >
                  <span>{account}</span>
                  <span className="material-symbols-outlined text-[16px] text-slate-400">expand_more</span>
                </button>
              }
            >
              {accounts.map((a) => (
                <DropdownItem
                  key={a}
                  active={account === a}
                  onClick={() => setAccount(a)}
                  icon="account_balance_wallet"
                >
                  {a}
                </DropdownItem>
              ))}
            </Dropdown>
          </div>

          {/* Footer Action Buttons */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:bg-white/5 hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 transition active:scale-95 cursor-pointer"
            >
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTransactionModal;
