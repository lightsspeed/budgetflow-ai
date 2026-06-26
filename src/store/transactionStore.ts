"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Transaction } from "@/types";

interface TransactionState {
  transactions: Transaction[];
  searchQuery: string;
  categoryFilter: string;
  dateFilter: string;
  viewMode: "table" | "cards";
  currentPage: number;
  pageSize: number;
  addTransaction: (t: Transaction) => void;
  updateTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setSearchQuery: (q: string) => void;
  setCategoryFilter: (c: string) => void;
  setDateFilter: (d: string) => void;
  setViewMode: (v: "table" | "cards") => void;
  setCurrentPage: (p: number) => void;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: [],
      searchQuery: "",
      categoryFilter: "All Categories",
      dateFilter: "This Month",
      viewMode: "table",
      currentPage: 1,
      pageSize: 10,
      addTransaction: (t) =>
        set((s) => ({ transactions: [t, ...s.transactions] })),
      updateTransaction: (id, partial) =>
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, ...partial } : t
          ),
        })),
      deleteTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        })),
      setSearchQuery: (q) => set({ searchQuery: q, currentPage: 1 }),
      setCategoryFilter: (c) => set({ categoryFilter: c, currentPage: 1 }),
      setDateFilter: (d) => set({ dateFilter: d, currentPage: 1 }),
      setViewMode: (v) => set({ viewMode: v }),
      setCurrentPage: (p) => set({ currentPage: p }),
    }),
    { name: "transactions" }
  )
);

export function getFilteredTransactions(state: TransactionState) {
  let filtered = state.transactions;
  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        t.merchant.toLowerCase().includes(q) ||
        t.notes.toLowerCase().includes(q)
    );
  }
  if (state.categoryFilter !== "All Categories") {
    filtered = filtered.filter((t) => t.category === state.categoryFilter);
  }
  const start = (state.currentPage - 1) * state.pageSize;
  const end = Math.min(start + state.pageSize, filtered.length);
  return {
    items: filtered.slice(start, end),
    total: filtered.length,
    totalPages: Math.max(Math.ceil(filtered.length / state.pageSize), 1),
  };
}
