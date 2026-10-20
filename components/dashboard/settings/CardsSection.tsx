"use client";

import { useEffect, useState } from "react";
import { CreditCard, Plus, Trash2, X, AlertCircle } from "lucide-react";
import { CardDto } from "@/types/transaction.dto";
import { BankDto, AccountDto } from "@/types/onboarding.dto";
import { accountService } from "@/service/account.service";
import { apiClient } from "@/service/apiClient";


export default function CardsSection() {
  const [debitCards, setDebitCards] = useState<CardDto[]>([]);
  const [creditCards, setCreditCards] = useState<CardDto[]>([]);
  const [banks, setBanks] = useState<BankDto[]>([]);
  const [accounts, setAccounts] = useState<AccountDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [cardForm, setCardForm] = useState({
    cardType: "DEBIT" as "DEBIT" | "CREDIT",
    lastFourDigits: "",
    accountId: "",
    bankId: "",
    limit: "",
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [debitRes, creditRes, accountsRes, banksRes] = await Promise.allSettled([
        accountService.getDebitCards(),
        accountService.getCreditCards(),
        accountService.getUserAccounts(),
        apiClient<BankDto[]>("/banks"),
      ]);

      setDebitCards(debitRes.status === "fulfilled" && debitRes.value ? debitRes.value : []);
      setCreditCards(creditRes.status === "fulfilled" && creditRes.value ? creditRes.value : []);

      const userAccounts = accountsRes.status === "fulfilled" && accountsRes.value ? accountsRes.value : [];
      const nonCashAccounts = userAccounts.filter((a) => a.accountType !== "CASH");
      setAccounts(nonCashAccounts);

      setBanks(banksRes.status === "fulfilled" && banksRes.value ? banksRes.value : []);
    } catch {
      setDebitCards([]);
      setCreditCards([]);
      setAccounts([]);
      setBanks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openModal = () => {
    setErrorMsg("");
    const initialType = accounts.length > 0 ? "DEBIT" : "CREDIT";
    setCardForm({
      cardType: initialType,
      lastFourDigits: "",
      accountId: accounts[0]?.id || "",
      bankId: banks[0]?.id || "",
      limit: "",
    });
    setModalOpen(true);
  };

  const handleDeleteCard = async (cardId: string, isCredit: boolean) => {
    try {
      await accountService.deleteCard(cardId);
      if (isCredit) {
        setCreditCards((prev) => prev.filter((c) => c.id !== cardId));
      } else {
        setDebitCards((prev) => prev.filter((c) => c.id !== cardId));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardForm.lastFourDigits || cardForm.lastFourDigits.length !== 4) {
      setErrorMsg("Last 4 digits must be exactly 4 numbers");
      return;
    }

    try {
      setSaving(true);
      setErrorMsg("");

      if (cardForm.cardType === "DEBIT") {
        if (!cardForm.accountId) {
          setErrorMsg("Please select an account for debit card");
          setSaving(false);
          return;
        }

        await accountService.addCard({
          cardType: "DEBIT_CARD",
          lastFourDigits: cardForm.lastFourDigits,
          accountId: cardForm.accountId,
        });
      } else {
        if (!cardForm.bankId) {
          setErrorMsg("Please select a bank for credit card");
          setSaving(false);
          return;
        }
        if (!cardForm.limit || Number(cardForm.limit) <= 0) {
          setErrorMsg("Please enter a valid credit limit");
          setSaving(false);
          return;
        }

        const selectedBank = banks.find((b) => b.id === cardForm.bankId);
        if (!selectedBank) {
          setErrorMsg("Selected bank not found");
          setSaving(false);
          return;
        }

        await accountService.addCard({
          cardType: "CREDIT_CARD",
          lastFourDigits: cardForm.lastFourDigits,
          limit: Number(cardForm.limit),
          bank: {
            id: selectedBank.id,
            name: selectedBank.name,
          },
        });
      }

      setModalOpen(false);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to add card";
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val);
  };

  const allCards = [
    ...debitCards.map((c) => ({ ...c, isCredit: false })),
    ...creditCards.map((c) => ({ ...c, isCredit: true })),
  ];

  return (
    <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Cards</h2>
          <p className="text-xs text-zinc-400">Manage your debit and credit cards for quick transaction logging.</p>
        </div>
        <button
          type="button"
          onClick={openModal}
          className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600/30 transition-colors flex items-center gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Card</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="h-24 bg-zinc-950/60 border border-zinc-800 rounded-xl animate-pulse" />
          <div className="h-24 bg-zinc-950/60 border border-zinc-800 rounded-xl animate-pulse" />
        </div>
      ) : allCards.length === 0 ? (
        <div className="text-center py-8 text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-xl">
          No cards added yet. Click &quot;+ Add Card&quot; to link your first card.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {allCards.map((card) => {
            const isCredit = card.isCredit || card.cardType?.toUpperCase() === "CREDIT";
            return (
              <div
                key={card.id}
                className="p-4 border border-zinc-800/80 rounded-xl bg-zinc-950/70 flex items-center justify-between gap-3 hover:bg-zinc-950 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2.5 rounded-xl border shrink-0 ${isCredit
                      ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
                      : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                      }`}
                  >
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="text-sm font-semibold text-white truncate">
                      {card.bank?.name || (isCredit ? "Credit Card" : "Debit Card")}
                    </div>
                    <div className="text-xs text-zinc-400 flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-zinc-300">•••• {card.lastFourDigits || "••••"}</span>
                      <span>•</span>
                      <span
                        className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded border ${isCredit
                          ? "bg-purple-500/10 border-purple-500/20 text-purple-400"
                          : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                          }`}
                      >
                        {isCredit ? "Credit" : "Debit"}
                      </span>
                      {isCredit && typeof card.limit === "number" && (
                        <>
                          <span>•</span>
                          <span className="text-[11px] text-zinc-400">Limit: {formatCurrency(card.limit)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteCard(card.id, isCredit)}
                  title="Delete Card"
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 opacity-70 group-hover:opacity-100 transition-all shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h2 className="text-base font-bold text-white tracking-tight">Add New Card</h2>
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

            <form onSubmit={handleAddCard} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                  Card Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={accounts.length === 0}
                    onClick={() =>
                      setCardForm({
                        ...cardForm,
                        cardType: "DEBIT",
                        accountId: cardForm.accountId || accounts[0]?.id || "",
                      })
                    }
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${cardForm.cardType === "DEBIT"
                      ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                      : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200"
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                    title={accounts.length === 0 ? "No bank accounts available. Add a bank account first" : ""}
                  >
                    Debit Card
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCardForm({
                        ...cardForm,
                        cardType: "CREDIT",
                        bankId: cardForm.bankId || banks[0]?.id || "",
                      })
                    }
                    className={`py-2 text-xs font-semibold rounded-xl border transition-all ${cardForm.cardType === "CREDIT"
                      ? "border-purple-500 bg-purple-500/10 text-purple-400"
                      : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200"
                      }`}
                  >
                    Credit Card
                  </button>
                </div>
                {accounts.length === 0 && cardForm.cardType === "DEBIT" && (
                  <p className="text-[11px] text-amber-400 mt-1">No bank accounts linked. Add a bank account to enable Debit Card.</p>
                )}
              </div>

              {cardForm.cardType === "DEBIT" ? (
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                    Linked Bank Account
                  </label>
                  <select
                    value={cardForm.accountId}
                    onChange={(e) => setCardForm({ ...cardForm, accountId: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="">Select Bank Account</option>
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.bank?.name || "Account"} (••{acc.lastFourDigits}) - {formatCurrency(acc.balance)}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                      Bank
                    </label>
                    <select
                      value={cardForm.bankId}
                      onChange={(e) => setCardForm({ ...cardForm, bankId: e.target.value })}
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

                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                      Credit Limit
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={cardForm.limit}
                      onChange={(e) => setCardForm({ ...cardForm, limit: e.target.value })}
                      placeholder="e.g. 50000"
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                  Last 4 Digits
                </label>
                <input
                  type="text"
                  maxLength={4}
                  value={cardForm.lastFourDigits}
                  onChange={(e) => setCardForm({ ...cardForm, lastFourDigits: e.target.value.replace(/\D/g, "") })}
                  placeholder="e.g. 4242"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono tracking-widest"
                />
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
                  {saving ? "Saving..." : "Add Card"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}