export interface LanguagePreferenceDto {
  options: string[]
}

export interface PaymentModeDto {
  id: string;
  name: string;
}

export interface BankDto {
  id: string;
  name: string;
}

export interface UserConfigDto {
  languagePreference: string;
  spendLimit: number;
  currency: string;
  paymentMode: string;
  isOnboardingComplete: boolean;
}

export interface AccountDto {
  id?: string;
  lastFourDigits: string;
  balance: number;
  accountType: string;
  bank: BankDto;
  isUpiEnabled: boolean;
  isNetBankingEnabled: boolean;
}

export interface OnboardingDto {
  userConfig: UserConfigDto;
  accounts: AccountDto[];
  cashBalance: number;
}