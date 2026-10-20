"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Receipt, PieChart, Settings, Menu, X } from "lucide-react";
import LogoutButton from "../auth/LogoutButton";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/dashboard/transactions", icon: Receipt },
  { name: "Analytics", href: "/dashboard/analytics", icon: PieChart },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Top Header Bar */}
      <header className="flex md:hidden items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-40 shrink-0">
        <div className="flex items-center gap-2.5">
          {/* <Logo size={28} /> */}
          <span className="font-bold text-sm tracking-tight text-white">TransactMind</span>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile Drawer Backdrop and Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-72 bg-zinc-900 border-r border-zinc-800 p-5 flex flex-col justify-between shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
                <div className="flex items-center gap-2.5">
                  {/* <Logo size={32} /> */}
                  <span className="font-bold text-base tracking-tight text-white">TransactMind</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                  aria-label="Close Navigation Menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-col gap-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${isActive
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30 font-semibold"
                        : "text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-200"
                        }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-zinc-800/80">
              <LogoutButton />
            </div>
          </aside>
        </div>
      )}

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:flex sticky top-0 h-screen w-16 shrink-0 flex-col items-center justify-between border-r border-zinc-800 bg-zinc-900/50 py-8 backdrop-blur-md z-30 select-none">
        <div className="flex flex-col items-center gap-8">
          {/* <Logo size={44} /> */}

          <nav className="flex flex-col gap-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={item.name}
                  className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${isActive
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                    : "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200"
                    }`}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <LogoutButton iconOnly />
        </div>
      </aside>
    </>
  );
}