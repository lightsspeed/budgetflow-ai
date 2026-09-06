"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  merchant: string;
  account: string;
  category: string;
  notes: string;
  amount: number;
  type: "income" | "expense";
}

const DEFAULT_TRANSACTIONS: Transaction[] = [];

interface TransactionState {
  transactions: Transaction[];
  searchQuery: string;
  categoryFilter: string;
  dateFilter: string;
  addTransaction: (t: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, partial: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  setSearchQuery: (q: string) => void;
  setCategoryFilter: (c: string) => void;
  setDateFilter: (d: string) => void;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: DEFAULT_TRANSACTIONS,
      searchQuery: "",
      categoryFilter: "All",
      dateFilter: "September 2026",
      addTransaction: (t) =>
        set((s) => ({
          transactions: [
            { ...t, id: `tx-${Date.now()}` },
            ...s.transactions,
          ],
        })),
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
      setSearchQuery: (q) => set({ searchQuery: q }),
      setCategoryFilter: (c) => set({ categoryFilter: c }),
      setDateFilter: (d) => set({ dateFilter: d }),
    }),
    { name: "finely_transactions" }
  )
);
