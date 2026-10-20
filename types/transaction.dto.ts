import { BankDto } from "./onboarding.dto";

export interface CategoryDto {
  id: string;
  name: string;
}

export interface CardDto {
  id: string;
  lastFourDigits?: string;
  cardType?: string;
  name?: string;
  limit?: number;
  accountId?: string;
  bank?: BankDto;
}

export interface PaymentModeDto {
  id: string;
  name: string;
}

export interface TransactionResponseDto {
  id: string;
  type: string;
  amount: number;
  transactionDate: string;
  description: string;
  account: string;
  paymentMode: string;
  category: string;
}


export interface AiInputDto {
  rawText: string;
}

export interface AiParseTask {
  id: string;
  message: string;
}

export interface PagedTransactionsDto {
  content: TransactionResponseDto[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
}