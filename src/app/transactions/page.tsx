"use client";

import { useState } from "react";
import { useTransactionStore, getFilteredTransactions } from "@/store/transactionStore";
import AddTransactionModal from "@/components/AddTransactionModal";
import Dropdown, { DropdownItem } from "@/components/Dropdown";

const CATEGORIES = [
  "All Categories",
  "Groceries", "Salary", "Entertainment", "Dining", "Transport",
  "Utilities", "Shopping", "Freelance", "Health", "Rent", "Insurance", "Other",
];

const DATE_FILTERS = ["This Month", "Last Month", "Last 3 Months", "This Year", "All Time"];

const ACCOUNTS = [
  "All Accounts",
  "Credit Card •••• 4211",
  "Checking •••• 9920",
  "Debit Card •••• 1122",
  "Savings •••• 3344",
];

const categoryColors: Record<string, string> = {
  Groceries: "bg-secondary",
  Salary: "bg-secondary",
  Entertainment: "bg-tertiary",
  Dining: "bg-primary",
  Transport: "bg-outline",
  Utilities: "bg-primary-container",
  Shopping: "bg-on-surface-variant",
  Freelance: "bg-secondary",
  Health: "bg-tertiary",
  Rent: "bg-primary",
  Insurance: "bg-on-surface",
  Other: "bg-outline",
};

