"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, Plus, ChevronDown, ArrowDownRight, ArrowUpRight, ArrowLeftRight, CornerDownLeft, Loader2 } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { transactionService } from "@/service/transaction.service";
import TransactionModal from "./TransactionModal";
import { notificationService } from "@/service/notification.service";

export default function QuickInputBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"EXPENSE" | "INCOME" | "TRANSFER">("EXPENSE");
  const [processing, setProcessing] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const openModal = (type: "EXPENSE" | "INCOME" | "TRANSFER") => {
    setModalType(type);
    setModalOpen(true);
    setMenuOpen(false);
  };


  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!query.trim() || processing) return;

    try {
      setProcessing(true);
      const task = await transactionService.addTransactionUsingAi({ rawText: query.trim() });

      if (task?.id) {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
        }

        unsubscribeRef.current = notificationService.subscribeSSE(
          task.id,
          () => {
            setProcessing(false);
            setQuery("");
            useDashboardStore.getState().triggerRefresh();
            if (unsubscribeRef.current) {
              unsubscribeRef.current();
              unsubscribeRef.current = null;
            }
          },
          () => {
            setProcessing(false);
            useDashboardStore.getState().triggerRefresh();
          }
        );
      } else {
        setProcessing(false);
        setQuery("");
        useDashboardStore.getState().triggerRefresh();
      }
    } catch {
      setProcessing(false);
    }
  };

  return (
    <>
      <div className="relative rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-zinc-900 to-zinc-900 p-2 shadow-xl shadow-purple-950/20 backdrop-blur-md">

        <div className="flex flex-col sm:flex-row items-center gap-2">

          <form onSubmit={handleSubmit} className="relative flex-1 w-full flex items-center">
            <div className="absolute left-3.5 flex items-center text-purple-400">
              {processing ? (
                <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
              ) : (
                <Sparkles className="h-4 w-4 animate-pulse" />
              )}
            </div>
            <input
              type="text"
              value={query}
              disabled={processing}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                processing
                  ? "AI is parsing and logging your transaction..."
                  : "e.g. 'I spent 200 rs on Blinkit' or 'Salary credited 50k'"
              }
              className="w-full rounded-xl border border-zinc-800/80 bg-zinc-950/80 pl-10 pr-24 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all disabled:opacity-70"
            />
            <button
              type="submit"
              disabled={processing || !query.trim()}
              className="absolute right-2 px-2.5 py-2 text-xs font-semibold rounded-lg bg-purple-600/30 text-purple-300 border border-purple-500/30 hover:bg-purple-600/50 flex items-center gap-1 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {processing ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <CornerDownLeft className="h-3 w-3" />
              )}
            </button>
          </form>

          <div className="relative w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-900/30 transition-all"
            >
              <Plus className="h-4 w-4" />
              <ChevronDown className="h-3.5 w-3.5 opacity-80" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-zinc-800 bg-zinc-900 p-1.5 shadow-2xl z-40 space-y-1">
                <button type="button" onClick={() => openModal("EXPENSE")} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-800/80 hover:text-rose-400 rounded-lg transition-colors">
                  <ArrowDownRight className="h-4 w-4 text-rose-400" />
                  <span>Expense</span>
                </button>
                <button type="button" onClick={() => openModal("INCOME")} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-800/80 hover:text-emerald-400 rounded-lg transition-colors">
                  <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                  <span>Income</span>
                </button>
                <button type="button" onClick={() => openModal("TRANSFER")} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-200 hover:bg-zinc-800/80 hover:text-indigo-400 rounded-lg transition-colors">
                  <ArrowLeftRight className="h-4 w-4 text-indigo-400" />
                  <span>Transfer</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <TransactionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} initialType={modalType} />
    </>
  );
}