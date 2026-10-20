'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LogoutButton from "@/components/auth/LogoutButton";
import AccountsStep from "@/components/onboarding/AccountsStep";
import CashStep from "@/components/onboarding/CashStep";

import { useAuthStore } from "@/store/useAuthStore";
import { onboardingService } from "@/service/onboarding.service";
import { OnboardingFormValues, onboardingSchema } from "@/validations/onboarding";
import UserPreferences from "@/components/onboarding/UserPreferences";
import UserGreetings from "@/components/dashboard/UserGreetings";

export default function OnboardingPage() {
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const auth = useAuthStore((state) => state.auth);

  useEffect(() => {
    if (auth?.onboarded) {
      router.replace("/dashboard");
    }
  }, [auth, router]);

  const methods = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      languagePreference: "EN",
      spendLimit: 1000,
      currency: "INR",
      paymentMode: "UPI",
      accounts: [],
      cashBalance: 0,
    },
  });

  const onSubmit = async (data: OnboardingFormValues) => {
    try {
      setSubmitting(true);
      setErrorMsg("");
      await onboardingService.onboardUser({
        userConfig: {
          languagePreference: data.languagePreference,
          spendLimit: data.spendLimit,
          currency: data.currency,
          paymentMode: data.paymentMode,
          isOnboardingComplete: true,
        },
        accounts: (data.accounts || []).map((acc) => ({
          ...acc,
          isUpiEnabled: acc.isUpiEnabled ?? true,
          isNetBankingEnabled: acc.isNetBankingEnabled ?? true,
        })),
        cashBalance: data.cashBalance,
      });

      const currentAuth = useAuthStore.getState().auth;
      if (currentAuth) {
        useAuthStore.setState({
          auth: {
            ...currentAuth,
            onboarded: true,
          },
        });
      }

      router.replace("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to complete onboarding";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center bg-zinc-900 border border-zinc-800 p-5 rounded-2xl shadow-2xl">
          <UserGreetings />
          <LogoutButton />
        </header>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            <UserPreferences />
            <CashStep />
            <AccountsStep />

            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-400 text-sm">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-purple-600 hover:bg-purple-500 py-3.5 text-sm font-semibold text-white transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 shadow-lg shadow-purple-950/50"
            >
              {submitting ? "Completing setup..." : "Complete Setup"}
            </button>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}