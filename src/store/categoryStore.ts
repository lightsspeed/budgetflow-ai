"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;    // hex for inline styles
  bgClass: string;  // tailwind bg class
  type: "expense" | "income" | "both";
}

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat-1", name: "Food & Dining",     emoji: "🍔", color: "#f59e0b", bgClass: "bg-amber-400",   type: "expense" },
  { id: "cat-2", name: "Transport",         emoji: "🚗", color: "#3b82f6", bgClass: "bg-blue-500",    type: "expense" },
  { id: "cat-3", name: "Shopping",          emoji: "🛍️", color: "#f43f5e", bgClass: "bg-rose-500",    type: "expense" },
  { id: "cat-4", name: "Bills & Utilities", emoji: "⚡", color: "#8b5cf6", bgClass: "bg-violet-500",  type: "expense" },
  { id: "cat-5", name: "Entertainment",     emoji: "🎬", color: "#6366f1", bgClass: "bg-indigo-500",  type: "expense" },
  { id: "cat-6", name: "Income",            emoji: "💰", color: "#10b981", bgClass: "bg-emerald-500", type: "income"  },
  { id: "cat-7", name: "Health & Medical",  emoji: "❤️", color: "#ef4444", bgClass: "bg-red-500",     type: "expense" },
  { id: "cat-8", name: "Education",         emoji: "📚", color: "#0ea5e9", bgClass: "bg-sky-500",     type: "expense" },
  { id: "cat-9", name: "Other",             emoji: "📦", color: "#64748b", bgClass: "bg-slate-500",   type: "both"    },
];

interface CategoryState {
  categories: Category[];
  addCategory: (c: Omit<Category, "id">) => void;
  updateCategory: (id: string, partial: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set) => ({
      categories: DEFAULT_CATEGORIES,
      addCategory: (c) =>
        set((s) => ({
          categories: [...s.categories, { ...c, id: `cat-${Date.now()}` }],
        })),
      updateCategory: (id, partial) =>
        set((s) => ({
          categories: s.categories.map((c) => (c.id === id ? { ...c, ...partial } : c)),
        })),
      deleteCategory: (id) =>
        set((s) => ({
          categories: s.categories.filter((c) => c.id !== id),
        })),
    }),
    { name: "finely_categories" }
  )
);
