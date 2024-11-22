import { z } from "zod";

export type BalanceSchema = z.infer<typeof balanceSchema>;

export const balanceSchema = z.object({
    description: z.string().optional().nullable(),
    value: z.coerce.string().min(1, "Valor minimo para despesa é de 1 real"),
})