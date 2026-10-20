import { LanguagePreferenceDto, OnboardingDto } from "@/types/onboarding.dto";
import { apiClient } from "./apiClient";
import { PaymentModeDto } from "@/types/transaction.dto";

export const onboardingService = {
  async getSupportedLanguagePreferences() {
    return await apiClient<LanguagePreferenceDto>('/dashboard/language-preferences');
  },

  async onboardUser(requestBody: OnboardingDto) {
    return await apiClient<OnboardingDto>('/dashboard/onboard-user', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });
  },

  async getSupportedPaymentModes() {
    return await apiClient<PaymentModeDto[]>('/payment-modes');
  },
}