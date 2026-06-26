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
      <Header title="Goals" subtitle="October 2023" />
      <div className="flex-1 p-4 md:p-gutter max-w-container-max mx-auto w-full space-y-xl overflow-x-hidden">
        {/* Summary Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card flex flex-col gap-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Total Saved</span>
            <span className="font-headline-md text-headline-md font-bold text-on-surface">${totalSaved.toLocaleString()}</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-auto">Across {goals.length} goals</span>
          </div>
          <div className="card flex flex-col gap-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Total Target</span>
            <span className="font-headline-md text-headline-md font-bold text-on-surface">${totalTarget.toLocaleString()}</span>
            <div className="w-full bg-outline-variant/30 rounded-full h-1.5 mt-auto">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: `${Math.min((totalSaved / totalTarget) * 100, 100)}%` }} />
            </div>
          </div>
          <div className="card flex flex-col gap-2 bg-secondary/5 border-secondary/20">
            <span className="font-label-sm text-label-sm text-secondary font-semibold">Completed</span>
            <span className="font-headline-md text-headline-md font-bold text-secondary">{completed}</span>
            <span className="font-label-sm text-label-sm text-secondary/70 mt-auto">Goals achieved</span>
          </div>
          <div className="card flex flex-col gap-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant">In Progress</span>
            <span className="font-headline-md text-headline-md font-bold text-on-surface">{active}</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-auto">Active goals</span>
          </div>
        </section>

        {/* Goals Grid */}
        <div className="flex items-center justify-between">
          <h3 className="font-label-md text-label-md text-on-surface-variant">All Goals</h3>
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Goal
          </button>
        </div>

        {goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-surface-container-lowest rounded-xl border border-outline-variant/20">
            <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[28px] text-on-surface-variant">ads_click</span>
            </div>
            <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-1">No goals yet</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-6 max-w-sm">
              Set your first financial goal and start tracking your progress.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary text-on-primary px-5 py-2.5 rounded-lg font-label-md text-label-md shadow-sm hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Create Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => {
            const pct = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
            const isComplete = goal.currentAmount >= goal.targetAmount;
            return (
              <div key={goal.id} className={`card flex flex-col gap-4 ${isComplete ? "bg-secondary/5 border-secondary/20" : ""}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: `${goal.color}15` }}>
                      <span className="material-symbols-outlined text-[22px]" style={{ color: goal.color }}>{goal.icon}</span>
                    </div>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface font-medium">{goal.name}</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">{goal.category}</p>
                    </div>
                  </div>
                  {isComplete && (
                    <span className="font-label-sm text-label-sm text-secondary bg-secondary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span> Done
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <span className="font-headline-md text-headline-md font-bold text-on-surface">${goal.currentAmount.toLocaleString()}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant"> / ${goal.targetAmount.toLocaleString()}</span>
                  </div>
                  <span className="font-mono-data text-mono-data font-semibold" style={{ color: goal.color }}>{Math.round(pct)}%</span>
                </div>

                <div className="w-full bg-outline-variant/20 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: isComplete ? "#006c49" : goal.color }}
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                    <span className="font-label-sm text-label-sm">{goal.deadline}</span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => updateGoal(goal.id, { currentAmount: Math.min(goal.currentAmount + 100, goal.targetAmount) })}
                      className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-md transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-md transition-colors"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm" onClick={() => setShowForm(false)}>
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-xl border border-outline-variant/30 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="font-headline-md text-headline-md font-bold text-on-surface mb-6">New Goal</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant mb-1 block">Goal Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-sm text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder:text-outline"
                    placeholder="e.g. New Car"
                  />
                </div>
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant mb-1 block">Target Amount ($)</label>
                  <input
                    type="number"
                    value={form.target}
                    onChange={(e) => setForm({ ...form, target: e.target.value })}
                    className="w-full px-3 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-sm text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder:text-outline"
                    placeholder="10000"
                  />
                </div>
                <div>
                  <label className="font-label-sm text-label-sm text-on-surface-variant mb-1 block">Deadline</label>
                  <input
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className="w-full px-3 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-sm text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-on-surface placeholder:text-outline"
                    placeholder="e.g. Dec 2025"
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-lg border border-outline-variant text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-colors">Cancel</button>
                  <button onClick={handleAdd} className="flex-1 py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md shadow-sm hover:bg-primary/90 transition-colors">Create Goal</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
