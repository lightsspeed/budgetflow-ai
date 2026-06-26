"use client";

import { useTransactionStore } from "@/store/transactionStore";
import Header from "@/components/Header";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const MONTHLY_DATA = [
  { month: "Jun", income: 7200, expense: 4100 },
  { month: "Jul", income: 7200, expense: 3800 },
  { month: "Aug", income: 8100, expense: 4300 },
  { month: "Sep", income: 7600, expense: 3900 },
  { month: "Oct", income: 8450, expense: 3240 },
];

const CATEGORY_BREAKDOWN = [
  { name: "Housing", value: 1200, color: "#2a14b4" },
  { name: "Food", value: 680, color: "#006c49" },
  { name: "Transport", value: 420, color: "#553300" },
  { name: "Utilities", value: 310, color: "#744800" },
  { name: "Shopping", value: 250, color: "#4338ca" },
  { name: "Entertainment", value: 180, color: "#777586" },
  { name: "Health", value: 120, color: "#464554" },
  { name: "Other", value: 80, color: "#c7c4d7" },
];

export default function AnalyticsPage() {
  const transactions = useTransactionStore((s) => s.transactions);

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;

  return (
    <>
      <Header title="Analysis" subtitle="October 2023" />
      <div className="flex-1 p-4 md:p-gutter max-w-container-max mx-auto w-full space-y-xl overflow-x-hidden">
        {/* KPI Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card flex flex-col gap-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Monthly Income</span>
            <span className="font-headline-md text-headline-md font-bold text-secondary">${totalIncome.toFixed(2)}</span>
            <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1 mt-auto">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> +12.3% vs last mo
            </span>
          </div>
          <div className="card flex flex-col gap-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Monthly Expense</span>
            <span className="font-headline-md text-headline-md font-bold text-error">${totalExpense.toFixed(2)}</span>
            <span className="font-label-sm text-label-sm text-error flex items-center gap-1 mt-auto">
              <span className="material-symbols-outlined text-[14px]">trending_down</span> -5.1% vs last mo
            </span>
          </div>
          <div className="card flex flex-col gap-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Savings Rate</span>
            <span className="font-headline-md text-headline-md font-bold text-primary">{savingsRate.toFixed(1)}%</span>
            <div className="w-full bg-outline-variant/30 rounded-full h-1.5 mt-auto">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: `${Math.min(savingsRate, 100)}%` }} />
            </div>
          </div>
          <div className="card flex flex-col gap-2">
            <span className="font-label-sm text-label-sm text-on-surface-variant">Avg Daily Spend</span>
            <span className="font-headline-md text-headline-md font-bold text-on-surface">${(totalExpense / 31).toFixed(2)}</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-auto">Based on 31 days</span>
          </div>
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income vs Expense Trend */}
          <div className="card flex flex-col h-[380px] bg-surface-bright/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-label-md text-label-md text-on-surface-variant">Income vs Expense</h3>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Last 5 months</span>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#777586" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#777586" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip
                    contentStyle={{ background: "#fff", border: "1px solid #c7c4d7", borderRadius: 8, fontSize: 12 }}
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, undefined]}
                  />
                  <Line type="monotone" dataKey="income" stroke="#2a14b4" strokeWidth={2} dot={{ fill: "#2a14b4", r: 4 }} />
                  <Line type="monotone" dataKey="expense" stroke="#ba1a1a" strokeWidth={2} dot={{ fill: "#ba1a1a", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="card flex flex-col h-[380px] bg-surface-bright/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-label-md text-label-md text-on-surface-variant">Spending by Category</h3>
              <span className="font-label-sm text-label-sm text-on-surface-variant">This month</span>
            </div>
            <div className="flex-1 flex items-center gap-4">
              <ResponsiveContainer width="50%" height="100%">
                <PieChart>
                  <Pie data={CATEGORY_BREAKDOWN} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2} dataKey="value" stroke="none">
                    {CATEGORY_BREAKDOWN.map((e) => (
                      <Cell key={e.name} fill={e.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${Number(value)}`, undefined]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 text-sm w-1/2">
                {CATEGORY_BREAKDOWN.map((c) => (
                  <div key={c.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="font-label-sm text-label-sm text-on-surface-variant">{c.name}</span>
                    </div>
                    <span className="font-mono-data text-mono-data text-on-surface">${c.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Monthly Comparison */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card flex flex-col h-[320px] bg-surface-bright/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-label-md text-label-md text-on-surface-variant">Monthly Comparison</h3>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Income vs Expense</span>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MONTHLY_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#777586" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#777586" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip
                    contentStyle={{ background: "#fff", border: "1px solid #c7c4d7", borderRadius: 8, fontSize: 12 }}
                    formatter={(value) => [`$${Number(value).toFixed(2)}`, undefined]}
                  />
                  <Bar dataKey="income" fill="#2a14b4" radius={[4, 4, 0, 0]} maxBarSize={30} />
                  <Bar dataKey="expense" fill="#ba1a1a" radius={[4, 4, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Categories */}
          <div className="card flex flex-col gap-4">
            <h3 className="font-label-md text-label-md text-on-surface-variant">Top Spending Categories</h3>
            <div className="flex flex-col gap-3">
              {CATEGORY_BREAKDOWN.sort((a, b) => b.value - a.value).map((cat, i) => (
                <div key={cat.name} className="flex items-center gap-3">
                  <span className="font-label-sm text-label-sm text-on-surface-variant w-6 text-right">{i + 1}</span>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${cat.color}20` }}>
                    <span className="material-symbols-outlined text-[16px]" style={{ color: cat.color }}>
                      {["home", "restaurant", "directions_car", "bolt", "shopping_bag", "movie", "favorite", "more_horiz"][i]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-label-sm text-label-sm text-on-surface">{cat.name}</span>
                      <span className="font-mono-data text-mono-data text-on-surface">${cat.value}</span>
                    </div>
                    <div className="w-full bg-outline-variant/20 rounded-full h-1.5">
                      <div className="h-full rounded-full" style={{ width: `${(cat.value / CATEGORY_BREAKDOWN[0].value) * 100}%`, backgroundColor: cat.color }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
