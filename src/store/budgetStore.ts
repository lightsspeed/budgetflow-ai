"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_CATEGORIES, Category } from "./categoryStore";

export interface CategoryAllocation {
  categoryId: string; // name or id of category
  percentage: number;
  color?: string;
  customAmount?: number;
}

export interface MonthlyBudget {
  month: string;
  totalAmount: number;
  allocations: CategoryAllocation[];
}

export const DEFAULT_BUDGET_ALLOCATIONS: CategoryAllocation[] = [
  { categoryId: "Food & Dining",      percentage: 25, color: "#f59e0b" },
  { categoryId: "Transport",          percentage: 10, color: "#3b82f6" },
  { categoryId: "Shopping",           percentage: 20, color: "#f43f5e" },
  { categoryId: "Bills & Utilities",  percentage: 20, color: "#8b5cf6" },
  { categoryId: "Entertainment",      percentage: 10, color: "#6366f1" },
  { categoryId: "Health & Medical",   percentage: 10, color: "#ef4444" },
  { categoryId: "Education",          percentage: 0,  color: "#0ea5e9" },
  { categoryId: "Other",              percentage: 5,  color: "#64748b" },
];

const DEFAULT_BUDGETS: Record<string, MonthlyBudget> = {};

// Legacy planner interface support
export interface LegacyBudgetPlan {
  income: number;
  categories: { id: string; name: string; percentage: number; color: string }[];
}

interface BudgetState {
  budgets: Record<string, MonthlyBudget>;
  plan: LegacyBudgetPlan; // for backward compatibility with budget-planner page
  setIncome: (income: number) => void;
  setCategoryPercentage: (categoryId: string, percentage: number) => void;
  applyTemplate: (template: "50/30/20" | "conservative" | "zero") => void;

  setBudgetTotal: (month: string, total: number) => void;
  setAllocation: (month: string, categoryId: string, percentage: number) => void;
  setAllocationAmount: (month: string, categoryId: string, amount: number) => void;
  ensureCategoriesAllocated: (month: string, categories: Category[]) => void;
  autoBalanceMonth: (month: string) => void;
  getBudget: (month: string) => MonthlyBudget;
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      budgets: DEFAULT_BUDGETS,
      plan: {
        income: 80000,
        categories: [
          { id: "1", name: "Needs (Rent, Bills, Groceries)", percentage: 50, color: "#10b981" },
          { id: "2", name: "Wants (Dining, Shopping)", percentage: 30, color: "#6366f1" },
          { id: "3", name: "Savings & Investments", percentage: 20, color: "#8b5cf6" },
        ],
      },

      setIncome: (income) => set((s) => ({ plan: { ...s.plan, income } })),

      setCategoryPercentage: (id, percentage) =>
        set((s) => ({
          plan: {
            ...s.plan,
            categories: s.plan.categories.map((c) =>
              c.id === id ? { ...c, percentage } : c
            ),
          },
        })),

      applyTemplate: (template) =>
        set((s) => {
          let categories = [...s.plan.categories];
          if (template === "50/30/20") {
            categories = [
              { id: "1", name: "Needs (Rent, Bills, Groceries)", percentage: 50, color: "#10b981" },
              { id: "2", name: "Wants (Dining, Shopping)", percentage: 30, color: "#6366f1" },
              { id: "3", name: "Savings & Investments", percentage: 20, color: "#8b5cf6" },
            ];
          } else if (template === "conservative") {
            categories = [
              { id: "1", name: "Needs (Rent, Bills, Groceries)", percentage: 40, color: "#10b981" },
              { id: "2", name: "Wants (Dining, Shopping)", percentage: 20, color: "#6366f1" },
              { id: "3", name: "Savings & Investments", percentage: 40, color: "#8b5cf6" },
            ];
          } else if (template === "zero") {
            categories = categories.map((c) => ({ ...c, percentage: 0 }));
          }
          return { plan: { ...s.plan, categories } };
        }),

      getBudget: (month) =>
        get().budgets[month] ?? { month, totalAmount: 80000, allocations: [...DEFAULT_BUDGET_ALLOCATIONS] },

      ensureCategoriesAllocated: (month, categories) =>
        set((s) => {
          const current = s.budgets[month] ?? { month, totalAmount: 80000, allocations: [...DEFAULT_BUDGET_ALLOCATIONS] };
          const existingIds = new Set(current.allocations.map((a) => a.categoryId));

          const missing = categories.filter((c) => !existingIds.has(c.name) && c.type !== "income");
          if (missing.length === 0) return s;

          const newAllocations = [
            ...current.allocations,
            ...missing.map((c) => ({ categoryId: c.name, percentage: 0, color: c.color })),
          ];

          return {
            budgets: {
              ...s.budgets,
              [month]: { ...current, allocations: newAllocations },
            },
          };
        }),

      setBudgetTotal: (month, total) =>
        set((s) => {
          const existing = s.budgets[month] ?? { month, totalAmount: total, allocations: [...DEFAULT_BUDGET_ALLOCATIONS] };
          return { budgets: { ...s.budgets, [month]: { ...existing, totalAmount: total } } };
        }),

      setAllocation: (month, categoryId, percentage) =>
        set((s) => {
          const budget = s.budgets[month] ?? { month, totalAmount: 80000, allocations: [...DEFAULT_BUDGET_ALLOCATIONS] };
          const exists = budget.allocations.some((a) => a.categoryId === categoryId);
          const newAllocations = exists
            ? budget.allocations.map((a) => (a.categoryId === categoryId ? { ...a, percentage } : a))
            : [...budget.allocations, { categoryId, percentage }];

          return {
            budgets: {
              ...s.budgets,
              [month]: { ...budget, allocations: newAllocations },
            },
          };
        }),

      setAllocationAmount: (month, categoryId, amount) =>
        set((s) => {
          const budget = s.budgets[month] ?? { month, totalAmount: 80000, allocations: [...DEFAULT_BUDGET_ALLOCATIONS] };
          const total = budget.totalAmount || 1;
          const percentage = Math.min(100, Math.max(0, Math.round((amount / total) * 100)));

          return {
            budgets: {
              ...s.budgets,
              [month]: {
                ...budget,
                allocations: budget.allocations.map((a) =>
                  a.categoryId === categoryId ? { ...a, percentage, customAmount: amount } : a
                ),
              },
            },
          };
        }),

      autoBalanceMonth: (month) =>
        set((s) => {
          const budget = s.budgets[month] ?? { month, totalAmount: 80000, allocations: [...DEFAULT_BUDGET_ALLOCATIONS] };
          if (budget.allocations.length === 0) return s;

          const perCat = Math.floor(100 / budget.allocations.length);
          const remainder = 100 - perCat * budget.allocations.length;

          const balanced = budget.allocations.map((a, idx) => ({
            ...a,
            percentage: perCat + (idx === 0 ? remainder : 0),
          }));

          return {
            budgets: {
              ...s.budgets,
              [month]: { ...budget, allocations: balanced },
            },
          };
        }),
    }),
    { name: "finely_budgets_store_v2" }
  )
);
