"use client";

import React, { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  className?: string;
}

export default function Dropdown({ trigger, children, align = "left", className }: DropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="inline-block cursor-pointer outline-none">{trigger}</div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 p-1.5 shadow-xl shadow-slate-900/10 min-w-[180px] z-50 animate-in fade-in-80 zoom-in-95 ${className || ""}`}
        align={align === "right" ? "end" : "start"}
      >
        <DropdownMenuGroup className="flex flex-col gap-0.5">
          {children}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DropdownItem({
  onClick,
  active,
  children,
  icon,
  className,
}: {
  onClick?: () => void;
  active?: boolean;
  children: ReactNode;
  icon?: string;
  className?: string;
}) {
  return (
    <DropdownMenuItem
      onClick={onClick}
      className={`group flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all outline-none ${
        active
          ? "bg-slate-100/90 text-slate-900 font-bold"
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      } ${className || ""}`}
    >
      {icon && (
        <span className="material-symbols-outlined text-[16px] text-slate-500 transition-transform duration-200 group-hover:scale-110">
          {icon}
        </span>
      )}
      <span className="flex-1 truncate">{children}</span>
      {active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
    </DropdownMenuItem>
  );
}
