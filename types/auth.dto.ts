export interface AuthResponseDto {
  accessToken: string;
  tokenType: string;
  expiresInSeconds: number;
  onboarded: boolean;
  expireAt: number;
}

export interface UserDetailsDto {
  email: string;
  name: string;
  isOnboardingComplete: boolean | null;
  languagePreference: string;
  spendLimit: number | null;
  currency: string;
  paymentMode: string;
}

export interface ApiResponse {
  status: string;
  message: string;
  timestamp: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RegisterRequestDto {
  name: string;
  email: string;
  password: string;
}