"use client";

import { transactionService } from "@/service/transaction.service";
import { useDashboardStore } from "@/store/useDashboardStore";
import { ArrowDownRight, ArrowUpRight, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import EmptyTransactionList from "./transactions/EmptyTransactionList";
import { TransactionResponseDto } from "@/types/transaction.dto";


export default function RecentTransactions() {
  const [transactions, setTransactions] = useState<TransactionResponseDto[]>([]);
  const refreshTrigger = useDashboardStore((state) => state.refreshTrigger);

  useEffect(() => {
    transactionService
      .getRecentTransactions()
      .then((data) => setTransactions(data || []))
      .catch(() => { });
  }, [refreshTrigger]);

  const handleDelete = async (id: string) => {
    try {
      await transactionService.deleteTransaction(id);
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
      useDashboardStore.getState().triggerRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const formatCurrency = (val: number) => {
    const formatted = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(Math.abs(val));
    return val > 0 ? `+${formatted}` : `-${formatted}`;
  };

  if (transactions.length === 0) {
    return <EmptyTransactionList />;
  }


  return (
    <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight">Recent Transactions</h2>
          <p className="text-xs text-zinc-400">Latest expense and income activity</p>
        </div>
        <Link href={'/dashboard/transactions'} type="button" className="text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors">
          View All
        </Link>
      </div>

      <div className="space-y-2.5">
        {transactions.map((tx) => {
          const isIncome = tx.type === "INCOME";
          return (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3 rounded-xl border border-zinc-800/70 bg-zinc-950/60 hover:bg-zinc-950 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`p-2.5 rounded-xl border shrink-0 ${isIncome ? 'bg-emerald-900/20 border-emerald-400' : 'bg-rose-900/20 border-rose-400'}`}>
                  {isIncome ? <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" /> : <ArrowDownRight className="h-3.5 w-3.5 text-rose-400" />}
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-semibold text-white truncate">{tx.description}</div>
                  <div className="text-[11px] text-zinc-400 truncate">{tx.account} • {tx.transactionDate ? new Date(tx.transactionDate).toLocaleDateString("en-IN", { month: "numeric", day: "numeric" }) : "/"}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <div className={`text-xs sm:text-sm font-bold flex items-center justify-end gap-1 ${isIncome ? "text-emerald-400" : "text-zinc-100"}`}>
                    <span>{formatCurrency(tx.amount)}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{tx.category}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(tx.id)}
                  title="Delete transaction"
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-70 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}