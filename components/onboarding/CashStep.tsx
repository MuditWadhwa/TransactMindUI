"use client";

import { OnboardingFormValues } from "@/validations/onboarding";
import { useFormContext } from "react-hook-form";

export default function CashStep() {
  const { register, watch, formState: { errors } } = useFormContext<OnboardingFormValues>();
  const currency = watch("currency") || "INR";

  return (
    <div className="p-5 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-sm font-bold text-white tracking-tight">Cash in Hand</h2>
        <p className="text-xs text-zinc-400">Initial physical cash balance</p>
      </div>
      <div className="w-full sm:w-52">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-xs font-semibold text-purple-400">
            {currency}
          </span>
          <input
            type="number"
            min={0}
            {...register("cashBalance", { valueAsNumber: true })}
            placeholder="0"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-14 pr-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>
        {errors.cashBalance && <p className="text-[11px] text-red-400 mt-1">{errors.cashBalance.message}</p>}
      </div>
    </div>
  );
}