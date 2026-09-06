"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useTransactionStore, Transaction } from "@/store/transactionStore";
import { useBudgetStore } from "@/store/budgetStore";
import { useCategoryStore } from "@/store/categoryStore";
import { useGoalStore } from "@/store/goalStore";
import { useCountUp } from "@/hooks/useCountUp";
import { AddTransactionModal } from "@/components/AddTransactionModal";
import { AccountsTab } from "@/components/AccountsTab";
import { BudgetTab } from "@/components/BudgetTab";
import Dropdown, { DropdownItem } from "@/components/Dropdown";

// --- Custom Icons matching Finely UI design ---

function FinelyLeafLogo() {
  return (
    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 8C8 10 59 16.17 3.82 21.34L5.71 22l.9-2.3C11 17.5 17 12 17 8z" />
        <path d="M21 3C10.5 3 4 9.5 4 20c.5-1.5 2-4 5-6 6-4 10-6 12-11z" />
      </svg>
    </div>
  );
}

function CategoryIcon({ category }: { category: string }) {
  if (category === "Food & Dining") {
    return (
      <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
          <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        </svg>
      </div>
    );
  }
  if (category === "Transport") {
    return (
      <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      </div>
    );
  }
  if (category === "Income") {
    return (
      <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </div>
    );
  }
  if (category === "Shopping") {
    return (
      <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    </div>
  );
}

function ChevronRight() {
  return (
    <svg className="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function DotsIcon() {
  return (
    <button className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer">
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="5" cy="12" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="19" cy="12" r="1.5" />
      </svg>
    </button>
  );
}

const TABS = ["Overview", "Transactions", "Accounts", "Budget", "Goals", "Categories"];

const MONTHS = ["Jan 2026","Feb 2026","Mar 2026","Apr 2026","May 2026","Jun 2026","Jul 2026","Aug 2026","Sep 2026","Oct 2026","Nov 2026","Dec 2026"];

// Helper functions for date formatting
function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return `${new Date().getDate()} Sep 2026`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [year, month, day] = dateStr.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = months[parseInt(month, 10) - 1] || month;
    return `${parseInt(day, 10)} ${monthName} ${year}`;
  }
  return dateStr;
}

