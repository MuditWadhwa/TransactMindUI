"use client";

import { useEffect, useState } from "react";
import { Building2, Plus, Trash2, X, AlertCircle, Check } from "lucide-react";
import { AccountDto, BankDto } from "@/types/onboarding.dto";
import { useDashboardStore } from "@/store/useDashboardStore";
import { accountService } from "@/service/account.service";
import { apiClient } from "@/service/apiClient";

export default function AccountsSection() {
  const [accounts, setAccounts] = useState<AccountDto[]>([]);
  const [banks, setBanks] = useState<BankDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState({
    bankId: "",
    bankName: "",
    accountType: "SAVINGS" as "SAVINGS" | "CREDIT",
    lastFourDigits: "",
    balance: 0,
    isUpiEnabled: true,
    isNetBankingEnabled: true,
  });

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const data = await accountService.getUserAccounts();
      const nonCash = (data || []).filter((a) => a.accountType !== "CASH");
      setAccounts(nonCash);
    } catch {
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
    apiClient<BankDto[]>("/banks")
      .then((res) => setBanks(res || []))
      .catch(() => setBanks([]));
  }, []);

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await accountService.deleteAccount(id);
      setAccounts((prev) => prev.filter((a) => a.id !== id));
      useDashboardStore.getState().triggerRefresh();
      setSuccessMsg("Account removed successfully!");
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err) {
      console.error("Failed to delete account", err);
      setErrorMsg("Failed to remove account");
      setTimeout(() => setErrorMsg(""), 3500);
    }
  };

  const handleAdd = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!form.bankId) {
      setErrorMsg("Please select a bank");
      return;
    }
    if (!form.lastFourDigits || form.lastFourDigits.length !== 4) {
      setErrorMsg("Last 4 digits must be exactly 4 numbers");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg("");
      await accountService.addAccount({
        bank: { id: form.bankId, name: form.bankName },
        accountType: form.accountType,
        lastFourDigits: form.lastFourDigits,
        balance: Number(form.balance),
        isUpiEnabled: form.isUpiEnabled,
        isNetBankingEnabled: form.isNetBankingEnabled,
      });

      setForm({
        bankId: "",
        bankName: "",
        accountType: "SAVINGS",
        lastFourDigits: "",
        balance: 0,
        isUpiEnabled: true,
        isNetBankingEnabled: true,
      });
      setModalOpen(false);
      await loadAccounts();
      useDashboardStore.getState().triggerRefresh();
      setSuccessMsg("Bank account added successfully!");
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add account";
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Bank Accounts</h2>
          <p className="text-xs text-zinc-400">Manage your linked savings and credit bank accounts.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setErrorMsg("");
            setModalOpen(true);
          }}
          className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 transition-colors flex items-center gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Account</span>
        </button>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="h-24 bg-zinc-950/60 border border-zinc-800 rounded-xl animate-pulse" />
          <div className="h-24 bg-zinc-950/60 border border-zinc-800 rounded-xl animate-pulse" />
        </div>
      ) : accounts.length === 0 ? (
        <div className="text-center py-8 text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
          No bank accounts added yet. Click &quot;+ Add Account&quot; to link your first account.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {accounts.map((acc, idx) => (
            <div
              key={acc.id || idx}
              className="p-4 border border-zinc-800/80 rounded-xl bg-zinc-950/70 flex items-center justify-between gap-3 hover:bg-zinc-950 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 rounded-xl border bg-purple-500/10 border-purple-500/20 text-purple-400 shrink-0">
                  <Building2 className="h-4 w-4" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="text-sm font-semibold text-white truncate">{acc.bank?.name || "Bank Account"}</div>
                  <div className="text-xs text-zinc-400 flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-zinc-300">••{acc.lastFourDigits}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">{formatCurrency(acc.balance)}</span>
                    <span>•</span>
                    <span className="text-[10px] uppercase font-semibold text-zinc-500">{acc.accountType}</span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    {acc.isUpiEnabled && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                        UPI
                      </span>
                    )}
                    {acc.isNetBankingEnabled && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                        NetBanking
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {acc.id && (
                <button
                  type="button"
                  onClick={() => handleDelete(acc.id)}
                  title="Remove Account"
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-70 group-hover:opacity-100 transition-all shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold text-white tracking-tight">Add Bank Account</h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleAdd} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                  Bank
                </label>
                <select
                  value={form.bankId}
                  onChange={(e) => {
                    const b = banks.find((item) => item.id === e.target.value);
                    setForm({ ...form, bankId: e.target.value, bankName: b?.name || "" });
                  }}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="">Select Bank</option>
                  {banks.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                    Account Type
                  </label>
                  <select
                    value={form.accountType}
                    onChange={(e) => setForm({ ...form, accountType: e.target.value as "SAVINGS" | "CREDIT" })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="SAVINGS">Savings</option>
                    <option value="CREDIT">Credit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                    Last 4 Digits
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={form.lastFourDigits}
                    onChange={(e) => setForm({ ...form, lastFourDigits: e.target.value.replace(/\D/g, "") })}
                    placeholder="1234"
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                  Starting Balance
                </label>
                <input
                  type="number"
                  min={0}
                  value={form.balance}
                  onChange={(e) => setForm({ ...form, balance: Number(e.target.value) })}
                  placeholder="0"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isUpiEnabled}
                    onChange={(e) => setForm({ ...form, isUpiEnabled: e.target.checked })}
                    className="rounded border-zinc-800 bg-zinc-950 text-purple-600 focus:ring-purple-500"
                  />
                  <span>UPI Enabled</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isNetBankingEnabled}
                    onChange={(e) => setForm({ ...form, isNetBankingEnabled: e.target.checked })}
                    className="rounded border-zinc-800 bg-zinc-950 text-purple-600 focus:ring-purple-500"
                  />
                  <span>Net Banking</span>
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-purple-600 hover:bg-purple-500 py-2.5 text-xs font-semibold text-white transition-colors shadow-lg shadow-purple-950/50 disabled:opacity-50"
                >
                  {saving ? "Adding..." : "Add Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}