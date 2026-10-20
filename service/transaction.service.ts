import { apiClient } from "./apiClient";
import { AiInputDto, AiParseTask, CategoryDto, PagedTransactionsDto, PaymentModeDto, TransactionResponseDto } from "@/types/transaction.dto";

export interface TransactionFilterParams {
  page?: number;
  size?: number;
  type?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export const transactionService = {
  async getRecentTransactions() {
    return await apiClient<TransactionResponseDto[]>('/transactions/recent');
  },

  async deleteTransaction(transactionId: string) {
    return await apiClient<void>(`/transactions/${transactionId}`, { method: 'DELETE' });
  },

  async getCategories() {
    return await apiClient<CategoryDto[]>('/system-categories');
  },

  async getSupportedPaymentModes() {
    return await apiClient<PaymentModeDto[]>('/payment-modes');
  },

  async createTransaction(payload: any) {
    return await apiClient<TransactionResponseDto>('/transactions', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async getAllTransactions(params?: TransactionFilterParams) {
    const query = new URLSearchParams();
    if (params?.page !== undefined) query.set('page', String(params.page));
    if (params?.size !== undefined) query.set('size', String(params.size));
    if (params?.type) query.set('type', params.type);
    if (params?.category) query.set('category', params.category);
    if (params?.startDate) query.set('startDate', params.startDate);
    if (params?.endDate) query.set('endDate', params.endDate);
    if (params?.minAmount !== undefined) query.set('minAmount', String(params.minAmount));
    if (params?.maxAmount !== undefined) query.set('maxAmount', String(params.maxAmount));

    const queryString = query.toString();
    const endpoint = queryString ? `/transactions?${queryString}` : '/transactions';
    return await apiClient<PagedTransactionsDto>(endpoint);
  },

  async addTransactionUsingAi(input: AiInputDto) {
    return await apiClient<AiParseTask>('/ai/parse-tasks', { method: 'POST', body: JSON.stringify(input) });
  }
}