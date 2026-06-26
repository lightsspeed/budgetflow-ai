"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BudgetCategory, BudgetPlan, BudgetTemplate, AllocationStatus } from "@/types";

const DEFAULT_CATEGORIES: BudgetCategory[] = [
  { id: "needs", name: "Needs", icon: "home", color: "#2a14b4", percentage: 0, description: "Housing, utilities, groceries." },
  { id: "wants", name: "Wants", icon: "local_dining", color: "#006c49", percentage: 0, description: "Dining out, entertainment." },
  { id: "savings", name: "Savings", icon: "savings", color: "#744800", percentage: 0, description: "Emergency fund, short-term goals." },
  { id: "investments", name: "Investments", icon: "trending_up", color: "#553300", percentage: 0, description: "Stocks, retirement accounts." },
  { id: "insurance", name: "Insurance", icon: "health_and_safety", color: "#464554", percentage: 0, description: "Health, auto, life policies." },
];

const TEMPLATES: Record<BudgetTemplate, number[]> = {
  "50/30/20": [50, 30, 20, 0, 0],
  conservative: [40, 20, 15, 15, 10],
  zero: [0, 0, 0, 0, 0],
};

interface BudgetState {
  plan: BudgetPlan;
  setIncome: (income: number) => void;
  setCategoryPercentage: (id: string, pct: number) => void;
  applyTemplate: (template: BudgetTemplate) => void;
  getTotalPercentage: () => number;
  getStatus: () => AllocationStatus;
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      plan: { income: 0, categories: DEFAULT_CATEGORIES },
      setIncome: (income) =>
        set((s) => ({ plan: { ...s.plan, income } })),
      setCategoryPercentage: (id, pct) =>
        set((s) => ({
          plan: {
            ...s.plan,
            categories: s.plan.categories.map((c) =>
              c.id === id ? { ...c, percentage: pct } : c
            ),
          },
        })),
      applyTemplate: (template) =>
        set((s) => ({
          plan: {
            ...s.plan,
            categories: s.plan.categories.map((c, i) => ({
              ...c,
              percentage: TEMPLATES[template][i] ?? 0,
            })),
          },
        })),
      getTotalPercentage: () =>
        get().plan.categories.reduce((sum, c) => sum + c.percentage, 0),
      getStatus: () => {
        const total = get().plan.categories.reduce((sum, c) => sum + c.percentage, 0);
        if (total === 100) return "valid";
        if (total < 100) return "under";
        return "over";
      },
    }),
    { name: "budget" }
  )
);
