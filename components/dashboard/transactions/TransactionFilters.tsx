"use client";

import { Filter, RotateCcw, Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
// If you use shadcn/ui:
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
// import { format } from "date-fns";

export interface FilterState {
  type: string;
  category: string;
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
}

interface TransactionFiltersProps {
  filters: FilterState;
  onChange: (key: keyof FilterState, value: string) => void;
  onReset: () => void;
}

export default function TransactionFilters({ filters, onChange, onReset }: TransactionFiltersProps) {
  const typeOptions = [
    { value: "", label: "All Types" },
    { value: "EXPENSE", label: "Expense" },
    { value: "INCOME", label: "Income" },
    { value: "TRANSFER", label: "Transfer" },
  ];

  return (
    <div className="p-4 rounded-2xl border border-zinc-800 bg-zinc-900 shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
          <Filter className="h-3.5 w-3.5 text-purple-400" />
          <span>Filter Transactions</span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-zinc-400 hover:text-purple-400 transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* Type Filter */}
        <div>
          <label className="block text-[10px] font-medium uppercase tracking-wider text-zinc-400 mb-1">Type</label>
          <select
            value={filters.type}
            onChange={(e) => onChange("type", e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-100 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          >
            {typeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-[10px] font-medium uppercase tracking-wider text-zinc-400 mb-1">Category</label>
          <input
            type="text"
            value={filters.category}
            onChange={(e) => onChange("category", e.target.value)}
            placeholder="e.g. Food, Groceries"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* Start Date Picker */}
        <div>
          <label className="block text-[10px] font-medium uppercase tracking-wider text-zinc-400 mb-1">Start Date</label>
          <div className="relative">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => onChange("startDate", e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-100 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[0.7] cursor-pointer"
            />
          </div>
        </div>

        {/* End Date Picker */}
        <div>
          <label className="block text-[10px] font-medium uppercase tracking-wider text-zinc-400 mb-1">End Date</label>
          <div className="relative">
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => onChange("endDate", e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-100 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert-[0.7] cursor-pointer"
            />
          </div>
        </div>

        {/* Min Amount */}
        <div>
          <label className="block text-[10px] font-medium uppercase tracking-wider text-zinc-400 mb-1">Min Amount</label>
          <input
            type="number"
            value={filters.minAmount}
            onChange={(e) => onChange("minAmount", e.target.value)}
            placeholder="0"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* Max Amount */}
        <div>
          <label className="block text-[10px] font-medium uppercase tracking-wider text-zinc-400 mb-1">Max Amount</label>
          <input
            type="number"
            value={filters.maxAmount}
            onChange={(e) => onChange("maxAmount", e.target.value)}
            placeholder="Any"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs text-zinc-100 placeholder-zinc-600 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>
      </div>
    </div>
  );
}