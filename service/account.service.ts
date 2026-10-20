import { AccountDto, BankDto } from "@/types/onboarding.dto";
import { apiClient } from "./apiClient";
import { CardDto } from "@/types/transaction.dto";

export const accountService = {
  async getUserAccounts(paymentMode?: string) {
    console.log("getting user accounts")

    const query = paymentMode ? `?paymentMode=${encodeURIComponent(paymentMode)}` : '';
    return await apiClient<AccountDto[]>(`/accounts${query}`, {
      headers: {
        'X-API-Version': '2'
      }
    });
  },

  async getCashAccount() {
    return await apiClient<AccountDto>('/accounts/cash');
  },

  async getDebitCards() {
    return await apiClient<CardDto[]>('/cards?type=DEBIT_CARD');
  },

  async getCreditCards() {
    return await apiClient<CardDto[]>('/cards?type=CREDIT_CARD');
  },


  async addAccount(account: AccountDto) {
    return await apiClient<AccountDto>('/accounts', {
      method: 'POST',
      body: JSON.stringify({ accounts: [account] }),
    });
  },

  async deleteAccount(id: string) {
    return await apiClient<void>(`/accounts/${id}`, {
      method: 'DELETE',
    });
  },

  async addCard(payload: {
    cardType: "DEBIT_CARD" | "CREDIT_CARD";
    lastFourDigits: string;
    accountId?: string;
    limit?: number;
    bank?: BankDto;
  }) {
    return await apiClient<CardDto>('/cards', {
      method: 'POST',
      body: JSON.stringify({ cards: [payload] }),
    });
  },

  async deleteCard(cardId: string) {
    return await apiClient<void>(`/cards/${cardId}`, {
      method: 'DELETE',
    });
  },


  async updateCashBalance(cashBalance: number) {
    return await apiClient<AccountDto>('/accounts/cash', { method: 'PUT', body: JSON.stringify({ cashBalance: cashBalance }) });
  },
}