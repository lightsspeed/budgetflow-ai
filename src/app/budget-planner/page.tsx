"use client";

import { useBudgetStore } from "@/store/budgetStore";
import { BudgetTemplate } from "@/types";

const CIRCUMFERENCE = 2 * Math.PI * 45;

export default function BudgetPlannerPage() {
  const { plan, setIncome, setCategoryPercentage, applyTemplate } =
    useBudgetStore();

  const totalPct = plan.categories.reduce((s, c) => s + c.percentage, 0);
  const totalAmount = plan.categories.reduce(
    (s, c) => s + (plan.income * c.percentage) / 100,
    0
  );
  const remaining = plan.income - totalAmount;

  const status =
    totalPct === 100 ? "valid" : totalPct > 100 ? "over" : "under";
  const visualPct = Math.min(totalPct, 100);
  const offset = CIRCUMFERENCE - (visualPct / 100) * CIRCUMFERENCE;

  const handleTemplate = (template: BudgetTemplate) => {
    applyTemplate(template);
  };

  return (
    <>
      <header className="md:hidden bg-surface/80 backdrop-blur-md shadow-sm fixed top-0 w-full z-40 flex justify-between items-center h-16 px-6">
        <h1 className="font-headline-md text-headline-md font-bold text-primary">
          BudgetFlow AI
        </h1>
        <div className="flex items-center gap-4">
          <button className="text-on-surface-variant">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-label-md text-label-md font-bold border border-outline-variant/30">
            U
          </div>
        </div>
      </header>
      <div className="pt-20 md:pt-8 pb-24 md:pb-8 px-4 md:px-8 max-w-container-max mx-auto w-full">
        <header className="mb-xl flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
              Monthly Allocation
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Design your financial blueprint for the month.
            </p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl p-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] border border-outline-variant/20 flex items-center gap-4 w-full md:w-auto">
            <div className="bg-primary-container/10 p-3 rounded-lg text-primary">
              <span
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                payments
              </span>
            </div>
            <div className="flex-grow">
              <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                Expected Income
              </label>
              <div className="flex items-center">
                <span className="font-headline-md text-headline-md text-on-surface mr-1">
                  $
                </span>
                <input
                  type="number"
                  value={plan.income}
                  onChange={(e) => setIncome(Number(e.target.value))}
                  className="font-headline-md text-headline-md text-on-surface bg-transparent border-none p-0 focus:ring-0 w-32 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>
          </div>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-8 flex flex-col gap-md">
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => handleTemplate("50/30/20")}
                className="px-4 py-2 rounded-full font-label-md text-label-md bg-surface-container border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition-colors"
              >
                50/30/20 Rule
              </button>
              <button
                onClick={() => handleTemplate("conservative")}
                className="px-4 py-2 rounded-full font-label-md text-label-md bg-surface-container border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition-colors"
              >
                Conservative
              </button>
              <button
                onClick={() => handleTemplate("zero")}
                className="px-4 py-2 rounded-full font-label-md text-label-md bg-surface-container border border-outline-variant/30 text-on-surface hover:bg-surface-container-high transition-colors"
              >
                Reset
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {plan.categories.map((cat, i) => (
                <div
                  key={cat.id}
                  className="glass rounded-xl p-md flex flex-col gap-4"
                  style={{ animationDelay: `${0.1 * (i + 1)}s` }}
                >
                  <div className="flex justify-between items-center">
                    <div
                      className="flex items-center gap-2"
                      style={{ color: cat.color }}
                    >
                      <span className="material-symbols-outlined">
                        {cat.icon}
                      </span>
                      <h3 className="font-label-md text-label-md font-bold">
                        {cat.name}
                      </h3>
                    </div>
                    <span className="font-mono-data text-mono-data text-on-surface-variant">
                      ${Math.round((plan.income * cat.percentage) / 100)} (
                      {cat.percentage}%)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={cat.percentage}
                    onChange={(e) =>
                      setCategoryPercentage(cat.id, Number(e.target.value))
                    }
                    className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <p className="font-label-sm text-label-sm text-outline">
                    {cat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-md">
            <div className="bg-surface-container-lowest rounded-xl p-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] border border-outline-variant/20 flex flex-col items-center sticky top-24">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-8">
                Allocation Status
              </h3>
              <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    stroke="#eff4ff"
                    strokeWidth="10"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="transparent"
                    stroke={
                      status === "valid"
                        ? "#2a14b4"
                        : status === "over"
                        ? "#ba1a1a"
                        : "#744800"
                    }
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    strokeWidth="10"
                    className="transition-all duration-300"
                    style={{ transition: "stroke-dashoffset 0.3s ease" }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span
                    className={`font-display-lg text-display-lg ${
                      status === "valid"
                        ? "text-primary"
                        : status === "over"
                        ? "text-error"
                        : "text-tertiary-container"
                    }`}
                  >
                    {totalPct}%
                  </span>
                  <span
                    className={`font-label-sm text-label-sm mt-1 px-2 py-1 rounded-md flex items-center gap-1 ${
                      status === "valid"
                        ? "text-secondary bg-secondary/10"
                        : status === "over"
                        ? "text-error bg-error/10"
                        : "text-tertiary-container bg-tertiary-container/10"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {status === "valid"
                        ? "check_circle"
                        : status === "over"
                        ? "warning"
                        : "info"}
                    </span>
                    {status === "valid"
                      ? "Valid"
                      : status === "over"
                      ? "Over allocated"
                      : "Under allocated"}
                  </span>
                </div>
              </div>

              <div className="w-full flex flex-col gap-2 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Allocated:
                  </span>
                  <span className="font-mono-data text-mono-data font-bold text-on-surface">
                    ${Math.round(totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Remaining:
                  </span>
                  <span className="font-mono-data text-mono-data font-bold text-on-surface">
                    ${Math.round(remaining)}
                  </span>
                </div>
                <div className="w-full h-1 bg-surface-container-high rounded-full mt-2 overflow-hidden flex">
                  {plan.categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  ))}
                </div>
              </div>

              <button
                disabled={status !== "valid"}
                className="w-full bg-primary text-on-primary py-3 px-6 rounded-lg font-label-md text-label-md font-bold shadow-sm hover:bg-primary/90 hover:shadow-md transition-all border-t border-white/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm"
              >
                Save Budget
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
