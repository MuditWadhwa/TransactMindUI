"use client";

import { useEffect, useState } from "react";
import { MonthlyTrendDto } from "@/types/dashboard.dto";
import { useDashboardStore } from "@/store/useDashboardStore";
import { dashboardService } from "@/service/dashboard.service";

interface MonthlyTrendProps {
  variant?: "compact" | "detailed";
}

export default function MonthlyTrend({ variant = "compact" }: MonthlyTrendProps) {
  const [trends, setTrends] = useState<MonthlyTrendDto[]>([]);
  const [loading, setLoading] = useState(true);
  const refreshTrigger = useDashboardStore((state) => state.refreshTrigger);

  useEffect(() => {
    dashboardService
      .getMonthlyTrend()
      .then((data) => {
        if (data) setTrends(data);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [refreshTrigger]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(val);
  };

  const formatFullCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatMonth = (month: string) => {
    if (!month) return "";
    return month.length > 3 ? month.slice(0, 3) : month;
  };

  const maxAmount = Math.max(
    ...trends.flatMap((t) => [t.totalIncome, t.totalExpense]),
    1
  );

  const isDetailed = variant === "detailed";

  return (
    <div
      className={`${isDetailed ? "p-5 rounded-2xl space-y-5" : "p-4 rounded-xl space-y-3"
        } border border-zinc-800 bg-zinc-900 shadow-xl`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
        <div className="flex items-center gap-2">
          <h2 className={`${isDetailed ? "text-base" : "text-sm"} font-bold text-white tracking-tight`}>
            {isDetailed ? "Monthly Financial Trend" : "Monthly Trend"}
          </h2>
          <span className="text-[11px] text-zinc-400">
            {isDetailed ? "• Income vs Expense overview for the last 6 months" : "• Last 6 Months"}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-zinc-300">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span className="text-zinc-300">Expense</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className={`${isDetailed ? "h-44" : "h-24"} flex items-center justify-center`}>
          <div className="text-xs text-zinc-500 animate-pulse">Loading trend...</div>
        </div>
      ) : trends.length === 0 ? (
        <div className={`${isDetailed ? "h-44" : "h-24"} flex items-center justify-center`}>
          <p className="text-xs text-zinc-500">No trend data available.</p>
        </div>
      ) : (
        <div className={`grid ${isDetailed ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3" : "grid-cols-3 sm:grid-cols-6 gap-2"}`}>
          {trends.map((item, idx) => {
            const incomeHeight = Math.max((item.totalIncome / maxAmount) * 100, isDetailed ? 4 : 6);
            const expenseHeight = Math.max((item.totalExpense / maxAmount) * 100, isDetailed ? 4 : 6);
            const isPositive = item.netSavings >= 0;

            return (
              <div
                key={idx}
                className={`flex flex-col justify-between ${isDetailed ? "p-3 rounded-xl" : "p-2 rounded-lg"
                  } border border-zinc-800/70 bg-zinc-950/50 hover:bg-zinc-950 transition-colors`}
              >
                <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-300 mb-1">
                  <span className="uppercase">{formatMonth(item.month)}</span>
                  <span className="text-[10px] text-zinc-500 font-normal">{item.year}</span>
                </div>

                <div className={`${isDetailed ? "h-28" : "h-14"} flex items-end justify-center gap-1.5 py-1`}>
                  <div className="flex flex-col items-center h-full justify-end group relative">
                    <div
                      style={{ height: `${incomeHeight}%` }}
                      className={`${isDetailed ? "w-3 sm:w-3.5 rounded-t-sm" : "w-2.5 rounded-t-[2px]"
                        } bg-emerald-500/80 hover:bg-emerald-500 transition-all cursor-pointer`}
                    />
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 bg-zinc-950 border border-zinc-700 px-1.5 py-0.5 rounded text-[10px] text-emerald-400 font-medium whitespace-nowrap z-10 shadow-lg pointer-events-none">
                      {formatFullCurrency(item.totalIncome)}
                    </div>
                  </div>

                  <div className="flex flex-col items-center h-full justify-end group relative">
                    <div
                      style={{ height: `${expenseHeight}%` }}
                      className={`${isDetailed ? "w-3 sm:w-3.5 rounded-t-sm" : "w-2.5 rounded-t-[2px]"
                        } bg-rose-500/80 hover:bg-rose-500 transition-all cursor-pointer`}
                    />
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 bg-zinc-950 border border-zinc-700 px-1.5 py-0.5 rounded text-[10px] text-rose-400 font-medium whitespace-nowrap z-10 shadow-lg pointer-events-none">
                      {formatFullCurrency(item.totalExpense)}
                    </div>
                  </div>
                </div>

                {isDetailed ? (
                  <div className="border-t border-zinc-800/60 pt-2 space-y-1 text-[11px]">
                    <div className="flex justify-between items-center text-zinc-400">
                      <span>Inc</span>
                      <span className="font-semibold text-emerald-400">{formatFullCurrency(item.totalIncome)}</span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-400">
                      <span>Exp</span>
                      <span className="font-semibold text-rose-400">{formatFullCurrency(item.totalExpense)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-zinc-800/40 font-bold">
                      <span className="text-zinc-500 text-[10px]">Net</span>
                      <span className={isPositive ? "text-emerald-400" : "text-rose-400"}>
                        {isPositive ? "+" : ""}
                        {formatFullCurrency(item.netSavings)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="border-t border-zinc-800/50 pt-1 flex items-center justify-between text-[10px]">
                    <span className="text-zinc-500">Net</span>
                    <span className={`font-semibold ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
                      {isPositive ? "+" : ""}
                      {formatCurrency(item.netSavings)}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}