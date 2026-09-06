import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  const variants = {
    default:
      "border-transparent bg-slate-900 text-white shadow hover:bg-slate-800",
    secondary:
      "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200",
    destructive:
      "border-transparent bg-rose-50 text-rose-600 border-rose-100",
    success:
      "border-transparent bg-emerald-50 text-emerald-600 border-emerald-100",
    outline: "text-slate-950 border-slate-200",
  };

  return (
    <div className={cn(base, variants[variant], className)} {...props} />
  );
}