function formatDateForInput(dateStr: string): string {
  if (!dateStr) return new Date().toISOString().split("T")[0];
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const parts = dateStr.trim().split(" ");
  if (parts.length === 3) {
    const day = parts[0].padStart(2, "0");
    const monthMap: Record<string, string> = {
      Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
      Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12"
    };
    const month = monthMap[parts[1]] || "09";
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  return new Date().toISOString().split("T")[0];
}

// BudgetTab and AccountsTab are imported from @/components/BudgetTab and @/components/AccountsTab

// ============================================================
// CATEGORIES TAB — full CRUD with emoji, color, type
// ============================================================
const EMOJI_OPTIONS = ["🍔","🚗","🛍️","⚡","🎬","💰","❤️","📚","📦","🏠","✈️","🎓","💊","🐾","🎮","👗","🍺","☕","🏋️","🎁"];
const COLOR_OPTIONS = [
  { label: "Amber",   hex: "#f59e0b" }, { label: "Blue",    hex: "#3b82f6" },
  { label: "Rose",    hex: "#f43f5e" }, { label: "Violet",  hex: "#8b5cf6" },
  { label: "Indigo",  hex: "#6366f1" }, { label: "Emerald", hex: "#10b981" },
  { label: "Red",     hex: "#ef4444" }, { label: "Sky",     hex: "#0ea5e9" },
  { label: "Slate",   hex: "#64748b" }, { label: "Teal",    hex: "#14b8a6" },
  { label: "Orange",  hex: "#f97316" }, { label: "Pink",    hex: "#ec4899" },
];

function CategoriesTab() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategoryStore();
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [showAdd, setShowAdd] = React.useState(false);
  const [deleteConfirm, setDeleteConfirm] = React.useState<string | null>(null);

  const emptyForm = { name: "", emoji: "📦", color: "#64748b", bgClass: "bg-slate-500", type: "expense" as "expense" | "income" | "both" };
  const [form, setForm] = React.useState({ ...emptyForm });
  const [editForm, setEditForm] = React.useState({ ...emptyForm });

  const startEdit = (c: typeof categories[0]) => {
    setEditingId(c.id);
    setEditForm({ name: c.name, emoji: c.emoji, color: c.color, bgClass: c.bgClass, type: c.type });
  };

  const saveEdit = () => {
    if (!editingId || !editForm.name.trim()) return;
    updateCategory(editingId, editForm);
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!form.name.trim()) return;
    addCategory(form);
    setForm({ ...emptyForm });
    setShowAdd(false);
  };

  return (
    <div className="tab-panel space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Categories</h3>
          <p className="text-xs text-slate-400 mt-0.5">Create and manage your spending categories</p>
        </div>
        <button
          onClick={() => { setShowAdd(true); setEditingId(null); }}
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-md transition active:scale-95 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Category
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <Card className="p-5 border-2 border-emerald-400/50 bg-emerald-50/30 animate-scale-in">
          <h4 className="text-sm font-bold text-slate-800 mb-4">New Category</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Name</label>
              <input
                autoFocus
                type="text"
                placeholder="Category name..."
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Emoji</label>
              <div className="grid grid-cols-10 gap-1 bg-white border border-slate-200 rounded-xl p-2">
                {EMOJI_OPTIONS.map((e) => (
                  <button key={e} onClick={() => setForm({ ...form, emoji: e })}
                    className={`text-base rounded-lg p-0.5 transition ${form.emoji === e ? "bg-emerald-100 ring-2 ring-emerald-400" : "hover:bg-slate-100"}`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Color</label>
              <div className="grid grid-cols-6 gap-1.5 bg-white border border-slate-200 rounded-xl p-2">
                {COLOR_OPTIONS.map((c) => (
                  <button key={c.hex} onClick={() => setForm({ ...form, color: c.hex })}
                    className={`w-6 h-6 rounded-full transition transform hover:scale-110 ${form.color === c.hex ? "ring-2 ring-offset-1 ring-slate-700 scale-110" : ""}`}
                    style={{ backgroundColor: c.hex }} title={c.label} />
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1 block">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as "expense"|"income"|"both" })}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
                <option value="both">Both</option>
              </select>
              <div className="flex gap-2 mt-3">
                <button onClick={handleAdd}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs py-2 rounded-xl transition cursor-pointer">
                  Save
                </button>
                <button onClick={() => setShowAdd(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs py-2 rounded-xl transition cursor-pointer">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Category grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
        {categories.map((cat) => (
          <Card key={cat.id} className="p-5 hover-lift relative group animate-fade-slide-up">
            {editingId === cat.id ? (
              // ---- Inline Edit Mode ----
              <div className="space-y-3">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{editForm.emoji}</span>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 mb-1">EMOJI</p>
                  <div className="grid grid-cols-10 gap-1">
                    {EMOJI_OPTIONS.map((e) => (
                      <button key={e} onClick={() => setEditForm({ ...editForm, emoji: e })}
                        className={`text-base rounded-lg p-0.5 transition ${editForm.emoji === e ? "bg-indigo-100 ring-2 ring-indigo-400" : "hover:bg-slate-100"}`}>
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 mb-1">COLOR</p>
                  <div className="flex flex-wrap gap-1.5">
                    {COLOR_OPTIONS.map((c) => (
                      <button key={c.hex} onClick={() => setEditForm({ ...editForm, color: c.hex })}
                        className={`w-6 h-6 rounded-full transition transform hover:scale-110 ${editForm.color === c.hex ? "ring-2 ring-offset-1 ring-slate-700 scale-110" : ""}`}
                        style={{ backgroundColor: c.hex }} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={editForm.type}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value as "expense"|"income"|"both" })}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                    <option value="both">Both</option>
                  </select>
                  <button onClick={saveEdit} className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition cursor-pointer">Save</button>
                  <button onClick={() => setEditingId(null)} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition cursor-pointer">Cancel</button>
                </div>
              </div>
            ) : (
              // ---- View Mode ----
              <>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-sm"
                      style={{ backgroundColor: cat.color + "22", border: `2px solid ${cat.color}40` }}>
                      {cat.emoji}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm leading-tight">{cat.name}</p>
                      <span className={`inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        cat.type === "income" ? "bg-emerald-50 text-emerald-600" :
                        cat.type === "both"   ? "bg-purple-50 text-purple-600" :
                        "bg-rose-50 text-rose-600"
                      }`}>
                        {cat.type.charAt(0).toUpperCase() + cat.type.slice(1)}
                      </span>
                    </div>
                  </div>
                  {/* Action buttons */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEdit(cat)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    {deleteConfirm === cat.id ? (
                      <>
                        <button onClick={() => { deleteCategory(cat.id); setDeleteConfirm(null); }}
                          className="px-2 py-1 text-[10px] font-bold bg-rose-500 text-white rounded-lg cursor-pointer">Yes</button>
                        <button onClick={() => setDeleteConfirm(null)}
                          className="px-2 py-1 text-[10px] font-bold bg-slate-100 text-slate-600 rounded-lg cursor-pointer">No</button>
                      </>
                    ) : (
                      <button onClick={() => setDeleteConfirm(cat.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                {/* Color bar */}
                <div className="mt-4 h-1 rounded-full" style={{ backgroundColor: cat.color + "40" }}>
                  <div className="h-full w-3/4 rounded-full" style={{ backgroundColor: cat.color }} />
                </div>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// GOALS TAB — live interactive financial goals with modal
// ============================================================
function GoalsTab() {
  const { goals, addGoal, updateGoal, deleteGoal } = useGoalStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", target: "", icon: "star", color: "#2a14b4", category: "Savings", deadline: "" });

  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const completed = goals.filter((g) => g.currentAmount >= g.targetAmount).length;
  const active = goals.filter((g) => g.currentAmount < g.targetAmount).length;

  const handleAdd = () => {
    if (!form.name || !form.target) return;
    addGoal({
      id: `g-${Date.now()}`,
      name: form.name,
      icon: form.icon,
      color: form.color,
      targetAmount: Number(form.target),
      currentAmount: 0,
      deadline: form.deadline || "TBD",
      category: form.category,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    });
    setForm({ name: "", target: "", icon: "star", color: "#2a14b4", category: "Savings", deadline: "" });
    setShowForm(false);
  };

  return (
    <div className="tab-panel space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Financial Goals</h3>
          <p className="text-xs text-slate-400 mt-0.5">Track and manage your long-term saving targets</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-md transition active:scale-95 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Goal
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col gap-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Saved</span>
          <span className="text-2xl font-extrabold text-slate-900">₹{totalSaved.toLocaleString("en-IN")}</span>
          <span className="text-xs text-slate-400 mt-auto">Across {goals.length} goal{goals.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col gap-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Target</span>
          <span className="text-2xl font-extrabold text-slate-900">₹{totalTarget.toLocaleString("en-IN")}</span>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-auto overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${Math.min((totalSaved / (totalTarget || 1)) * 100, 100)}%` }} />
          </div>
        </div>
        <div className="bg-emerald-50/60 border border-emerald-200/70 p-5 rounded-2xl flex flex-col gap-1">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Completed</span>
          <span className="text-2xl font-extrabold text-emerald-800">{completed}</span>
          <span className="text-xs text-emerald-600 mt-auto">Goals achieved</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col gap-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">In Progress</span>
          <span className="text-2xl font-extrabold text-slate-900">{active}</span>
          <span className="text-xs text-slate-400 mt-auto">Active goals</span>
        </div>
      </div>

      {/* Goal Cards Grid */}
      {goals.length === 0 ? (
        <Card className="p-12 text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-4 text-2xl">🎯</div>
          <h4 className="text-lg font-bold text-slate-900">No active goals</h4>
          <p className="text-xs text-slate-500 mt-1 mb-6">Create a savings goal to keep your progress on track.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md cursor-pointer"
          >
            + Create First Goal
          </button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => {
            const pct = Math.min((goal.currentAmount / (goal.targetAmount || 1)) * 100, 100);
            const isComplete = goal.currentAmount >= goal.targetAmount;
            return (
              <Card key={goal.id} className={`p-5 space-y-4 hover-lift ${isComplete ? "border-emerald-300 bg-emerald-50/20" : ""}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: `${goal.color}15` }}>
                      🎯
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{goal.name}</p>
                      <p className="text-xs text-slate-400 font-medium">{goal.category}</p>
                    </div>
                  </div>
                  {isComplete && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ✓ Done
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-xl font-extrabold text-slate-900">₹{goal.currentAmount.toLocaleString("en-IN")}</span>
                    <span className="text-xs text-slate-400 font-semibold"> / ₹{goal.targetAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <span className="text-xs font-extrabold" style={{ color: goal.color }}>{Math.round(pct)}%</span>
                </div>

                <Progress value={pct} indicatorClassName="bg-emerald-500" />

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 font-medium">Target: {goal.deadline}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => updateGoal(goal.id, { currentAmount: Math.min(goal.currentAmount + 500, goal.targetAmount) })}
                      className="px-2 py-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold rounded-lg transition cursor-pointer text-[11px]"
                    >
                      +₹500
                    </button>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Create Financial Goal</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1.5 block">Goal Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
                  placeholder="e.g. Vacation Fund, Emergency Reserve"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1.5 block">Target Amount (₹)</label>
                <input
                  type="number"
                  value={form.target}
                  onChange={(e) => setForm({ ...form, target: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
                  placeholder="50000"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1.5 block">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="Savings">Savings</option>
                    <option value="Travel">Travel</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1.5 block">Target Date</label>
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md transition cursor-pointer"
                >
                  Save Goal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FinelyLiveDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [selectedMonth, setSelectedMonth] = useState("September 2026");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [cashflowHover, setCashflowHover] = useState(5); // Sep default index
  const [cashflowTimeframe, setCashflowTimeframe] = useState("Last 6 months");
  const [spendingTimeframe, setSpendingTimeframe] = useState("This month");
  const [isMounted, setIsMounted] = React.useState(false);

  // Inline Row Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Transaction>>({});

  // Fast Keyboard Row Entry State
  const [fastDesc, setFastDesc] = useState("");
  const [fastCategory, setFastCategory] = useState("Food & Dining");
  const [fastAccount, setFastAccount] = useState("HDFC Credit Card");
  const [fastDate, setFastDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [fastType, setFastType] = useState<"expense" | "income">("expense");
  const [fastAmount, setFastAmount] = useState("");

  const descRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Live Zustand Transaction Store
  const { transactions, searchQuery, setSearchQuery, addTransaction, updateTransaction, deleteTransaction } = useTransactionStore();

  // Fast Keyboard Add Handler
  const handleFastAdd = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!fastDesc || !fastAmount) return;

    addTransaction({
      description: fastDesc,
      merchant: fastDesc,
      category: fastCategory,
      account: fastAccount,
      date: formatDisplayDate(fastDate),
      notes: "Quick entry",
      amount: parseFloat(fastAmount),
      type: fastType,
    });

    setFastDesc("");
    setFastAmount("");
    setTimeout(() => descRef.current?.focus(), 50);
  };

  // Start Row Edit Handler
  const handleStartEdit = (t: Transaction) => {
    setEditingId(t.id);
    setEditForm({ ...t });
  };

  // Save Row Edit Handler
  const handleSaveEdit = (id: string) => {
    updateTransaction(id, editForm);
    setEditingId(null);
  };

  // Filtered transactions calculation
  const filteredTransactions = transactions.filter(
    (t) =>
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.account.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Live Financial Summaries
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = 73180 + totalIncome - totalExpense;

  // Animated number counting (runs on mount)
  const balanceCountUp   = useCountUp({ end: netBalance,    prefix: "₹", enabled: isMounted });
  const incomeCountUp    = useCountUp({ end: totalIncome,   prefix: "₹", enabled: isMounted });
  const expenseCountUp   = useCountUp({ end: totalExpense,  prefix: "₹", enabled: isMounted });
  const assetsCountUp    = useCountUp({ end: 124500 + totalIncome,  prefix: "₹", enabled: isMounted });
  const liabCountUp      = useCountUp({ end: 51320 + totalExpense,  prefix: "₹", enabled: isMounted });
  const savingsRateCount = useCountUp({ end: 32, suffix: "%", enabled: isMounted });

  return (
    <div className="w-full min-h-screen bg-[#f2f5f7] font-sans text-slate-900 antialiased selection:bg-emerald-500 selection:text-white">
      {/* ================= COMPACT HERO HEADER SECTION ================= */}
      <section
        className="w-full relative bg-[#0d1619] text-white overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/scenic_hero.png')" }}
      >
        {/* Dark Glass Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1619]/95 via-[#0d1619]/85 to-[#0d1619]/70 pointer-events-none" />

        <div className="relative z-10 max-w-[1440px] mx-auto px-4 md:px-10">
          {/* Top Bar Navigation */}
          <div className="flex items-center justify-between py-3 border-b border-white/10 gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <FinelyLeafLogo />
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-lg text-white tracking-tight leading-none">
                  Finely
                </span>
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  Your Money, Clearer
                </span>
              </div>
            </div>

            {/* Live Search Input */}
            <div className="relative items-center hidden md:flex">
              <svg className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search transactions, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-72 pl-9 pr-12 py-1.5 bg-black/40 border border-white/10 rounded-full text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 backdrop-blur-md"
              />
              <span className="absolute right-3 text-[10px] font-semibold text-slate-400 bg-white/10 px-1.5 py-0.5 rounded">
                ⌘ K
              </span>
            </div>

            {/* Right Controls: Add Transaction, Month Selector, Bell, Profile */}
            <div className="flex items-center gap-3">
              {/* + Add Transaction Button */}
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-full shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>+</span> Add
              </button>

              {/* Month Selector Pill */}
              <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-full px-3 py-1 text-xs text-slate-300 backdrop-blur-md">
                <button className="hover:text-white transition">‹</button>
                <span className="font-semibold text-white text-[11px] flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {selectedMonth}
                </span>
                <button className="hover:text-white transition">›</button>
              </div>

              {/* Notification Bell Badge */}
              <div className="relative p-1.5 rounded-full bg-black/40 border border-white/10 text-slate-300 hover:text-white transition cursor-pointer backdrop-blur-md">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-rose-500 text-white font-bold text-[8px] rounded-full flex items-center justify-center ring-2 ring-slate-900">
                  1
                </span>
              </div>

              {/* User Profile Badge */}
              <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-full pl-1 pr-3 py-1 backdrop-blur-md cursor-pointer hover:bg-black/60 transition">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center">
                  AK
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white leading-tight">Akhilesh</span>
                  <span className="text-[9px] text-slate-400 leading-none">Personal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Main Hero Greeting (No Budget Card) */}
          <div className="py-4">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Wednesday, 5 September 2026</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Good evening, Akhilesh 👋
            </h1>
            <p className="text-xs text-slate-300 font-normal mt-0.5">
              Small steps today, a wealthier tomorrow.
            </p>
          </div>

          {/* Navigation Pill Tabs (Overview, Transactions, Accounts, Budget, Goals) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 hide-scrollbar">
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-[#d2f4ea] text-[#0d3b2e] shadow-md"
                      : "bg-black/30 hover:bg-black/50 text-slate-300 hover:text-white backdrop-blur-sm"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= MAIN CONTENT BODY (LIVE DATA VIEWS) ================= */}
      <main className="max-w-[1440px] mx-auto px-4 md:px-10 py-6 space-y-6">
        
        {/* ================= VIEW 1: OVERVIEW TAB ================= */}
        {activeTab === "Overview" && (
          <div className="tab-panel space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* CARD 1: MY BALANCE */}
              <Card className="lg:col-span-4 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="5" width="20" height="14" rx="3" />
                          <line x1="2" y1="10" x2="22" y2="10" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 leading-tight">My Balance</h3>
                        <p className="text-[11px] text-slate-400">Total value across all accounts</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      {balanceCountUp}
                    </div>
                    <Badge variant="success" className="mt-1.5 font-bold">
                      ↑ +12.4% <span className="font-medium text-emerald-700 ml-1">from last month</span>
                    </Badge>
                  </div>

                  {/* Live Assets & Liabilities Progress Bars */}
                  <div className="mt-6 space-y-4">
                    <div>
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
                        <span className="text-slate-500 font-medium">Total Assets</span>
                        <span>{assetsCountUp}</span>
                      </div>
                      <Progress value={78} indicatorClassName="bg-emerald-500" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-1.5">
                        <span className="text-slate-500 font-medium">Total Liabilities</span>
                        <span className="text-slate-900">-{liabCountUp}</span>
                      </div>
                      <Progress value={38} indicatorClassName="bg-rose-500" />
                    </div>
                  </div>
                </div>

                {/* AI Insight Banner */}
                <div className="mt-6 bg-purple-50/80 border border-purple-100 rounded-2xl p-3 flex items-center justify-between gap-3 group cursor-pointer hover:bg-purple-100/70 transition">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-purple-950">AI Insight</h4>
                    <p className="text-[11px] text-purple-700 truncate">
                      Your net worth increased by ₹8,120 this month.
                    </p>
                  </div>
                  <ChevronRight />
                </div>
              </Card>

              {/* CARD 2: MONTHLY CASH FLOW */}
              <Card className="lg:col-span-4 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 leading-tight">Monthly Cash Flow</h3>
                        <p className="text-[11px] text-slate-400">Income vs Expenses</p>
                      </div>
                    </div>

                    <Dropdown
                      align="right"
                      trigger={
                        <button className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl px-2.5 py-1 font-semibold text-slate-700 transition cursor-pointer">
                          <span>{cashflowTimeframe}</span>
                          <span className="material-symbols-outlined text-[14px]">expand_more</span>
                        </button>
                      }
                    >
                      {["Last 6 months", "Last 12 months", "Year 2026"].map((t) => (
                        <DropdownItem
                          key={t}
                          active={cashflowTimeframe === t}
                          onClick={() => setCashflowTimeframe(t)}
                          icon="calendar_month"
                        >
                          {t}
                        </DropdownItem>
                      ))}
                    </Dropdown>
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-4 mt-4 text-xs font-semibold text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Income
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Expenses
                    </span>
                  </div>

                  {/* Bar Chart */}
                  <div className="mt-6 h-44 flex items-end justify-between relative pt-6 pb-2 px-2">
                    {[
                      { month: "Apr", income: "60%", expense: "40%" },
                      { month: "May", income: "75%", expense: "50%" },
                      { month: "Jun", income: "65%", expense: "45%" },
                      { month: "Jul", income: "70%", expense: "55%" },
                      { month: "Aug", income: "60%", expense: "50%" },
                      { month: "Sep", income: "85%", expense: "42%", active: true },
                    ].map((item, idx) => {
                      return (
                        <div
                          key={item.month}
                          className="flex flex-col items-center group cursor-pointer relative h-full justify-end"
                        >
                          {/* Dual Vertical Bars */}
                          <div className="flex items-end gap-1 h-full">
                            <div
                              style={{ height: item.income }}
                              className="w-3 md:w-3.5 bg-emerald-400 rounded-t-full hover:bg-emerald-500 transition"
                            />
                            <div
                              style={{ height: item.expense }}
                              className="w-3 md:w-3.5 bg-rose-400 rounded-t-full hover:bg-rose-500 transition"
                            />
                          </div>
                          <span className="text-[10px] font-semibold text-slate-400 mt-2">
                            {item.month}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div />
              </Card>

              {/* CARD 3: SPENDING BREAKDOWN */}
              <Card className="lg:col-span-4 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 leading-tight">Spending Breakdown</h3>
                        <p className="text-[11px] text-slate-400">Total spent ({spendingTimeframe.toLowerCase()})</p>
                      </div>
                    </div>

                    <Dropdown
                      align="right"
                      trigger={
                        <button className="flex items-center gap-1.5 text-xs bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl px-2.5 py-1 font-semibold text-slate-700 transition cursor-pointer">
                          <span>{spendingTimeframe}</span>
                          <span className="material-symbols-outlined text-[14px]">expand_more</span>
                        </button>
                      }
                    >
                      {["This month", "Last month", "This quarter", "This year"].map((t) => (
                        <DropdownItem
                          key={t}
                          active={spendingTimeframe === t}
                          onClick={() => setSpendingTimeframe(t)}
                          icon="pie_chart"
                        >
                          {t}
                        </DropdownItem>
                      ))}
                    </Dropdown>
                  </div>

                  <div className="mt-4">
                    <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      ₹{(72340 + totalExpense).toLocaleString("en-IN")}
                    </div>
                    <Badge variant="destructive" className="mt-1.5 font-bold">
                      ↑ +4.1% <span className="font-medium text-rose-700 ml-1">from last month</span>
                    </Badge>
                  </div>

                  {/* Donut Chart & Category Grid */}
                  <div className="mt-6 flex items-center gap-4">
                    {/* SVG Donut */}
                    <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-slate-100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-blue-500" strokeDasharray="18, 100" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-pink-500" strokeDasharray="14, 100" strokeDashoffset="-18" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-amber-500" strokeDasharray="9, 100" strokeDashoffset="-32" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-yellow-500" strokeDasharray="11, 100" strokeDashoffset="-41" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-purple-500" strokeDasharray="7, 100" strokeDashoffset="-52" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-slate-400" strokeDasharray="41, 100" strokeDashoffset="-59" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <div className="absolute flex flex-col items-center justify-center text-center">
                        <span className="text-[10px] font-bold text-slate-800 leading-tight">₹72,340</span>
                        <span className="text-[9px] text-slate-400">Total spent</span>
                      </div>
                    </div>

                    {/* Category Legend List */}
                    <div className="flex-1 space-y-1.5 text-[11px]">
                      {[
                        { label: "Food & Dining", pct: "18%", val: "₹12,450", color: "bg-blue-500" },
                        { label: "Shopping", pct: "14%", val: "₹8,200", color: "bg-pink-500" },
                        { label: "Transport", pct: "9%", val: "₹5,420", color: "bg-amber-500" },
                        { label: "Bills & Utilities", pct: "11%", val: "₹7,960", color: "bg-yellow-500" },
                        { label: "Entertainment", pct: "7%", val: "₹3,200", color: "bg-purple-500" },
                        { label: "Other", pct: "41%", val: "₹29,110", color: "bg-slate-400" },
                      ].map((c) => (
                        <div key={c.label} className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${c.color}`} />
                            <span className="text-slate-600 font-medium truncate max-w-[90px]">{c.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-semibold">{c.pct}</span>
                            <span className="font-bold text-slate-800">{c.val}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* BOTTOM ROW: LIVE RECENT TRANSACTIONS & TOP CATEGORIES */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* CARD 4: RECENT TRANSACTIONS */}
              <Card className="lg:col-span-8 p-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 leading-tight">Recent Transactions</h3>
                      <p className="text-[11px] text-slate-400">Your latest activity</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setActiveTab("Transactions")}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    View all →
                  </Button>
                </div>

                <div className="overflow-x-auto mt-4">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[11px] font-semibold text-slate-400 border-b border-slate-100">
                        <th className="pb-3 font-medium">Description</th>
                        <th className="pb-3 font-medium">Category</th>
                        <th className="pb-3 font-medium">Account</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium text-right">Amount</th>
                        <th className="pb-3 font-medium text-right w-8">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {filteredTransactions.slice(0, 5).map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-50/80 transition group">
                          <td className="py-3.5 font-bold text-slate-900">
                            <div className="flex items-center gap-3">
                              <CategoryIcon category={tx.category} />
                              <span>{tx.description}</span>
                            </div>
                          </td>
                          <td className="py-3.5 text-slate-600 font-semibold">{tx.category}</td>
                          <td className="py-3.5 text-slate-500 font-medium">{tx.account}</td>
                          <td className="py-3.5 text-slate-400 font-medium">{tx.date}</td>
                          <td className={`py-3.5 font-bold text-right ${tx.type === "expense" ? "text-rose-500" : "text-emerald-600"}`}>
                            {tx.type === "expense" ? `-₹${tx.amount.toLocaleString("en-IN")}` : `+₹${tx.amount.toLocaleString("en-IN")}`}
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => deleteTransaction(tx.id)}
                              className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer inline-flex items-center justify-center"
                              title="Delete transaction"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* CARD 5: TOP CATEGORIES */}
              <Card className="lg:col-span-4 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 leading-tight">Top Categories</h3>
                        <p className="text-[11px] text-slate-400">Your highest spending categories</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-4">
                    {[
                      { rank: 1, label: "Food & Dining", val: "₹12,450", pct: "18%", color: "bg-emerald-500" },
                      { rank: 2, label: "Shopping", val: "₹8,200", pct: "14%", color: "bg-rose-400" },
                      { rank: 3, label: "Bills & Utilities", val: "₹7,960", pct: "11%", color: "bg-amber-400" },
                      { rank: 4, label: "Transport", val: "₹5,420", pct: "9%", color: "bg-blue-500" },
                    ].map((cat) => (
                      <div key={cat.rank} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 font-bold text-[11px] flex items-center justify-center">
                            {cat.rank}
                          </span>
                          <span className="font-bold text-slate-900">{cat.label}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-800">{cat.val}</span>
                          <span className="text-slate-400 font-medium w-8 text-right">{cat.pct}</span>
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${cat.color} rounded-full`} style={{ width: cat.pct }} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* BOTTOM HERO BANNER: STAY ON TRACK THIS MONTH */}
            <div className="relative rounded-3xl bg-[#0c1d19] text-white p-6 md:p-8 overflow-hidden shadow-xl border border-emerald-900/40">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0c1d19] via-[#0d2a23] to-[#0c1d19] pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">Stay on track this month</h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      You&apos;ve used <span className="font-bold text-emerald-400">60%</span> of your budget. You&apos;re doing great! 💪
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
                  <Button
                    onClick={() => setActiveTab("Budget")}
                    className="bg-[#173a32] hover:bg-[#1f4a40] text-emerald-300 border border-emerald-500/30 px-5 py-2 rounded-full font-bold text-xs shadow-md cursor-pointer"
                  >
                    View Budget →
                  </Button>
                  <span className="text-[11px] font-medium text-slate-400 italic">
                    Disciplined today. Freedom tomorrow.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= VIEW 2: TRANSACTIONS TAB ================= */}
        {activeTab === "Transactions" && (
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">All Transactions</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Manage and filter your live personal expenses and income. Use the row-level entry bar below for instant keyboard-only entry!
                </p>
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition self-start sm:self-auto cursor-pointer"
              >
                + Modal Add
              </button>
            </div>

            {/* Live Table */}
            <div className="overflow-x-auto mt-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs font-bold text-slate-400 border-b border-slate-200">
                    <th className="pb-3 pr-2">Description</th>
                    <th className="pb-3 px-2">Category</th>
                    <th className="pb-3 px-2">Account</th>
                    <th className="pb-3 px-2">Date</th>
                    <th className="pb-3 px-2">Type</th>
                    <th className="pb-3 px-2 text-right">Amount (₹)</th>
                    <th className="pb-3 pl-2 text-right w-20">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {/* ================= SENIOR DESIGNER FAST ROW ENTRY ================= */}
                  <tr className="bg-slate-50/80 hover:bg-slate-50 border-y border-slate-200 transition-colors">
                    {/* Description */}
                    <td className="py-2.5 pl-3 pr-2">
                      <input
                        ref={descRef}
                        type="text"
                        placeholder="Transaction description..."
                        value={fastDesc}
                        onChange={(e) => setFastDesc(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleFastAdd()}
                        tabIndex={1}
                        className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 rounded-md px-2.5 py-1.5 text-xs text-slate-800 font-medium placeholder:text-slate-400 outline-none transition shadow-2xs"
                      />
                    </td>

                    {/* Category Dropdown */}
                    <td className="py-2.5 px-2">
                      <Dropdown
                        trigger={
                          <button type="button" className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-700 font-medium outline-none cursor-pointer transition shadow-2xs flex items-center justify-between gap-1 truncate">
                            <span className="truncate">{fastCategory}</span>
                            <span className="material-symbols-outlined text-[14px] text-slate-400">expand_more</span>
                          </button>
                        }
                      >
                        {["Food & Dining", "Shopping", "Transport", "Bills & Utilities", "Entertainment", "Income", "Other"].map((c) => (
                          <DropdownItem
                            key={c}
                            active={fastCategory === c}
                            onClick={() => setFastCategory(c)}
                            icon="label"
                          >
                            {c}
                          </DropdownItem>
                        ))}
                      </Dropdown>
                    </td>

                    {/* Account Dropdown */}
                    <td className="py-2.5 px-2">
                      <Dropdown
                        trigger={
                          <button type="button" className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-700 font-medium outline-none cursor-pointer transition shadow-2xs flex items-center justify-between gap-1 truncate">
                            <span className="truncate">{fastAccount}</span>
                            <span className="material-symbols-outlined text-[14px] text-slate-400">expand_more</span>
                          </button>
                        }
                      >
                        {["HDFC Credit Card", "HDFC Bank", "Savings Account", "Cash"].map((a) => (
                          <DropdownItem
                            key={a}
                            active={fastAccount === a}
                            onClick={() => setFastAccount(a)}
                            icon="account_balance_wallet"
                          >
                            {a}
                          </DropdownItem>
                        ))}
                      </Dropdown>
                    </td>

                    {/* Date */}
                    <td className="py-2.5 px-2">
                      <input
                        type="date"
                        value={fastDate}
                        onChange={(e) => setFastDate(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleFastAdd()}
                        tabIndex={4}
                        className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 rounded-md px-2 py-1.5 text-xs text-slate-700 font-medium outline-none cursor-pointer transition shadow-2xs"
                      />
                    </td>

                    {/* Type Dropdown */}
                    <td className="py-2.5 px-2">
                      <Dropdown
                        trigger={
                          <button
                            type="button"
                            className={`w-full bg-white border hover:border-slate-300 rounded-md px-2 py-1.5 text-xs font-semibold outline-none cursor-pointer transition shadow-2xs flex items-center justify-between gap-1 ${
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
                    </td>

                    {/* Amount */}
                    <td className="py-2.5 px-2 text-right">
                      <div className="relative flex items-center">
                        <span className="absolute left-2.5 text-slate-400 font-medium text-xs pointer-events-none">₹</span>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={fastAmount}
                          onChange={(e) => setFastAmount(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleFastAdd()}
                          tabIndex={6}
                          className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 rounded-md pl-6 pr-2.5 py-1.5 text-xs text-slate-900 font-bold text-right placeholder:text-slate-300 outline-none transition shadow-2xs tabular-nums"
                        />
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-2.5 pr-3 pl-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleFastAdd()}
                        tabIndex={7}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs px-3 py-1.5 rounded-md shadow-2xs transition active:scale-[0.98] cursor-pointer inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
                      >
                        <span>Add</span>
                        <kbd className="hidden lg:inline-block text-[9px] bg-slate-800 text-slate-300 px-1 py-0.2 rounded font-mono border border-slate-700">↵</kbd>
                      </button>
                    </td>
                  </tr>

                  {/* ================= EXISTING TRANSACTIONS WITH INLINE EDIT ================= */}
                  {filteredTransactions.map((tx) => {
                    const isEditing = editingId === tx.id;

                    if (isEditing) {
                      return (
                        <tr key={tx.id} className="bg-indigo-50/80 border-b border-indigo-100">
                          <td className="py-2.5 pr-2">
                            <input
                              type="text"
                              value={editForm.description || ""}
                              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                              className="w-full bg-white border border-indigo-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </td>
                          <td className="py-2.5 px-2">
                            <Dropdown
                              trigger={
                                <button type="button" className="w-full bg-white border border-indigo-300 rounded-lg px-2 py-1 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer flex items-center justify-between gap-1 truncate">
                                  <span className="truncate">{editForm.category || tx.category}</span>
                                  <span className="material-symbols-outlined text-[14px] text-slate-400">expand_more</span>
                                </button>
                              }
                            >
                              {["Food & Dining", "Shopping", "Transport", "Bills & Utilities", "Entertainment", "Income", "Other"].map((c) => (
                                <DropdownItem
                                  key={c}
                                  active={(editForm.category || tx.category) === c}
                                  onClick={() => setEditForm({ ...editForm, category: c })}
                                  icon="label"
                                >
                                  {c}
                                </DropdownItem>
                              ))}
                            </Dropdown>
                          </td>
                          <td className="py-2.5 px-2">
                            <Dropdown
                              trigger={
                                <button type="button" className="w-full bg-white border border-indigo-300 rounded-lg px-2 py-1 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer flex items-center justify-between gap-1 truncate">
                                  <span className="truncate">{editForm.account || tx.account}</span>
                                  <span className="material-symbols-outlined text-[14px] text-slate-400">expand_more</span>
                                </button>
                              }
                            >
                              {["HDFC Credit Card", "HDFC Bank", "Savings Account", "Cash"].map((a) => (
                                <DropdownItem
                                  key={a}
                                  active={(editForm.account || tx.account) === a}
                                  onClick={() => setEditForm({ ...editForm, account: a })}
                                  icon="account_balance_wallet"
                                >
                                  {a}
                                </DropdownItem>
                              ))}
                            </Dropdown>
                          </td>
                          <td className="py-2.5 px-2">
                            <input
                              type="date"
                              value={formatDateForInput(editForm.date || tx.date)}
                              onChange={(e) => setEditForm({ ...editForm, date: formatDisplayDate(e.target.value) })}
                              className="w-full bg-white border border-indigo-300 rounded-lg px-2 py-1 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                            />
                          </td>
                          <td className="py-2.5 px-2">
                            <Dropdown
                              trigger={
                                <button type="button" className="w-full bg-white border border-indigo-300 rounded-lg px-2 py-1 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer flex items-center justify-between gap-1 truncate capitalize">
                                  <span className="truncate">{editForm.type || tx.type}</span>
                                  <span className="material-symbols-outlined text-[14px] text-slate-400">expand_more</span>
                                </button>
                              }
                            >
                              <DropdownItem
                                active={(editForm.type || tx.type) === "expense"}
                                onClick={() => setEditForm({ ...editForm, type: "expense" })}
                                icon="arrow_downward"
                                className="text-rose-600 font-bold"
                              >
                                Expense
                              </DropdownItem>
                              <DropdownItem
                                active={(editForm.type || tx.type) === "income"}
                                onClick={() => setEditForm({ ...editForm, type: "income" })}
                                icon="arrow_upward"
                                className="text-emerald-600 font-bold"
                              >
                                Income
                              </DropdownItem>
                            </Dropdown>
                          </td>
                          <td className="py-2.5 px-2 text-right">
                            <input
                              type="number"
                              value={editForm.amount || 0}
                              onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) || 0 })}
                              className="w-full bg-white border border-indigo-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </td>
                          <td className="py-2.5 pl-2 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleSaveEdit(tx.id)}
                              className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition shadow-xs cursor-pointer inline-flex items-center justify-center mr-1"
                              title="Save edits"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer inline-flex items-center justify-center"
                              title="Cancel edit"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    }

                    return (
                      <tr key={tx.id} className="hover:bg-slate-50 transition group">
                        <td className="py-3.5 pr-2 font-bold text-slate-900">
                          <div className="flex items-center gap-3">
                            <CategoryIcon category={tx.category} />
                            <div>
                              <div>{tx.description}</div>
                              <div className="text-[10px] text-slate-400 font-normal">{tx.notes}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-2 font-semibold text-slate-700">{tx.category}</td>
                        <td className="py-3.5 px-2 text-slate-500 font-medium">{tx.account}</td>
                        <td className="py-3.5 px-2 text-slate-400 font-medium">{tx.date}</td>
                        <td className="py-3.5 px-2 font-semibold text-slate-600 capitalize">{tx.type}</td>
                        <td className={`py-3.5 px-2 font-bold text-right ${tx.type === "expense" ? "text-rose-500" : "text-emerald-600"}`}>
                          {tx.type === "expense" ? `-₹${tx.amount.toLocaleString("en-IN")}` : `+₹${tx.amount.toLocaleString("en-IN")}`}
                        </td>
                        <td className="py-3.5 pl-2 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleStartEdit(tx)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer mr-1 inline-flex items-center justify-center"
                            title="Edit transaction"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteTransaction(tx.id)}
                            className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition cursor-pointer inline-flex items-center justify-center"
                            title="Delete transaction"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* ================= VIEW 3: ACCOUNTS TAB ================= */}
        {activeTab === "Accounts" && <AccountsTab />}

        {/* ================= VIEW 4: BUDGET TAB ================= */}
        {activeTab === "Budget" && <BudgetTab />}

        {/* ================= VIEW 5: GOALS TAB ================= */}
        {activeTab === "Goals" && <GoalsTab />}

        {/* ================= VIEW 6: CATEGORIES TAB ================= */}
        {activeTab === "Categories" && <CategoriesTab />}

      </main>

      {/* Live Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}


