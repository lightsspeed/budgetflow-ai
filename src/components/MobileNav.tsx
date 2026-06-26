"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", icon: "home", label: "Home" },
  { href: "/transactions", icon: "account_balance_wallet", label: "Wallets" },
  { href: "/add", icon: "add", label: "Add", primary: true },
  { href: "/transactions", icon: "stars", label: "Goals" },
  { href: "/ai-chat", icon: "forum", label: "Chat" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 bg-surface/90 backdrop-blur-lg shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] rounded-t-xl border-t-0">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        if (item.primary) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center text-primary -translate-y-4 scale-90 duration-200"
            >
              <div className="bg-primary text-on-primary rounded-full p-3 shadow-md hover:bg-primary/90 transition-colors">
                <span className="material-symbols-outlined text-[28px]">
                  {item.icon}
                </span>
              </div>
            </Link>
          );
        }
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center rounded-xl px-3 py-1 scale-90 duration-200 ${
              isActive
                ? "bg-primary-container text-on-primary-container"
                : "text-on-surface-variant hover:bg-surface-container-highest"
            }`}
          >
            <span
              className="material-symbols-outlined text-[24px]"
              style={
                isActive ? { fontVariationSettings: "'FILL' 1" } : undefined
              }
            >
              {item.icon}
            </span>
            <span className="font-label-sm text-label-sm mt-1">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