export default function TransactionsPage() {
  const store = useTransactionStore();
  const { items, total, totalPages } = getFilteredTransactions(store);
  const [showModal, setShowModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <>
      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} />}

      <header className="md:hidden bg-surface/80 backdrop-blur-md shadow-sm fixed top-0 w-full z-40 flex justify-between items-center h-16 px-6">
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-primary tracking-tight">
          Transactions
        </h1>
        <div className="flex items-center gap-4">
          <button className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-label-md text-label-md font-bold border border-outline-variant/30">
            U
          </div>
        </div>
      </header>

      <div className="pt-20 md:pt-8 pb-24 md:pb-8 px-4 md:px-8 max-w-container-max mx-auto w-full flex flex-col gap-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 w-full">
          <div>
            <h2 className="hidden md:block font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight mb-1">
              Transactions
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Review and manage your financial activity.
            </p>
          </div>
          <div className="flex items-center gap-3 self-end md:self-auto w-full md:w-auto">
            <div className="bg-surface-container-low rounded-lg p-1 flex shadow-sm border border-outline-variant/30">
              <button
                onClick={() => store.setViewMode("table")}
                className={`px-4 py-1.5 rounded-md text-label-md text-label-sm flex items-center gap-2 transition-all ${
                  store.viewMode === "table"
                    ? "bg-surface shadow-sm text-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">table_rows</span>
                <span className="hidden sm:inline">Table</span>
              </button>
              <button
                onClick={() => store.setViewMode("cards")}
                className={`px-4 py-1.5 rounded-md text-label-md text-label-sm flex items-center gap-2 transition-all ${
                  store.viewMode === "cards"
                    ? "bg-surface shadow-sm text-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">grid_view</span>
                <span className="hidden sm:inline">Cards</span>
              </button>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md text-label-md shadow-sm hover:shadow-md transition-all active:scale-95 flex items-center gap-2 ml-auto md:ml-0"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>New</span>
            </button>
          </div>
        </div>

        <div className="glass rounded-xl p-md shadow-sm border border-outline-variant/40 flex flex-col xl:flex-row gap-4 items-center justify-between w-full">
          <div className="relative w-full xl:w-96">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Search transactions..."
              value={store.searchQuery}
              onChange={(e) => store.setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg font-body-sm text-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-on-surface placeholder:text-outline shadow-sm"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
            <Dropdown
              trigger={
                <button className="flex items-center gap-2 px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-label-sm text-label-sm text-on-surface hover:border-primary transition-colors shadow-sm whitespace-nowrap cursor-pointer">
                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                  {store.dateFilter}
                  <span className="material-symbols-outlined text-[16px] ml-1">expand_more</span>
                </button>
              }
            >
              {DATE_FILTERS.map((d) => (
                <DropdownItem key={d} active={d === store.dateFilter} onClick={() => store.setDateFilter(d)}>
                  {d}
                </DropdownItem>
              ))}
            </Dropdown>

            <div className="relative">
              <select
                value={store.categoryFilter}
                onChange={(e) => store.setCategoryFilter(e.target.value)}
                className="appearance-none flex items-center gap-2 px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-label-sm text-label-sm text-on-surface hover:border-primary transition-colors shadow-sm whitespace-nowrap pr-8 cursor-pointer"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 material-symbols-outlined text-[16px] text-on-surface pointer-events-none">
                expand_more
              </span>
            </div>

            <Dropdown
              trigger={
                <button className="flex items-center gap-2 px-3 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg font-label-sm text-label-sm text-on-surface hover:border-primary transition-colors shadow-sm whitespace-nowrap cursor-pointer">
                  <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
                  All Accounts
                  <span className="material-symbols-outlined text-[16px] ml-1">expand_more</span>
                </button>
              }
            >
              {ACCOUNTS.map((a) => (
                <DropdownItem key={a} icon="account_balance_wallet">{a}</DropdownItem>
              ))}
            </Dropdown>

            <button className="flex items-center gap-2 px-3 py-2 text-primary hover:bg-primary/5 rounded-lg font-label-sm text-label-sm transition-colors whitespace-nowrap ml-auto xl:ml-0">
              <span className="material-symbols-outlined text-[16px]">tune</span>
              More Filters
            </button>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/40 overflow-hidden flex flex-col w-full relative">
          <div className="overflow-x-auto w-full">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[28px] text-on-surface-variant">receipt_long</span>
                </div>
                <h3 className="font-headline-md text-headline-md font-semibold text-on-surface mb-1">No transactions yet</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-6 max-w-sm">
                  Add your first transaction to start tracking your finances.
                </p>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-primary text-on-primary px-5 py-2.5 rounded-lg font-label-md text-label-md shadow-sm hover:bg-primary/90 transition-all active:scale-95 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Add Transaction
                </button>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/30">
                    <th className="py-3 px-4 w-12">
                      <input
                        type="checkbox"
                        className="rounded border-outline-variant text-primary focus:ring-primary"
                        onChange={() => {
                          if (selectedIds.size === items.length) setSelectedIds(new Set());
                          else setSelectedIds(new Set(items.map((i) => i.id)));
                        }}
                        checked={selectedIds.size === items.length && items.length > 0}
                      />
                    </th>
                    <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-medium cursor-pointer hover:text-on-surface transition-colors w-32">
                      <div className="flex items-center gap-1">
                        Date <span className="material-symbols-outlined text-[14px]">arrow_downward</span>
                      </div>
                    </th>
                    <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-medium w-64">Transaction</th>
                    <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-medium w-48">Category</th>
                    <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-medium">Notes</th>
                    <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant font-medium text-right w-32">Amount</th>
                    <th className="py-3 px-4 w-16" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {items.map((t) => (
                    <tr
                      key={t.id}
                      className="bg-surface-container-lowest transition-all duration-150 hover:bg-surface-container-lowest hover:shadow-sm hover:-translate-y-[1px] group"
                    >
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          className="rounded border-outline-variant text-primary focus:ring-primary"
                          checked={selectedIds.has(t.id)}
                          onChange={() => toggleSelect(t.id)}
                        />
                      </td>
                      <td className="py-4 px-4 font-mono-data text-mono-data text-on-surface-variant whitespace-nowrap">{t.date}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0 border border-outline-variant/20">
                            <span className="material-symbols-outlined text-[20px]">
                              {t.type === "income" ? "payments" : "shopping_cart"}
                            </span>
                          </div>
                          <div>
                            <p className="font-label-md text-label-md text-on-surface font-medium truncate max-w-[200px]">{t.description}</p>
                            <p className="font-body-sm text-body-sm text-on-surface-variant truncate max-w-[200px]">{t.account}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low text-on-surface border border-outline-variant/30">
                          <div className={`w-2 h-2 rounded-full ${categoryColors[t.category] || "bg-outline"}`} />
                          <span className="font-label-sm text-label-sm">{t.category}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-body-sm text-body-sm text-on-surface-variant truncate max-w-[150px]">{t.notes}</td>
                      <td className="py-4 px-4 text-right">
                        <span className={`font-mono-data text-mono-data font-medium ${t.type === "income" ? "text-secondary" : "text-on-surface"}`}>
                          {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => store.deleteTransaction(t.id)}
                            className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/5 rounded-md transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-outline-variant/30 px-6 py-4 flex items-center justify-between bg-surface-container-lowest">
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Showing {(store.currentPage - 1) * store.pageSize + 1} to {Math.min(store.currentPage * store.pageSize, total)} of {total} entries
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={store.currentPage === 1}
                  onClick={() => store.setCurrentPage(store.currentPage - 1)}
                  className="p-1.5 border border-outline-variant rounded-md text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => store.setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md font-label-sm text-label-sm ${
                      page === store.currentPage
                        ? "bg-primary text-on-primary shadow-sm"
                        : "text-on-surface-variant hover:bg-surface-container-low transition-colors"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  disabled={store.currentPage === totalPages}
                  onClick={() => store.setCurrentPage(store.currentPage + 1)}
                  className="p-1.5 border border-outline-variant rounded-md text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
