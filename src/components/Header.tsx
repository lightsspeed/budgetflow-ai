"use client";

import { ReactNode } from "react";
import Dropdown, { DropdownItem } from "./Dropdown";
import DropdownMenu11 from "./dropdown-menu-11";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  onMonthChange?: (month: string) => void;
}

const MONTHS = [
  "January 2024", "February 2024", "March 2024", "April 2024",
  "May 2024", "June 2024", "July 2024", "August 2024",
  "September 2024", "October 2024", "November 2024", "December 2024",
];

export default function Header({ title, subtitle = "This Month", actions, onMonthChange }: HeaderProps) {
  return (
    <>
      <header className="hidden md:flex sticky top-0 w-full z-30 bg-white/80 backdrop-blur-md shadow-xs h-16 items-center px-6 justify-between border-b border-slate-100">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <>
              <div className="h-5 w-px bg-slate-200" />
              <Dropdown
                trigger={
                  <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-xs font-semibold bg-slate-100/80 hover:bg-slate-100 rounded-xl px-3 py-1.5 cursor-pointer">
                    <span className="material-symbols-outlined text-[16px] text-slate-500">
                      calendar_today
                    </span>
                    {subtitle}
                    <span className="material-symbols-outlined text-[16px] text-slate-400">
                      expand_more
                    </span>
                  </button>
                }
              >
                {MONTHS.map((m) => (
                  <DropdownItem
                    key={m}
                    active={m === subtitle}
                    onClick={() => onMonthChange?.(m)}
                    icon="calendar_month"
                  >
                    {m}
                  </DropdownItem>
                ))}
              </Dropdown>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          {actions}
          <DropdownMenu11
            align="end"
            trigger={
              <button className="text-slate-500 hover:text-slate-900 transition-colors p-2 rounded-xl hover:bg-slate-100 cursor-pointer relative">
                <span className="material-symbols-outlined text-xl">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
              </button>
            }
          />
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-700 flex items-center justify-center text-xs font-extrabold border border-emerald-500/20">
            U
          </div>
        </div>
      </header>
      <header className="md:hidden sticky top-0 w-full z-30 bg-white/80 backdrop-blur-md shadow-xs h-16 flex items-center justify-between px-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-700 flex items-center justify-center text-xs font-extrabold border border-emerald-500/20">
            B
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu11
            align="end"
            trigger={
              <button className="text-slate-500 hover:text-slate-900 transition-colors p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer relative">
                <span className="material-symbols-outlined text-lg">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </button>
            }
          />
          {subtitle && (
            <Dropdown
              trigger={
                <button className="flex items-center gap-1 text-slate-600 font-semibold text-xs bg-slate-100 rounded-xl px-2.5 py-1 cursor-pointer">
                  {subtitle}
                  <span className="material-symbols-outlined text-[16px]">
                    expand_more
                  </span>
                </button>
              }
              align="right"
            >
              {MONTHS.map((m) => (
                <DropdownItem
                  key={m}
                  active={m === subtitle}
                  onClick={() => onMonthChange?.(m)}
                  icon="calendar_month"
                >
                  {m}
                </DropdownItem>
              ))}
            </Dropdown>
          )}
        </div>
      </header>
    </>
  );
}
