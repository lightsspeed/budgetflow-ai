"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTransactionStore, Transaction } from "@/store/transactionStore";
import { useCategoryStore } from "@/store/categoryStore";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import Dropdown, { DropdownItem } from "@/components/Dropdown";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
} from "@/components/ui/table";

// ─── helpers ────────────────────────────────────────────────────────────────
function toInputDate(s: string): string {
  if (!s) return new Date().toISOString().split("T")[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const p = s.trim().split(" ");
  if (p.length === 3) {
    const mm: Record<string, string> = {
      Jan:"01",Feb:"02",Mar:"03",Apr:"04",May:"05",Jun:"06",
      Jul:"07",Aug:"08",Sep:"09",Oct:"10",Nov:"11",Dec:"12",
    };
    return `${p[2]}-${mm[p[1]] || "09"}-${p[0].padStart(2,"0")}`;
  }
  return new Date().toISOString().split("T")[0];
}

function toDisplayDate(s: string): string {
  if (!s) return `${new Date().getDate()} Sep 2026`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, d] = s.split("-");
    const mn = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${parseInt(d)} ${mn[parseInt(m)-1]} ${y}`;
  }
  return s;
}

// ─── category badge colours ──────────────────────────────────────────────────
const CAT_COLOR: Record<string, { bg: string; text: string; dot: string }> = {
  "Food & Dining":    { bg: "#fff7ed", text: "#c2410c", dot: "#f97316" },
  Transport:          { bg: "#eff6ff", text: "#1d4ed8", dot: "#3b82f6" },
  Shopping:           { bg: "#fff1f2", text: "#be123c", dot: "#f43f5e" },
  "Bills & Utilities":{ bg: "#f5f3ff", text: "#6d28d9", dot: "#8b5cf6" },
  Entertainment:      { bg: "#eef2ff", text: "#4338ca", dot: "#6366f1" },
  Income:             { bg: "#ecfdf5", text: "#065f46", dot: "#10b981" },
  "Health & Medical": { bg: "#fef2f2", text: "#991b1b", dot: "#ef4444" },
  Education:          { bg: "#f0f9ff", text: "#075985", dot: "#0ea5e9" },
  Other:              { bg: "#f8fafc", text: "#475569", dot: "#64748b" },
};

function CategoryBadge({ name }: { name: string }) {
  const c = CAT_COLOR[name] ?? CAT_COLOR.Other;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: c.dot }} />
      {name}
    </span>
  );
}

// ─── Input / select shared styles ────────────────────────────────────────────
const CELL_INPUT = "w-full bg-white/10 text-white placeholder-slate-400 border-0 border-b border-white/20 rounded-none px-1 py-1.5 text-xs font-semibold focus:outline-none focus:border-emerald-400 focus:bg-white/20 transition";
const CELL_SELECT = "w-full bg-transparent text-white border-0 border-b border-white/20 px-1 py-1.5 text-xs font-semibold focus:outline-none focus:border-emerald-400 cursor-pointer transition";

// ─── Component ────────────────────────────────────────────────────────────────
export default function TransactionsPage() {
  const {
    transactions, searchQuery, setSearchQuery,
    addTransaction, updateTransaction, deleteTransaction,
  } = useTransactionStore();
  const { categories } = useCategoryStore();
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "expense" | "income">("all");
  const [mounted, setMounted] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Inline Edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Transaction>>({});

  // Fast Entry
  const [fastDesc, setFastDesc]       = useState("");
  const [fastCat,  setFastCat]        = useState("Food & Dining");
  const [fastAcc,  setFastAcc]        = useState("HDFC Credit Card");
  const [fastDate, setFastDate]       = useState(() => new Date().toISOString().split("T")[0]);
  const [fastType, setFastType]       = useState<"expense"|"income">("expense");
  const [fastAmt,  setFastAmt]        = useState("");
  const descRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const handleAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!fastDesc || !fastAmt) return;
    addTransaction({
      description: fastDesc, merchant: fastDesc,
      category: fastCat, account: fastAcc,
      date: toDisplayDate(fastDate),
      notes: "Quick entry",
      amount: parseFloat(fastAmt), type: fastType,
    });
    setFastDesc(""); setFastAmt("");
    setTimeout(() => descRef.current?.focus(), 50);
  };

  const filtered = transactions.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchQ = t.description.toLowerCase().includes(q) ||
                   t.category.toLowerCase().includes(q) ||
                   t.account.toLowerCase().includes(q);
    const matchT = filterType === "all" || t.type === filterType;
    return matchQ && matchT;
  });

  const totalIncome  = filtered.filter(t => t.type === "income").reduce((s,t) => s+t.amount, 0);
  const totalExpense = filtered.filter(t => t.type === "expense").reduce((s,t) => s+t.amount, 0);
  const net = totalIncome - totalExpense;

  const catNames = categories.map(c => c.name);

  return (
    <>
      <AddTransactionModal isOpen={showModal} onClose={() => setShowModal(false)} />

      <div className="min-h-screen bg-[#f0f4f8]">

        {/* ── PREMIUM HERO HEADER ─────────────────────────────────────── */}
        <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f1f18] px-6 md:px-10 pt-8 pb-24">
          <div className="max-w-[1440px] mx-auto">

            {/* Top Row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <p className="text-emerald-400 text-xs font-bold tracking-widest uppercase mb-1">Financial Activity</p>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Transactions</h1>
                <p className="text-slate-400 text-sm mt-1">Real-time ledger · keyboard-first entry</p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/30 transition cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Transaction
              </button>
            </div>

            {/* Summary Pills */}
            {mounted && (
              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  { label: "Income",  val: totalIncome,  color: "#10b981", bg: "rgba(16,185,129,0.12)" },
                  { label: "Expense", val: totalExpense, color: "#f43f5e", bg: "rgba(244,63,94,0.12)"  },
                  { label: "Net",     val: Math.abs(net),color: net >= 0 ? "#10b981" : "#f43f5e", bg: "rgba(255,255,255,0.06)", sign: net < 0 ? "-" : "+" },
                ].map(({ label, val, color, bg, sign }) => (
                  <div key={label} className="rounded-2xl px-5 py-3 flex flex-col" style={{ backgroundColor: bg, border: `1px solid ${color}30` }}>
                    <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color }}>{label}</span>
                    <span className="text-xl font-extrabold text-white mt-0.5">
                      {sign ?? ""}{mounted ? `₹${val.toLocaleString("en-IN")}` : "—"}
                    </span>
                  </div>
                ))}
                <div className="rounded-2xl px-5 py-3 flex flex-col bg-white/5 border border-white/10">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Transactions</span>
                  <span className="text-xl font-extrabold text-white mt-0.5">{filtered.length}</span>
                </div>
              </div>
            )}

            {/* Filters + Search */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center bg-white/8 rounded-xl p-1 gap-1 border border-white/10">
                {(["all","expense","income"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilterType(f)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer capitalize ${
                      filterType === f
                        ? f === "expense" ? "bg-rose-500 text-white shadow"
                        : f === "income"  ? "bg-emerald-500 text-white shadow"
                        : "bg-white text-slate-900 shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {f === "all" ? "All" : f === "expense" ? "Expenses" : "Income"}
                  </button>
                ))}
              </div>
              <div className="relative flex-1 max-w-xs">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/8 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:bg-white/12 transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── TABLE CARD (overlaps hero) ──────────────────────────────── */}
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 -mt-14 pb-16">
          <div className="bg-white rounded-3xl shadow-2xl shadow-slate-900/10 overflow-hidden border border-slate-100">

            {/* ── SENIOR DESIGNER FAST ROW ENTRY ─────────────── */}
            <div className="bg-slate-50/90 px-5 py-3 border-b border-slate-200">
              <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-2.5 items-center w-full">
                {/* Description */}
                <div className="relative flex items-center md:col-span-2">
                  <input
                    ref={descRef}
                    type="text"
                    placeholder="Transaction description..."
                    value={fastDesc}
                    onChange={(e) => setFastDesc(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    tabIndex={1}
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 rounded-md px-3 py-1.5 text-xs text-slate-800 font-medium placeholder:text-slate-400 outline-none transition shadow-2xs"
                  />
                </div>

                {/* Category Dropdown */}
                <div className="relative flex items-center">
                  <Dropdown
                    trigger={
                      <button type="button" className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-700 font-medium outline-none cursor-pointer transition shadow-2xs flex items-center justify-between gap-1 truncate">
                        <span className="truncate">{fastCat}</span>
                        <span className="material-symbols-outlined text-[14px] text-slate-400">expand_more</span>
                      </button>
                    }
                  >
                    {catNames.map((n) => (
                      <DropdownItem
                        key={n}
                        active={fastCat === n}
                        onClick={() => setFastCat(n)}
                        icon="label"
                      >
                        {n}
                      </DropdownItem>
                    ))}
                  </Dropdown>
                </div>

                {/* Account Dropdown */}
                <div className="relative flex items-center">
                  <Dropdown
                    trigger={
                      <button type="button" className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-700 font-medium outline-none cursor-pointer transition shadow-2xs flex items-center justify-between gap-1 truncate">
                        <span className="truncate">{fastAcc}</span>
                        <span className="material-symbols-outlined text-[14px] text-slate-400">expand_more</span>
                      </button>
                    }
                  >
                    {["HDFC Credit Card", "HDFC Bank", "Savings Account", "Cash"].map((a) => (
                      <DropdownItem
                        key={a}
                        active={fastAcc === a}
                        onClick={() => setFastAcc(a)}
                        icon="account_balance_wallet"
                      >
                        {a}
                      </DropdownItem>
                    ))}
                  </Dropdown>
                </div>

                {/* Date */}
                <div className="relative flex items-center">
                  <input
                    type="date"
                    value={fastDate}
                    onChange={(e) => setFastDate(e.target.value)}
                    tabIndex={4}
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 rounded-md px-2 py-1.5 text-xs text-slate-700 font-medium outline-none cursor-pointer transition shadow-2xs"
                  />
                </div>

                {/* Type Dropdown */}
                <div className="relative flex items-center">
                  <Dropdown
                    trigger={
                      <button
                        type="button"
                        className={`w-full bg-white border hover:border-slate-300 rounded-md px-2.5 py-1.5 text-xs font-semibold outline-none cursor-pointer transition shadow-2xs flex items-center justify-between gap-1 ${
                          fastType === "expense" ? "text-rose-600 border-slate-200" : "text-emerald-600 border-slate-200"
                        }`}
                      >
                        <span>{fastType === "expense" ? "Expense" : "Income"}</span>
                        <span className="material-symbols-outlined text-[14px] text-slate-400">expand_more</span>
                      </button>
                    }
                  >
                    <DropdownItem
                      active={fastType === "expense"}
                      onClick={() => setFastType("expense")}
                      icon="arrow_downward"
                      className="text-rose-600 font-bold"
                    >
                      Expense
                    </DropdownItem>
                    <DropdownItem
                      active={fastType === "income"}
                      onClick={() => setFastType("income")}
                      icon="arrow_upward"
                      className="text-emerald-600 font-bold"
                    >
                      Income
                    </DropdownItem>
                  </Dropdown>
                </div>

                {/* Amount */}
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 text-slate-400 font-medium text-xs pointer-events-none">₹</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={fastAmt}
                    onChange={(e) => setFastAmt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                    tabIndex={6}
                    className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 rounded-md pl-6 pr-2.5 py-1.5 text-xs text-slate-900 font-bold text-right placeholder:text-slate-300 outline-none transition shadow-2xs tabular-nums"
                  />
                </div>

                {/* Add button */}
                <div className="relative flex items-center col-span-full md:col-span-1">
                  <button
                    type="submit"
                    tabIndex={7}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-3 py-1.5 rounded-md shadow-2xs transition active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <span>Add</span>
                    <kbd className="hidden lg:inline-block text-[9px] bg-slate-800 text-slate-300 px-1 py-0.2 rounded font-mono border border-slate-700">↵</kbd>
                  </button>
                </div>
              </form>
            </div>

            {/* ── WATERMELON UI TABLE 7 INTEGRATED LEDGER ────────────────── */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
              <Table className="w-full text-left border-collapse">
                <TableHeader className="bg-slate-50/90 border-b border-slate-200">
                  <TableRow className="border-b border-slate-200 hover:bg-transparent">
                    <TableHead className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Description</TableHead>
                    <TableHead className="px-3 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Category</TableHead>
                    <TableHead className="px-3 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Account</TableHead>
                    <TableHead className="px-3 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date</TableHead>
                    <TableHead className="px-3 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Type</TableHead>
                    <TableHead className="px-3 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Amount</TableHead>
                    <TableHead className="px-5 py-3.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-slate-100 text-xs">
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="py-16 text-center text-slate-400 font-medium">
                        <div className="flex flex-col items-center gap-2">
                          <svg className="w-8 h-8 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          No transactions found
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                  {filtered.map((tx) => {
                    const isEditing = editingId === tx.id;
                    const isSelected = selectedId === tx.id;

                    if (isEditing) return (
                      <TableRow key={tx.id} className="bg-indigo-50/60 border-l-2 border-indigo-500">
                        <TableCell className="px-5 py-2.5">
                          <input
                            autoFocus
                            type="text"
                            value={editForm.description ?? ""}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            onKeyDown={(e) => e.key === "Enter" && updateTransaction(tx.id, editForm) && setEditingId(null)}
                            className="w-full bg-white border border-indigo-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          />
                        </TableCell>
                        <TableCell className="px-3 py-2.5">
                          <Dropdown
                            trigger={
                              <button type="button" className="w-full bg-white border border-indigo-300 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer flex items-center justify-between gap-1 truncate">
                                <span className="truncate">{editForm.category ?? tx.category}</span>
                                <span className="material-symbols-outlined text-[14px] text-slate-400">expand_more</span>
                              </button>
                            }
                          >
                            {catNames.map((n) => (
                              <DropdownItem
                                key={n}
                                active={(editForm.category ?? tx.category) === n}
                                onClick={() => setEditForm({ ...editForm, category: n })}
                                icon="label"
                              >
                                {n}
                              </DropdownItem>
                            ))}
                          </Dropdown>
                        </TableCell>
                        <TableCell className="px-3 py-2.5">
                          <Dropdown
                            trigger={
                              <button type="button" className="w-full bg-white border border-indigo-300 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer flex items-center justify-between gap-1 truncate">
                                <span className="truncate">{editForm.account ?? tx.account}</span>
                                <span className="material-symbols-outlined text-[14px] text-slate-400">expand_more</span>
                              </button>
                            }
                          >
                            {["HDFC Credit Card", "HDFC Bank", "Savings Account", "Cash"].map((a) => (
                              <DropdownItem
                                key={a}
                                active={(editForm.account ?? tx.account) === a}
                                onClick={() => setEditForm({ ...editForm, account: a })}
                                icon="account_balance_wallet"
                              >
                                {a}
                              </DropdownItem>
                            ))}
                          </Dropdown>
                        </TableCell>
                        <TableCell className="px-3 py-2.5">
                          <input type="date" value={toInputDate(editForm.date ?? tx.date)} onChange={(e) => setEditForm({ ...editForm, date: toDisplayDate(e.target.value) })}
                            className="w-full bg-white border border-indigo-300 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer" />
                        </TableCell>
                        <TableCell className="px-3 py-2.5">
                          <Dropdown
                            trigger={
                              <button type="button" className="w-full bg-white border border-indigo-300 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer flex items-center justify-between gap-1 truncate capitalize">
                                <span className="truncate">{editForm.type ?? tx.type}</span>
                                <span className="material-symbols-outlined text-[14px] text-slate-400">expand_more</span>
                              </button>
                            }
                          >
                            <DropdownItem
                              active={(editForm.type ?? tx.type) === "expense"}
                              onClick={() => setEditForm({ ...editForm, type: "expense" })}
                              icon="arrow_downward"
                              className="text-rose-600 font-bold"
                            >
                              Expense
                            </DropdownItem>
                            <DropdownItem
                              active={(editForm.type ?? tx.type) === "income"}
                              onClick={() => setEditForm({ ...editForm, type: "income" })}
                              icon="arrow_upward"
                              className="text-emerald-600 font-bold"
                            >
                              Income
                            </DropdownItem>
                          </Dropdown>
                        </TableCell>
                        <TableCell className="px-3 py-2.5">
                          <input type="number" value={editForm.amount ?? tx.amount} onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value)||0 })}
                            className="w-full bg-white border border-indigo-300 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-900 text-right focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                        </TableCell>
                        <TableCell className="px-5 py-2.5 text-right whitespace-nowrap">
                          <button onClick={() => { updateTransaction(tx.id, editForm); setEditingId(null); }}
                            className="inline-flex items-center justify-center w-7 h-7 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition cursor-pointer mr-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button onClick={() => setEditingId(null)}
                            className="inline-flex items-center justify-center w-7 h-7 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-lg transition cursor-pointer">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </TableCell>
                      </TableRow>
                    );

                    return (
                      <TableRow
                        key={tx.id}
                        onClick={() => setSelectedId(isSelected ? null : tx.id)}
                        className={`group cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-emerald-500/15 hover:bg-emerald-500/20"
                            : "hover:bg-slate-50/80"
                        }`}
                      >
                        {/* Description */}
                        <TableCell className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 shadow-xs"
                              style={{
                                backgroundColor: (CAT_COLOR[tx.category]?.dot ?? "#64748b") + "18",
                                border: `1.5px solid ${(CAT_COLOR[tx.category]?.dot ?? "#64748b")}30`,
                              }}
                            >
                              {tx.category === "Food & Dining"    ? "🍔"
                               : tx.category === "Transport"      ? "🚗"
                               : tx.category === "Shopping"       ? "🛍️"
                               : tx.category === "Bills & Utilities" ? "⚡"
                               : tx.category === "Entertainment"  ? "🎬"
                               : tx.category === "Income"         ? "💰"
                               : tx.category === "Health & Medical" ? "❤️"
                               : tx.category === "Education"      ? "📚"
                               : "📦"}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-xs leading-tight">{tx.description}</p>
                              {tx.notes && <p className="text-[10px] text-slate-400 mt-0.5">{tx.notes}</p>}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-3 py-4"><CategoryBadge name={tx.category} /></TableCell>
                        <TableCell className="px-3 py-4">
                          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                            {tx.account}
                          </span>
                        </TableCell>
                        <TableCell className="px-3 py-4 text-[11px] text-slate-400 font-medium">{tx.date}</TableCell>
                        <TableCell className="px-3 py-4">
                          <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full ${
                            tx.type === "expense" ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-700"
                          }`}>
                            {tx.type === "expense" ? "↓ Expense" : "↑ Income"}
                          </span>
                        </TableCell>
                        <TableCell className={`px-3 py-4 text-right font-extrabold text-sm tabular-nums ${tx.type === "expense" ? "text-rose-500" : "text-emerald-600"}`}>
                          {tx.type === "expense" ? "–" : "+"}₹{tx.amount.toLocaleString("en-IN")}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingId(tx.id); setEditForm({...tx}); }}
                              className="w-7 h-7 inline-flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button onClick={() => deleteTransaction(tx.id)}
                              className="w-7 h-7 inline-flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>

                <TableFooter className="bg-slate-50 border-t border-slate-200">
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={5} className="px-5 py-4 text-xs font-bold text-slate-600">
                      {filtered.length} transaction{filtered.length !== 1 ? "s" : ""} shown
                    </TableCell>
                    <TableCell colSpan={2} className="px-5 py-4 text-right text-xs font-bold text-slate-600">
                      Net Balance: <span className={net >= 0 ? "text-emerald-600 font-extrabold text-sm ml-1" : "text-rose-500 font-extrabold text-sm ml-1"}>
                        {net >= 0 ? "+" : "–"}₹{Math.abs(net).toLocaleString("en-IN")}
                      </span>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
            <p className="text-slate-400 mt-3 text-center text-xs">
              Click a row to highlight it
            </p>
          </div>
        </div>

      </div>
    </>
  );
}
