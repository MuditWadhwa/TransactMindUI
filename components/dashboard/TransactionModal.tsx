"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { X, ArrowDownRight, ArrowUpRight, ArrowLeftRight } from "lucide-react";
import { useDashboardStore } from "@/store/useDashboardStore";
import { transactionService } from "@/service/transaction.service";
import { AccountDto } from "@/types/onboarding.dto";
import { TransactionFormValues, transactionSchema } from "@/validations/transaction";
import { CategoryDto, CardDto, PaymentModeDto } from "@/types/transaction.dto";
import { accountService } from "@/service/account.service";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: "EXPENSE" | "INCOME" | "TRANSFER";
  onSuccess?: () => void;
}

export default function TransactionModal({
  isOpen,
  onClose,
  initialType = "EXPENSE",
  onSuccess,
}: TransactionModalProps) {
  const [transactionType, setTransactionType] = useState<"EXPENSE" | "INCOME" | "TRANSFER">(initialType)
  const [cashAcc, setCashAcc] = useState<AccountDto | null>(null);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [paymentModes, setPaymentModes] = useState<PaymentModeDto[]>([]);
  const [accounts, setAccounts] = useState<AccountDto[]>([]);
  const [debitCards, setDebitCards] = useState<CardDto[]>([]);
  const [creditCards, setCreditCards] = useState<CardDto[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: initialType,
      amount: undefined,
      description: "",
      categoryId: "",
      paymentModeId: "",
      accountId: "",
      toAccountId: "",
      cardId: "",
      transactionDate: new Date().toISOString().split("T")[0],
    },
  });

  const currentType = watch("type");
  const selectedPaymentModeId = watch("paymentModeId");
  const sourceAccountId = watch("accountId");
  const destAccountId = watch("toAccountId");

  useEffect(() => {
    if (!isOpen) return;

    setValue("transactionDate", new Date().toISOString().split("T")[0]);
    transactionService.getCategories().then(setCategories).catch(() => { });
    transactionService.getSupportedPaymentModes().then(setPaymentModes).catch(() => { });
    accountService.getUserAccounts().then(setAccounts).catch(() => { });
    accountService.getCashAccount().then(setCashAcc).catch(() => { });
  }, [isOpen, setValue, transactionType]);

  useEffect(() => {
    if (!isOpen || !selectedPaymentModeId) return;

    const selectedMode = paymentModes.find((p) => p.id === selectedPaymentModeId);
    const modeName = selectedMode?.name?.toLowerCase() || "";

    if (modeName.includes("cash")) {
      if (cashAcc) {
        setValue("accountId", cashAcc.id);
      } else {
        accountService.getCashAccount().then((acc) => {
          setCashAcc(acc);
          setValue("accountId", acc.id);
        }).catch(() => { });
      }
    } else {
      if (currentType === "EXPENSE") {
        setValue("accountId", "");
      }
    }

    if (modeName.includes("upi") || modeName.includes("netbanking") || modeName.includes("net banking")) {
      accountService.getUserAccounts(selectedMode?.name).then(setAccounts).catch(() => { });
    } else if (modeName.includes("debit")) {
      accountService.getDebitCards().then(setDebitCards).catch(() => { });
    } else if (modeName.includes("credit")) {
      accountService.getCreditCards().then(setCreditCards).catch(() => { });
    }
  }, [selectedPaymentModeId, paymentModes, isOpen, cashAcc, currentType, setValue, transactionType]);

  useEffect(() => {
    if (currentType === "TRANSFER" && sourceAccountId && destAccountId && sourceAccountId !== destAccountId) {
      const fromAcc = accounts.find((a) => (a.id || a.lastFourDigits) === sourceAccountId);
      const toAcc = accounts.find((a) => (a.id || a.lastFourDigits) === destAccountId);
      const fromLabel = fromAcc ? `${fromAcc.bank?.name || "Account"} (••${fromAcc.lastFourDigits})` : "Source";
      const toLabel = toAcc ? `${toAcc.bank?.name || "Account"} (••${toAcc.lastFourDigits})` : "Destination";
      setValue("description", `Transfer from ${fromLabel} to ${toLabel}`);
    }
  }, [currentType, sourceAccountId, destAccountId, accounts, setValue, transactionType]);

  if (!isOpen) return null;

  const selectedMode = paymentModes.find((p) => p.id === selectedPaymentModeId);
  const modeName = selectedMode?.name?.toLowerCase() || "";
  const isCash = modeName.includes("cash");
  const isDebit = modeName.includes("debit");
  const isCredit = modeName.includes("credit");
  const isAccountMode =
    modeName.includes("upi") ||
    modeName.includes("netbanking") ||
    modeName.includes("net banking") ||
    (!isCash && !isDebit && !isCredit && !!selectedPaymentModeId);

  const tabs = [
    { key: "EXPENSE" as const, label: "Expense", icon: ArrowDownRight },
    { key: "INCOME" as const, label: "Income", icon: ArrowUpRight },
    { key: "TRANSFER" as const, label: "Transfer", icon: ArrowLeftRight },
  ];

  const handleTabChange = (newType: "EXPENSE" | "INCOME" | "TRANSFER") => {
    setTransactionType(newType);
    setValue("type", newType);
    setValue("accountId", "");
    setValue("toAccountId", "");
    setValue("cardId", "");
    setValue("categoryId", "");
    setValue("paymentModeId", "");
    setValue("description", "");
  };

  const onSubmit = async (data: TransactionFormValues) => {
    try {
      let description = data.description;
      let accountId = data.accountId;

      if (data.type === "EXPENSE" && isCash && !accountId && cashAcc) {
        accountId = cashAcc.id || cashAcc.lastFourDigits;
      }

      if (data.type === "TRANSFER" && !description) {
        const fromAcc = accounts.find((a) => (a.id || a.lastFourDigits) === data.accountId);
        const toAcc = accounts.find((a) => (a.id || a.lastFourDigits) === data.toAccountId);
        const fromLabel = fromAcc ? `${fromAcc.bank?.name || "Account"} (••${fromAcc.lastFourDigits})` : "Source";
        const toLabel = toAcc ? `${toAcc.bank?.name || "Account"} (••${toAcc.lastFourDigits})` : "Destination";
        description = `Transfer from ${fromLabel} to ${toLabel}`;
      }

      await transactionService.createTransaction({
        ...data,
        accountId,
        description: description || data.type,
        transactionDate: data.transactionDate || new Date().toISOString().split("T")[0],
      });

      useDashboardStore.getState().triggerRefresh();
      reset();
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h2 className="text-base font-bold text-zinc-100 tracking-tight">Add Transaction</h2>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-white p-1 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = currentType === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${active
                  ? "border-indigo-500 bg-indigo-500/10 text-indigo-400"
                  : "border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-zinc-200"
                  }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">Amount</label>
              <input
                type="number"
                step="any"
                placeholder="0.00"
                {...register("amount", { valueAsNumber: true })}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              {errors.amount && <p className="text-xs text-rose-400 mt-1">{errors.amount.message}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">Date</label>
              <input
                type="date"
                {...register("transactionDate")}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 [color-scheme:dark]"
              />
              {errors.transactionDate && <p className="text-xs text-rose-400 mt-1">{errors.transactionDate.message}</p>}
            </div>
          </div>

          {currentType === "EXPENSE" && (
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                Category
              </label>
              <select
                {...register("categoryId")}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="text-xs text-rose-400 mt-1">{errors.categoryId.message}</p>}
            </div>
          )}

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
              Description {currentType === "TRANSFER" && <span className="text-zinc-500 lowercase">(optional)</span>}
            </label>
            <input
              type="text"
              placeholder={currentType === "TRANSFER" ? "Transfer from Source to Destination" : "Add a note..."}
              {...register("description")}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {currentType === "EXPENSE" && (
            <>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                  Payment Mode
                </label>
                <select
                  {...register("paymentModeId")}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Select Payment Mode</option>
                  {paymentModes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {!isCash && isDebit && (
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                    Debit Card
                  </label>
                  {debitCards.length === 0 ? (
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-400">
                      No debit cards found. Setup in{" "}
                      <Link href="/dashboard/settings" onClick={onClose} className="text-indigo-400 underline hover:text-indigo-300">
                        Settings
                      </Link>
                      .
                    </div>
                  ) : (
                    <select
                      {...register("cardId")}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">Select Debit Card</option>
                      {debitCards.map((card) => (
                        <option key={card.id} value={card.id}>
                          {card.name || card.bank?.name || "Debit Card"} {card.lastFourDigits ? `(••${card.lastFourDigits})` : ""}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {!isCash && isCredit && (
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                    Credit Card
                  </label>
                  {creditCards.length === 0 ? (
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-400">
                      No credit cards found. Setup in{" "}
                      <Link href="/dashboard/settings" onClick={onClose} className="text-indigo-400 underline hover:text-indigo-300">
                        Settings
                      </Link>
                      .
                    </div>
                  ) : (
                    <select
                      {...register("cardId")}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">Select Credit Card</option>
                      {creditCards.map((card) => (
                        <option key={card.id} value={card.id}>
                          {card.name || card.bank?.name || "Credit Card"} {card.lastFourDigits ? `(••${card.lastFourDigits})` : ""}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {!isCash && isAccountMode && (
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                    Account
                  </label>
                  {accounts.filter(acc => acc.accountType !== "CASH").length === 0 ? (
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-400">
                      No accounts found. Setup in{" "}
                      <Link href="/dashboard/settings" onClick={onClose} className="text-indigo-400 underline hover:text-indigo-300">
                        Settings
                      </Link>
                      .
                    </div>
                  ) : (
                    <select
                      {...register("accountId")}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">Select Account</option>
                      {accounts
                        .filter(acc => acc.accountType !== "CASH")
                        .map((acc, idx) => (
                          <option key={acc.id || idx} value={acc.id || acc.lastFourDigits}>
                            {acc.bank?.name || "Bank Account"} (••{acc.lastFourDigits})
                          </option>
                        ))}
                    </select>
                  )}
                </div>
              )}
            </>
          )}

          {currentType === "INCOME" && (
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                Destination Account
              </label>
              {accounts.length === 0 ? (
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-400">
                  No accounts found. Setup in{" "}
                  <Link href="/dashboard/settings" onClick={onClose} className="text-indigo-400 underline hover:text-indigo-300">
                    Settings
                  </Link>
                  .
                </div>
              ) : (
                <select
                  {...register("accountId")}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Select Account</option>
                  {accounts.map((acc, idx) => (
                    <option key={acc.id || idx} value={acc.id || acc.lastFourDigits}>
                      {acc.bank?.name || "Bank Account"} (••{acc.lastFourDigits})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {currentType === "TRANSFER" && (
            <>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                  From Account
                </label>
                {accounts.length === 0 ? (
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-400">
                    No accounts found. Setup in{" "}
                    <Link href="/dashboard/settings" onClick={onClose} className="text-indigo-400 underline hover:text-indigo-300">
                      Settings
                    </Link>
                    .
                  </div>
                ) : (
                  <select
                    {...register("accountId")}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Select Source Account</option>
                    {accounts
                      .filter((acc) => !destAccountId || (acc.id || acc.lastFourDigits) !== destAccountId)
                      .map((acc, idx) => (
                        <option key={acc.id || idx} value={acc.id || acc.lastFourDigits}>
                          {acc.bank?.name || "Bank Account"} (••{acc.lastFourDigits})
                        </option>
                      ))}
                  </select>
                )}
                {errors.accountId && <p className="text-xs text-rose-400 mt-1">{errors.accountId.message}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-zinc-400 mb-1">
                  To Account
                </label>
                {accounts.length === 0 ? (
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-400">
                    No accounts found. Setup in{" "}
                    <Link href="/dashboard/settings" onClick={onClose} className="text-indigo-400 underline hover:text-indigo-300">
                      Settings
                    </Link>
                    .
                  </div>
                ) : (
                  <select
                    {...register("toAccountId")}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="">Select Destination Account</option>
                    {accounts
                      .filter((acc) => !sourceAccountId || (acc.id || acc.lastFourDigits) !== sourceAccountId)
                      .map((acc, idx) => (
                        <option key={acc.id || idx} value={acc.id || acc.lastFourDigits}>
                          {acc.bank?.name || "Bank Account"} (••{acc.lastFourDigits})
                        </option>
                      ))}
                  </select>
                )}
                {errors.toAccountId && <p className="text-xs text-rose-400 mt-1">{errors.toAccountId.message}</p>}
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-semibold text-white transition-colors shadow-lg shadow-indigo-950/50 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}