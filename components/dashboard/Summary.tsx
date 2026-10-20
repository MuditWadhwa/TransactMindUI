"use client";

import { useEffect, useState } from "react";
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Flame } from "lucide-react";

import { useDashboardStore } from "@/store/useDashboardStore";
import { dashboardService } from "@/service/dashboard.service";
import { SummaryDto } from "@/types/dashboard.dto";

export default function Summary() {
  const [summary, setSummary] = useState<SummaryDto | null>(null);

  const refreshTrigger = useDashboardStore((state) => state.refreshTrigger);
  const [loading, setLoading] = useState(!summary);

  useEffect(() => {
    dashboardService
      .getDashboardSummary()
      .then((data) => {
        if (data) setSummary(data);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [setSummary, refreshTrigger]);

  const cards = [
    { label: "Net Worth", value: summary?.netWorth, icon: Wallet, color: "text-purple-400", cardBg: "bg-purple-950/20 border-purple-900/30", iconBg: "bg-purple-500/10 border-purple-500/20" },
    { label: "Total Income", value: summary?.totalIncome, icon: TrendingUp, color: "text-emerald-400", cardBg: "bg-emerald-950/20 border-emerald-900/30", iconBg: "bg-emerald-500/10 border-emerald-500/20" },
    { label: "Total Expense", value: summary?.totalExpense, icon: TrendingDown, color: "text-rose-400", cardBg: "bg-rose-950/20 border-rose-900/30", iconBg: "bg-rose-500/10 border-rose-500/20" },
    { label: "Net Savings", value: summary?.netSavings, icon: PiggyBank, color: "text-indigo-400", cardBg: "bg-indigo-950/20 border-indigo-900/30", iconBg: "bg-indigo-500/10 border-indigo-500/20" },
    { label: "Daily Burn Rate", value: summary?.dailyBurnRate, icon: Flame, color: "text-amber-400", cardBg: "bg-amber-950/20 border-amber-900/30", iconBg: "bg-amber-500/10 border-amber-500/20" },
  ];

  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null) return "—";
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`p-4 rounded-xl border ${card.cardBg} flex items-center justify-between gap-3 shadow-lg transition-colors`}
          >
            <div className="min-w-0 flex-1 space-y-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400 block truncate">
                {card.label}
              </span>
              {loading ? (
                <div className="h-6 w-20 bg-zinc-800 animate-pulse rounded-md" />
              ) : (
                <div className="text-lg font-bold text-white tracking-tight truncate">
                  {formatCurrency(card.value)}
                </div>
              )}
            </div>

            <div className={`p-2.5 rounded-xl border ${card.iconBg} ${card.color} shrink-0`}>
              <Icon className="h-4 w-4" />
            </div>
          </div>
        );
      })}
    </div>
  );
}