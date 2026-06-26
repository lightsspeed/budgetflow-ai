"use client";

import { ReactNode } from "react";
import Dropdown, { DropdownItem } from "./Dropdown";

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
      <header className="hidden md:flex sticky top-0 w-full z-30 bg-surface/80 backdrop-blur-md shadow-sm h-16 items-center px-6 justify-between border-b-0">
        <div className="flex items-center gap-4">
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
            {title}
          </h2>
          {subtitle && (
            <>
              <div className="h-6 w-px bg-outline-variant/50" />
              <Dropdown
                trigger={
                  <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md glass rounded-lg px-3 py-1.5 cursor-pointer">
                    <span className="material-symbols-outlined text-[18px]">
                      calendar_today
                    </span>
                    {subtitle}
                    <span className="material-symbols-outlined text-[18px]">
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
          <button className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-surface-container-high">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-label-md text-label-md font-bold border border-outline-variant/30">
            U
          </div>
        </div>
      </header>
      <header className="md:hidden sticky top-0 w-full z-30 bg-surface/80 backdrop-blur-md shadow-sm h-16 flex items-center justify-between px-4 border-b-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-headline-md text-[16px] font-bold">
            B
          </div>
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-on-surface">
            {title}
          </h2>
        </div>
        {subtitle && (
          <Dropdown
            trigger={
              <button className="flex items-center gap-1 text-on-surface-variant font-label-sm text-label-sm glass rounded-lg px-2 py-1 cursor-pointer">
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
              >
                {m}
              </DropdownItem>
            ))}
          </Dropdown>
        )}
      </header>
    </>
  );
}
