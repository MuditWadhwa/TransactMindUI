"use client";

import { useEffect, useState } from "react";
import { Check, AlertCircle, Save } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { accountService } from "@/service/account.service";

export default function CashSection() {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    accountService
      .getCashAccount()
      .then((data) => {
        if (data && typeof data.balance === "number") {
          setBalance(data.balance);
        }
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg("");
      setSuccessMsg("");

      await accountService.updateCashBalance(Number(balance));
      useDashboardStore.getState().triggerRefresh();

      setSuccessMsg("Cash balance updated!");
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update cash balance";
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl space-y-4 flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Cash in Hand</h2>
          <p className="text-xs text-zinc-400">Manage physical cash balance for cash transactions.</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="h-12 bg-zinc-950/60 border border-zinc-800 rounded-xl animate-pulse" />
      ) : (
        <form onSubmit={handleUpdate} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 max-w-sm">
            <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
              Available Cash
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-xs font-semibold text-purple-400">
                INR (₹)
              </span>
              <input
                type="number"
                min={0}
                value={balance}
                onChange={(e) => setBalance(Number(e.target.value))}
                placeholder="0"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-20 pr-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 font-medium"
              />
            </div>
          </div>

          <div className="sm:self-end pt-1">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-950/30 transition-all disabled:opacity-50 w-full sm:w-auto"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{saving ? "Updating..." : "Update Cash"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}