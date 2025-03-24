import { Debts_payment } from "./debtsPayment.types";

export interface Debts {
    id: string
    title: string
    description?: string | null;
    value: number;
    debts_payment: Debts_payment[]
    created_at: string
}