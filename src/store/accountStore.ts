"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AccountType = "bank" | "credit" | "savings" | "cash" | "investment";

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  initialBalance: number;
  accountNumber?: string;
  color: string;
  note?: string;
}

export const DEFAULT_ACCOUNTS: Account[] = [];

interface AccountState {
  accounts: Account[];
  addAccount: (acc: Omit<Account, "id">) => void;
  updateAccount: (id: string, partial: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      accounts: DEFAULT_ACCOUNTS,

      addAccount: (acc) =>
        set((s) => ({
          accounts: [
            ...s.accounts,
            { ...acc, id: `acc-${Date.now()}` },
          ],
        })),

      updateAccount: (id, partial) =>
        set((s) => ({
          accounts: s.accounts.map((a) => (a.id === id ? { ...a, ...partial } : a)),
        })),

      deleteAccount: (id) =>
        set((s) => ({
          accounts: s.accounts.filter((a) => a.id !== id),
        })),
    }),
    { name: "finely_accounts_store" }
  )
);
