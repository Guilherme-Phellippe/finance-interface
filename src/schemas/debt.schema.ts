import { z } from "zod";

export type DebtSchema = z.infer<typeof debtSchema>;

export const debtSchema = z.object({
    title: z.string().min(1, "Informe o titulo da despesa."),
    description: z.string().optional().nullable(),
    value: z.coerce.string().min(1, "Valor minimo para despesa é de 1 real"),
    recurrence: z.coerce.number().min(1, "Informe um recorrencia para essa despesa"),
    payment_in: z.string()
})