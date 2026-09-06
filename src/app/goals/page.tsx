"use client";

import { useState } from "react";
import { useGoalStore } from "@/store/goalStore";
import Header from "@/components/Header";

const CATEGORY_COLORS: Record<string, string> = {
  Savings: "#2a14b4",
  Travel: "#006c49",
  Shopping: "#553300",
  Finance: "#744800",
};

export default function GoalsPage() {
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
    <>
      <Header
        title="Goals"
        subtitle="Financial Milestones"
        actions={
          <button
            onClick={() => setShowForm(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg shadow-emerald-500/20 transition cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Add Goal</span>
          </button>
        }
      />
      <div className="flex-1 p-4 md:p-6 max-w-[1440px] mx-auto w-full space-y-6 overflow-x-hidden">
        {/* Summary Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
        </section>

        {/* Goals Grid Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">All Goals</h3>
          <button
            onClick={() => setShowForm(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            New Goal
          </button>
        </div>

        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[28px]">ads_click</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No goals yet</h3>
            <p className="text-xs text-slate-500 mb-6 max-w-sm">
              Set your first financial milestone and track your savings progress live.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Create Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => {
            const pct = Math.min((goal.currentAmount / (goal.targetAmount || 1)) * 100, 100);
            const isComplete = goal.currentAmount >= goal.targetAmount;
            return (
              <div key={goal.id} className={`bg-white p-5 rounded-2xl border ${isComplete ? "border-emerald-300 bg-emerald-50/20" : "border-slate-200/80"} shadow-2xs flex flex-col gap-4`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-2xs" style={{ backgroundColor: `${goal.color}15` }}>
                      <span className="material-symbols-outlined text-[22px]" style={{ color: goal.color }}>{goal.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{goal.name}</p>
                      <p className="text-xs text-slate-400 font-medium">{goal.category}</p>
                    </div>
                  </div>
                  {isComplete && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span> Done
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

                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: isComplete ? "#10b981" : goal.color }}
                  />
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                    <span className="text-xs font-semibold text-slate-500">{goal.deadline}</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => updateGoal(goal.id, { currentAmount: Math.min(goal.currentAmount + 500, goal.targetAmount) })}
                      className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                      title="Add ₹500"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Delete goal"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
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
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-700">
                  <span className="material-symbols-outlined text-lg">close</span>
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
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1.5 block">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="Savings">Savings</option>
                    <option value="Travel">Travel</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1.5 block">Target Deadline</label>
                  <input
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
                    placeholder="e.g. Dec 2026"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition">Cancel</button>
                  <button onClick={handleAdd} className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition">Create Goal</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
