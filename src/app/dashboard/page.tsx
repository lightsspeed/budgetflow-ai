"use client";

import { useBudgetStore } from "@/store/budgetStore";
import { useTransactionStore } from "@/store/transactionStore";
import Header from "@/components/Header";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BAR_DATA = [
  { name: "Housing", value: 60, fill: "#2a14b4" },
  { name: "Food", value: 40, fill: "#553300" },
  { name: "Transp.", value: 30, fill: "#006c49" },
  { name: "Utils", value: 50, fill: "#4338ca" },
  { name: "Ent.", value: 20, fill: "#777586" },
];

export default function DashboardPage() {
  const categories = useBudgetStore((s) => s.plan.categories);
  const transactions = useTransactionStore((s) => s.transactions);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalSpent = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const remaining = totalIncome - totalSpent;

  const donutData = categories.filter((c) => c.percentage > 0);

  return (
    <>
      <Header title="Dashboard" subtitle="October 2023" />
      <div className="flex-1 p-4 md:p-gutter max-w-container-max mx-auto w-full space-y-xl overflow-x-hidden">
        <section className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <SummaryCard
            label="Total Income"
            value={`$${totalIncome.toFixed(2)}`}
            trend={{ value: "2.4% vs last mo", up: true }}
            icon="trending_up"
            iconColor="text-secondary"
          />
          <SummaryCard
            label="Total Spent"
            value={`$${totalSpent.toFixed(2)}`}
            trend={{ value: "5.1% vs last mo", up: true }}
            icon="trending_down"
            iconColor="text-error"
          />
          <SummaryCard
            label="Remaining"
            value={`$${remaining.toFixed(2)}`}
            progress={65}
            highlighted
            icon="account_balance_wallet"
            iconColor="text-primary"
          />
          <SummaryCard
            label="Savings"
            value="$2,100.00"
            subtext="Target: $3k/mo"
            icon="savings"
            iconColor="text-tertiary"
          />
          <SummaryCard
            label="Investments"
            value="$1,000.00"
            trend={{ value: "+8.2% YTD", up: true }}
            icon="show_chart"
            iconColor="text-secondary"
          />
          <SummaryCard
            label="Insurance"
            value="$300.00"
            subtext="Fixed Monthly"
            icon="security"
            iconColor="text-outline"
          />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card lg:col-span-1 flex flex-col h-[380px] bg-surface-bright/50">
            <h3 className="font-label-md text-label-md text-on-surface-variant mb-4">
              Budget Allocation
            </h3>
            <div className="flex-1 relative flex items-center justify-center">
              <ResponsiveContainer width={200} height={200}>
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="percentage"
                    stroke="none"
                  >
                    {donutData.map((entry) => (
                      <Cell key={entry.id} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <span className="font-headline-md text-headline-md font-bold text-on-surface">
                  {categories.reduce((s, c) => s + c.percentage, 0)}%
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Allocated
                </span>
              </div>
            </div>
            <div className="flex justify-center gap-4 mt-4 font-label-sm text-label-sm">
              {donutData.map((c) => (
                <div key={c.id} className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  {c.name}
                </div>
              ))}
            </div>
          </div>

          <div className="card lg:col-span-2 flex flex-col h-[380px] bg-surface-bright/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-label-md text-label-md text-on-surface-variant">
                Spending by Category
              </h3>
              <button className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[20px]">
                  more_horiz
                </span>
              </button>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={BAR_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12, fill: "#777586" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      background: "#ffffff",
                      border: "1px solid #c7c4d7",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                    {BAR_DATA.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass rounded-xl p-6 lg:col-span-2 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="flex items-start gap-4 relative z-10">
              <div className="w-10 h-10 rounded-full bg-primary-container text-primary flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined">smart_toy</span>
              </div>
              <div>
                <h3 className="font-label-md text-label-md text-on-surface font-semibold mb-1">
                  AI Financial Insight
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                  Your dining spending has increased by{" "}
                  <span className="text-error font-semibold">18%</span> this
                  month compared to your 6-month average. Consider cooking at
                  home twice more this week to stay within your $400 goal.
                </p>
                <button className="font-label-md text-label-md text-primary hover:text-primary/80 transition-colors flex items-center gap-1 font-semibold">
                  Review Dining Transactions{" "}
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="card flex flex-col justify-center gap-4">
            <h3 className="font-label-md text-label-md text-on-surface-variant mb-2">
              Quick Actions
            </h3>
            <button className="w-full bg-primary text-on-primary font-label-md text-label-md py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors shadow-sm active:scale-95 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[20px]">add</span>
              Add Expense
            </button>
            <button className="w-full bg-surface-container border border-outline-variant/50 text-on-surface font-label-md text-label-md py-3 px-4 rounded-lg hover:bg-surface-container-high transition-colors shadow-sm active:scale-95 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[20px]">
                forum
              </span>
              Ask AI
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

function SummaryCard({
  label,
  value,
  trend,
  progress,
  subtext,
  icon,
  iconColor,
  highlighted,
}: {
  label: string;
  value: string;
  trend?: { value: string; up: boolean };
  progress?: number;
  subtext?: string;
  icon: string;
  iconColor: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`card flex flex-col gap-2 ${
        highlighted ? "bg-primary/5 border-primary/20" : ""
      }`}
    >
      <div className="flex items-center justify-between text-on-surface-variant">
        <span className="font-label-sm text-label-sm">{label}</span>
        <span className={`material-symbols-outlined text-[20px] ${iconColor}`}>
          {icon}
        </span>
      </div>
      <div className="font-headline-md text-headline-md font-bold text-on-surface">
        {value}
      </div>
      {trend && (
        <div
          className={`font-label-sm text-label-sm flex items-center gap-1 mt-auto ${
            trend.up ? "text-secondary" : "text-error"
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">
            {trend.up ? "arrow_upward" : "arrow_downward"}
          </span>
          {trend.value}
        </div>
      )}
      {subtext && (
        <div className="font-label-sm text-label-sm text-on-surface-variant mt-auto">
          {subtext}
        </div>
      )}
      {progress !== undefined && (
        <div className="w-full bg-outline-variant/30 rounded-full h-1.5 mt-auto">
          <div
            className="bg-primary h-1.5 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
