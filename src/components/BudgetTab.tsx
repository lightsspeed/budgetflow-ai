"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useBudgetStore } from "@/store/budgetStore";
import { useCategoryStore } from "@/store/categoryStore";
import { useTransactionStore } from "@/store/transactionStore";
import Dropdown, { DropdownItem } from "@/components/Dropdown";

const MONTHS = ["Jan 2026","Feb 2026","Mar 2026","Apr 2026","May 2026","Jun 2026","Jul 2026","Aug 2026","Sep 2026","Oct 2026","Nov 2026","Dec 2026"];

export function BudgetTab() {
  const { categories, addCategory } = useCategoryStore();
  const { transactions } = useTransactionStore();
  const { getBudget, setBudgetTotal, setAllocation, setAllocationAmount, autoBalanceMonth, ensureCategoriesAllocated } = useBudgetStore();

  const [budgetMonth, setBudgetMonth] = useState("Sep 2026");
  const [editingTotal, setEditingTotal] = useState(false);
  const [tempTotal, setTempTotal] = useState("");
  const [isAddCatOpen, setIsAddCatOpen] = useState(false);

  // New category form
  const [catName, setCatName] = useState("");
  const [catColor, setCatColor] = useState("#10b981");

  // Ensure all categories (including dynamic user added ones) exist in budget allocations
  useEffect(() => {
    ensureCategoriesAllocated(budgetMonth, categories);
  }, [budgetMonth, categories, ensureCategoriesAllocated]);

  const budget = getBudget(budgetMonth);
  const allocations = budget.allocations;

  // Total allocated percentage
  const totalAllocatedPct = useMemo(() => {
    return allocations.reduce((sum, a) => sum + (a.percentage || 0), 0);
  }, [allocations]);

  // Actual monthly spending per category from live transactions
  const spentByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.forEach((tx) => {
      if (tx.type === "expense") {
        map[tx.category] = (map[tx.category] || 0) + tx.amount;
      }
    });
    return map;
  }, [transactions]);

  const totalSpent = useMemo(() => {
    return Object.values(spentByCategory).reduce((s, v) => s + v, 0);
  }, [spentByCategory]);

  const handleSaveAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    addCategory({
      name: catName.trim(),
      emoji: "🏷️",
      color: catColor,
      bgClass: "bg-emerald-500",
      type: "expense",
    });

    setCatName("");
    setIsAddCatOpen(false);
  };

  return (
    <div className="tab-panel space-y-6">
      {/* Header & Month Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Budget Planner</h3>
          <p className="text-xs text-slate-500 mt-0.5">Dynamically manage category allocations, track live spending, and auto-balance targets</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddCatOpen(true)}
            className="bg-white border border-slate-200 hover:border-slate-300 text-slate-800 font-semibold text-xs px-3.5 py-2 rounded-xl shadow-2xs transition cursor-pointer flex items-center gap-1.5"
          >
            <span>+ Add Category</span>
          </button>

          <Dropdown
            align="right"
            trigger={
              <button className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-800 outline-none cursor-pointer shadow-2xs flex items-center gap-1.5 transition">
                <span className="material-symbols-outlined text-[16px] text-slate-500">calendar_month</span>
                <span>{budgetMonth}</span>
                <span className="material-symbols-outlined text-[16px] text-slate-400">expand_more</span>
              </button>
            }
          >
            {MONTHS.map((m) => (
              <DropdownItem
                key={m}
                active={budgetMonth === m}
                onClick={() => setBudgetMonth(m)}
                icon="calendar_today"
              >
                {m}
              </DropdownItem>
            ))}
          </Dropdown>
        </div>
      </div>

      {/* Top Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Budget Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Monthly Budget</span>
            {editingTotal ? (
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-slate-400 font-bold text-lg">₹</span>
                <input
                  autoFocus
                  type="number"
                  value={tempTotal}
                  onChange={(e) => setTempTotal(e.target.value)}
                  onBlur={() => {
                    setBudgetTotal(budgetMonth, parseFloat(tempTotal) || budget.totalAmount);
                    setEditingTotal(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setBudgetTotal(budgetMonth, parseFloat(tempTotal) || budget.totalAmount);
                      setEditingTotal(false);
                    }
                  }}
                  className="text-2xl font-extrabold text-slate-900 w-36 bg-slate-50 border-b-2 border-emerald-500 px-2 py-0.5 outline-none"
                />
              </div>
            ) : (
              <button
                onClick={() => {
                  setTempTotal(budget.totalAmount.toString());
                  setEditingTotal(true);
                }}
                className="mt-1 text-left block group"
              >
                <span className="text-2xl font-extrabold text-slate-900 group-hover:text-emerald-600 transition tabular-nums">
                  ₹{budget.totalAmount.toLocaleString("en-IN")}
                </span>
                <span className="ml-2 text-[11px] text-slate-400 font-normal">Click to edit</span>
              </button>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Target for {budgetMonth}</p>
        </div>

        {/* Allocation Status Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Allocated</span>
            <button
              onClick={() => autoBalanceMonth(budgetMonth)}
              className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md transition cursor-pointer"
            >
              ⚡ Auto-Balance (100%)
            </button>
          </div>

          <div className="mt-2">
            <span className={`text-2xl font-extrabold tabular-nums ${
              totalAllocatedPct === 100 ? "text-emerald-600" : totalAllocatedPct > 100 ? "text-rose-600" : "text-amber-600"
            }`}>
              {totalAllocatedPct}%
            </span>
            <span className="text-xs text-slate-500 font-medium ml-2">
              (₹{Math.round((totalAllocatedPct / 100) * budget.totalAmount).toLocaleString("en-IN")})
            </span>
          </div>

          <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                totalAllocatedPct === 100 ? "bg-emerald-500" : totalAllocatedPct > 100 ? "bg-rose-500" : "bg-amber-400"
              }`}
              style={{ width: `${Math.min(totalAllocatedPct, 100)}%` }}
            />
          </div>
        </div>

        {/* Total Spent vs Budget Card */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Actual Spent</span>
          <div className="mt-2">
            <span className="text-2xl font-extrabold text-slate-900 tabular-nums">
              ₹{totalSpent.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-slate-400 font-medium ml-2">
              of ₹{budget.totalAmount.toLocaleString("en-IN")}
            </span>
          </div>
          <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                totalSpent > budget.totalAmount ? "bg-rose-500" : "bg-slate-900"
              }`}
              style={{ width: `${Math.min((totalSpent / Math.max(budget.totalAmount, 1)) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Dynamic Category Allocations & Visualization Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Category Allocations List (Left 7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-bold text-slate-900 text-sm">Dynamic Category Allocations</h4>
            <span className="text-xs text-slate-400">{categories.length} Active Categories</span>
          </div>

          <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
            {categories.map((cat) => {
              const alloc = allocations.find((a) => a.categoryId === cat.name) || {
                categoryId: cat.name,
                percentage: 0,
                color: cat.color,
              };

              const allocatedAmount = Math.round((alloc.percentage / 100) * budget.totalAmount);
              const spentAmount = spentByCategory[cat.name] || 0;
              const remainingAmount = allocatedAmount - spentAmount;
              const spentPct = allocatedAmount > 0 ? Math.min(100, Math.round((spentAmount / allocatedAmount) * 100)) : 0;
              const isOver = spentAmount > allocatedAmount && allocatedAmount > 0;

              return (
                <div key={cat.id} className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 transition">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="text-xs font-bold text-slate-900">{cat.name}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Health Pill */}
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                        isOver
                          ? "bg-rose-50 text-rose-600 border border-rose-100"
                          : spentPct >= 75
                          ? "bg-amber-50 text-amber-600 border border-amber-100"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      }`}>
                        {isOver ? "Over Budget" : spentPct >= 75 ? "Near Limit" : "On Track"}
                      </span>

                      {/* Percentage Input */}
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={alloc.percentage}
                          onChange={(e) =>
                            setAllocation(
                              budgetMonth,
                              cat.name,
                              Math.max(0, Math.min(100, parseInt(e.target.value) || 0))
                            )
                          }
                          className="w-12 bg-white border border-slate-200 rounded-md px-1.5 py-0.5 text-xs font-bold text-slate-800 text-center outline-none focus:ring-2 focus:ring-slate-900"
                        />
                        <span className="text-xs font-bold text-slate-500">%</span>
                      </div>
                    </div>
                  </div>

                  {/* Percentage Slider */}
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={alloc.percentage}
                    onChange={(e) => setAllocation(budgetMonth, cat.name, parseInt(e.target.value))}
                    style={{ accentColor: cat.color }}
                    className="w-full h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />

                  {/* Spent vs Allocated stats */}
                  <div className="flex items-center justify-between text-[11px] mt-2 text-slate-500 font-medium">
                    <span>Spent: <strong className="text-slate-800">₹{spentAmount.toLocaleString("en-IN")}</strong></span>
                    <span>Allocated: <strong className="text-slate-800">₹{allocatedAmount.toLocaleString("en-IN")}</strong></span>
                    <span className={remainingAmount < 0 ? "text-rose-600 font-bold" : "text-emerald-600 font-bold"}>
                      {remainingAmount < 0 ? "Over: " : "Remaining: "}₹{Math.abs(remainingAmount).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visual Allocation Split & Analytics (Right 5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* SVG Donut Ring */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col items-center justify-center">
            <h4 className="font-bold text-slate-900 text-sm self-start mb-4">Allocation Breakdown</h4>

            <div className="relative w-44 h-44">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                {(() => {
                  let cumPct = 0;
                  return allocations.map((a) => {
                    const pct = (a.percentage / Math.max(totalAllocatedPct, 1)) * 100;
                    const dash = `${pct} ${100 - pct}`;
                    const offset = 100 - cumPct;
                    cumPct += pct;
                    return (
                      <circle
                        key={a.categoryId}
                        cx="18"
                        cy="18"
                        r="15.9"
                        fill="none"
                        stroke={a.color || "#64748b"}
                        strokeWidth="3.5"
                        strokeDasharray={dash}
                        strokeDashoffset={offset}
                        className="transition-all duration-500"
                      />
                    );
                  });
                })()}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-slate-900">{totalAllocatedPct}%</span>
                <span className="text-[10px] text-slate-400 font-medium">Allocated</span>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 mt-5 w-full">
              {allocations.map((a) => (
                <div key={a.categoryId} className="flex items-center gap-1.5 text-[11px] font-medium text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: a.color || "#64748b" }} />
                  <span className="truncate">{a.categoryId}</span>
                  <span className="ml-auto font-bold text-slate-900">{a.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= ADD CATEGORY MODAL ================= */}
      {isAddCatOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-900 text-base">Add Dynamic Category</h4>
              <button onClick={() => setIsAddCatOpen(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSaveAddCategory} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Subscriptions, Travel"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-900 font-medium focus:ring-2 focus:ring-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Theme Color</label>
                <input
                  type="color"
                  value={catColor}
                  onChange={(e) => setCatColor(e.target.value)}
                  className="w-full h-9 p-1 border border-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCatOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
