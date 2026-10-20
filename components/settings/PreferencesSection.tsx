"use client";

import { useEffect, useState } from "react";
import { Check, AlertCircle, Save } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useDashboardStore } from "@/store/useDashboardStore";
import { PaymentModeDto } from "@/types/onboarding.dto";
import { onboardingService } from "@/service/onboarding.service";
import { userService } from "@/service/user.service";

export default function PreferencesSection() {
  const [languages, setLanguages] = useState<string[]>(["EN", "HI", "ES", "FR"]);
  const [paymentModes, setPaymentModes] = useState<PaymentModeDto[] | null>([]);

  const [formData, setFormData] = useState({
    languagePreference: "EN",
    currency: "INR",
    spendLimit: 5000,
    paymentMode: "UPI",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const [langRes, userRes, paymentModesRes] = await Promise.allSettled([
          onboardingService.getSupportedLanguagePreferences(),
          userService.getUserPreferences(),
          onboardingService.getSupportedPaymentModes(),
        ]);

        if (langRes.status === "fulfilled" && langRes.value?.options?.length) {
          setLanguages(langRes.value.options);
        }

        const user = userRes.status === "fulfilled" && userRes.value ? userRes.value : useAuthStore.getState().user;
        if (user) {
          setFormData({
            languagePreference: user.languagePreference || "EN",
            currency: user.currency || "INR",
            spendLimit: user.spendLimit || 5000,
            paymentMode: user.paymentMode || "UPI",
          });
        }

        setPaymentModes((paymentModesRes.status === 'fulfilled' && paymentModesRes.value?.length) ? paymentModesRes.value : null)

      } catch {
        // Fallback to store
        const user = useAuthStore.getState().user;
        if (user) {
          setFormData({
            languagePreference: user.languagePreference || "EN",
            currency: user.currency || "INR",
            spendLimit: user.spendLimit || 5000,
            paymentMode: user.paymentMode || "UPI",
          });
        }
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleSave = async (e: React.SubmitEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg("");
      setSuccessMsg("");

      await userService.updatePreferences({
        languagePreference: formData.languagePreference,
        currency: formData.currency,
        spendLimit: Number(formData.spendLimit),
        paymentMode: formData.paymentMode,
      });

      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        useAuthStore.setState({
          user: {
            ...currentUser,
            languagePreference: formData.languagePreference,
            currency: formData.currency,
            spendLimit: Number(formData.spendLimit),
            paymentMode: formData.paymentMode,
          },
        });
      }

      useDashboardStore.getState().triggerRefresh();
      setSuccessMsg("Preferences saved successfully!");
      setTimeout(() => setSuccessMsg(""), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save preferences";
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl space-y-5 h-full flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Preferences</h2>
          <p className="text-xs text-zinc-400">Set your default currency, language, and monthly spend limits.</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
          <div className="h-14 bg-zinc-950/60 border border-zinc-800 rounded-xl" />
          <div className="h-14 bg-zinc-950/60 border border-zinc-800 rounded-xl" />
          <div className="h-14 bg-zinc-950/60 border border-zinc-800 rounded-xl" />
          <div className="h-14 bg-zinc-950/60 border border-zinc-800 rounded-xl" />
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Language
              </label>
              <select
                value={formData.languagePreference}
                onChange={(e) => setFormData({ ...formData, languagePreference: e.target.value })}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang.slice(0, 2).toUpperCase()}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Currency
              </label>
              <select
                value={formData.currency}
                disabled
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:opacity-60 cursor-not-allowed"
              >
                <option value="INR">INR (₹)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Monthly Spend Limit
              </label>
              <input
                type="number"
                min={0}
                value={formData.spendLimit}
                onChange={(e) => setFormData({ ...formData, spendLimit: Number(e.target.value) })}
                placeholder="5000"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Preferred Payment Mode
              </label>
              <select
                value={formData.paymentMode}
                onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                {paymentModes?.map(p => {
                  return <option key={p.id} value={p.name}>{p.name}</option>
                })}
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-950/30 transition-all disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{saving ? "Saving..." : "Save Preferences"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}