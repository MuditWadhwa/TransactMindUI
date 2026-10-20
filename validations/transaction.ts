import { z } from "zod";

export const transactionSchema = z
  .object({
    type: z.enum(["EXPENSE", "INCOME", "TRANSFER"], { message: "Select a valid transaction type" }),
    amount: z.number().min(1, { message: "Amount must be greater than 0" }),
    transactionDate: z.string().optional(),
    description: z.string().optional(),
    accountId: z.string().optional(),
    toAccountId: z.string().optional(),
    cardId: z.string().optional(),
    paymentModeId: z.string().optional(),
    categoryId: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.type === "TRANSFER" && data.accountId && data.toAccountId) {
        return data.accountId !== data.toAccountId;
      }
      return true;
    },
    {
      message: "Source and destination accounts cannot be the same",
      path: ["toAccountId"],
    }
  );

export type TransactionFormValues = z.infer<typeof transactionSchema>;