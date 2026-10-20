"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus } from "lucide-react";
import TransactionModal from "@/components/dashboard/TransactionModal";
import TransactionFilters, { FilterState } from "@/components/dashboard/transactions/TransactionFilters";
import TransactionList from "@/components/dashboard/transactions/TransactionList";
import { TransactionFilterParams, transactionService } from "@/service/transaction.service";
import { PagedTransactionsDto } from "@/types/transaction.dto";

export default function TransactionsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pagedData, setPagedData] = useState<PagedTransactionsDto | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    type: "",
    category: "",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
  });
  const [page, setPage] = useState(0);

  const fetchTransactions = useCallback(async (currentPage: number, currentFilters: FilterState) => {
    try {
      setLoading(true);
      const params: TransactionFilterParams = {
        page: currentPage,
        size: 10,
        type: currentFilters.type || undefined,
        category: currentFilters.category || undefined,
        startDate: currentFilters.startDate || undefined,
        endDate: currentFilters.endDate || undefined,
        minAmount: currentFilters.minAmount ? Number(currentFilters.minAmount) : undefined,
        maxAmount: currentFilters.maxAmount ? Number(currentFilters.maxAmount) : undefined,
      };
      const res = await transactionService.getAllTransactions(params);
      setPagedData(res);
    } catch {
      setPagedData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions(page, filters);
  }, [page, filters, fetchTransactions]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(0);
  };

  const handleReset = () => {
    setFilters({ type: "", category: "", startDate: "", endDate: "", minAmount: "", maxAmount: "" });
    setPage(0);
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Transactions</h1>
          <p className="text-xs text-zinc-400">View and filter all expenses, income, and transfers</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-900/30 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Add Transaction</span>
        </button>
      </div>

      <TransactionFilters filters={filters} onChange={handleFilterChange} onReset={handleReset} />
      <TransactionList pagedData={pagedData} loading={loading} onPageChange={setPage} onDelete={() => fetchTransactions(page, filters)} />
      <TransactionModal isOpen={modalOpen} onClose={() => { setModalOpen(false); fetchTransactions(page, filters); }} />
    </div>
  );
}