"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_MAIN = [
  { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
  { href: "/transactions", icon: "receipt_long", label: "Transactions" },
  { href: "/budget-planner", icon: "account_balance_wallet", label: "Budget" },
];

const NAV_SECONDARY = [
  { href: "/goals", icon: "ads_click", label: "Goals" },
  { href: "/analytics", icon: "monitoring", label: "Analysis" },
  { href: "/ai-chat", icon: "smart_toy", label: "AI Chat" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[280px] flex-col z-40 bg-surface/90 backdrop-blur-xl border-r border-outline-variant/20 shadow-[2px_0_12px_-4px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col h-full py-6 px-4">
        <div className="flex items-center gap-3 mb-10 px-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-on-primary font-headline-md shadow-sm transition-transform duration-200 group-hover:scale-105">
            B
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary leading-tight">
              BudgetFlow AI
            </h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant/70">
              Premium Plan
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-1 overflow-y-auto hide-scrollbar">
          <span className="font-label-sm text-label-sm text-on-surface-variant/50 px-3 pb-2 pt-1 uppercase tracking-widest text-[11px]">
            Main
          </span>
          {NAV_MAIN.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-200 font-label-md text-label-md ${
                  isActive
                    ? "bg-primary/8 text-primary font-semibold"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-primary" />
                )}
                <span
                  className="material-symbols-outlined text-[22px] transition-all duration-200"
                  style={
                    isActive
                      ? { fontVariationSettings: "'FILL' 1" }
                      : undefined
                  }
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}

          <span className="font-label-sm text-label-sm text-on-surface-variant/50 px-3 pb-2 pt-5 uppercase tracking-widest text-[11px]">
            Insights
          </span>
          {NAV_SECONDARY.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`group relative flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-200 font-label-md text-label-md ${
                  isActive
                    ? "bg-primary/8 text-primary font-semibold"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-primary" />
                )}
                <span
                  className="material-symbols-outlined text-[22px] transition-all duration-200"
                  style={
                    isActive
                      ? { fontVariationSettings: "'FILL' 1" }
                      : undefined
                  }
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-4 mb-4">
          <button className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-label-md text-label-md py-2.5 shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98]">
            <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">
                workspace_premium
              </span>
              Upgrade Now
            </span>
          </button>
        </div>

        <div className="border-t border-outline-variant/20 pt-3 flex gap-1">
          <Link
            href="#"
            className="flex-1 flex items-center justify-center gap-2 text-on-surface-variant/60 hover:text-on-surface-variant hover:bg-surface-container-high rounded-lg py-2 transition-all duration-200 font-label-sm text-label-sm"
          >
            <span className="material-symbols-outlined text-[18px]">
              settings
            </span>
          </Link>
          <button className="flex-1 flex items-center justify-center gap-2 text-on-surface-variant/60 hover:text-on-surface-variant hover:bg-surface-container-high rounded-lg py-2 transition-all duration-200 font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-[18px]">
              contrast
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}
