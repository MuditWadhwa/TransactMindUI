import { z } from "zod";

export const onboardingSchema = z.object({
  languagePreference: z.string().length(2, { message: "Must be exactly 2 characters long" }),
  spendLimit: z.number().min(1, { message: "Must be greater than 1" }),
  currency: z.string().length(3, { message: "Must be exactly 3 characters long" }),
  paymentMode: z.string().min(1, { message: "Payment mode is required" }),
  cashBalance: z.number().min(0, { message: "Cash balance cannot be negative" }),
  accounts: z.array(
    z.object({
      lastFourDigits: z.string().length(4, { message: "Must be exactly 4 digits" }),
      balance: z.number().min(0, { message: "Balance cannot be negative" }),
      accountType: z.enum(["SAVINGS", "CREDIT"], { message: "Select a valid account type" }),
      bank: z.object({
        id: z.string().min(1, { message: "Bank ID is required" }),
        name: z.string().min(1, { message: "Bank name is required" }),
      }),
      isUpiEnabled: z.boolean().optional(),
      isNetBankingEnabled: z.boolean().optional()
    })
  ).optional()
});

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;