"use client";

import AccountsSection from "@/components/dashboard/settings/AccountsSection";
import CardsSection from "@/components/dashboard/settings/CardsSection";
import CashSection from "@/components/dashboard/settings/CashSection";
import PreferencesSection from "@/components/dashboard/settings/PreferencesSection";


export default function SettingsPage() {
  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Account Settings</h1>
        <p className="text-xs text-zinc-400">Manage your preferences, physical cash balance, linked bank accounts, and cards</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <PreferencesSection />
          <CashSection />
        </div>
        <AccountsSection />
        <CardsSection />
      </div>
    </div>
  );
}