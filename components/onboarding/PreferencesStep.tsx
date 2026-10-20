"use client";

import { onboardingService } from "@/service/onboarding.service";
import { OnboardingFormValues } from "@/validations/onboarding";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";


export default function PreferencesStep() {
  const { register, formState: { errors } } = useFormContext<OnboardingFormValues>();
  const [languages, setLanguages] = useState<string[]>(["EN", "HI", "ES", "FR"]);

  useEffect(() => {
    onboardingService
      .getSupportedLanguagePreferences()
      .then((res) => {
        if (res?.options?.length) setLanguages(res.options);
      })
      .catch(() => { });
  }, []);

  return (
    <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl space-y-5">
      <div className="border-b border-zinc-800/80 pb-3">
        <h2 className="text-lg font-bold text-white tracking-tight">Preferences</h2>
        <p className="text-xs text-zinc-400">Set your default currency, language, and spending limits.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">Language</label>
          <select
            {...register("languagePreference")}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang.slice(0, 2).toUpperCase()}>{lang}</option>
            ))}
          </select>
          {errors.languagePreference && <p className="text-xs text-red-400 mt-1">{errors.languagePreference.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">Currency</label>
          <select
            {...register("currency")}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            disabled >
            <option value="INR">INR (₹)</option>
            {/* <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option> */}
          </select>
          {errors.currency && <p className="text-xs text-red-400 mt-1">{errors.currency.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">Monthly Spend Limit</label>
          <input
            type="number"
            {...register("spendLimit", { valueAsNumber: true })}
            placeholder="5000"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          {errors.spendLimit && <p className="text-xs text-red-400 mt-1">{errors.spendLimit.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">Preferred Payment Mode</label>
          <select
            {...register("paymentMode")}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            <option value="">Select Mode</option>
            <option value="UPI">UPI</option>
            <option value="CARD">Card</option>
            <option value="NET_BANKING">Net Banking</option>
            <option value="CASH">Cash</option>
          </select>
          {errors.paymentMode && <p className="text-xs text-red-400 mt-1">{errors.paymentMode.message}</p>}
        </div>
      </div>
    </div>
  );
}