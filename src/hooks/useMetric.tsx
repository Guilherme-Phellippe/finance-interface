import { useSearchParams } from "react-router-dom";
import { Debts } from "../@types/debts.types"
import { useDate } from "./useDate";
import { variableSearchParams, variablesLocalStorage } from "../variables";

export function useMetric() {
    const [params] = useSearchParams();
    const { currentDate } = useDate();
    const paramsCurrentMonth = params.get(variableSearchParams.month);
    const date = paramsCurrentMonth ? currentDate(paramsCurrentMonth) : currentDate();

    const getCurrentDebitPayment = (debt: Debts | undefined) => {
        if (!debt) return;
        // console.log("Tamanho:", debt.debts_payment.length)
        const foundedDebit = debt?.debts_payment.find(debt => {
            // console.log(debt.payment_in, date.toISOString(), currentDate(debt.payment_in).isSame(date.toISOString(), "month"))
            return currentDate(debt.payment_in).isSame(date.toISOString(), "month")
        });
        // console.log("Debt:", foundedDebit)

        return foundedDebit
    }

    const debtsMetric = (debts: Debts[] | undefined) => {
        const debtsTotal = debts?.reduce((total, debt) => total + (getCurrentDebitPayment(debt) ? debt.value : 0), 0) || 0;

        const debtsCurrentMonth = debts?.filter(debt => currentDate(getCurrentDebitPayment(debt)?.payment_in).isSame(date.toISOString(), "month"))
            .reduce((total, debt) => total + ((getCurrentDebitPayment(debt) && !getCurrentDebitPayment(debt)?.is_paid) ? debt.value : 0), 0) || 0;

        // busca o ultimo debit do mês....
        const lastDebtOfTheMonth = getCurrentDebitPayment(debts?.filter(debt => currentDate(getCurrentDebitPayment(debt)?.payment_in).isSame(date.toISOString(), "month"))
            .sort((a, b) => {
                const paymentA = getCurrentDebitPayment(a)?.payment_in || date.toISOString();
                const paymentB = getCurrentDebitPayment(b)?.payment_in || date.toISOString();
                return currentDate(paymentB).date() - currentDate(paymentA).date()
            })[0])


        return {
            debtsTotal,
            debtsCurrentMonth,
            lastDebtOfTheMonth
        }
    }

    const balanceMetric = () => {
        const balances = localStorage.getItem(variablesLocalStorage.balance)
        return Number(balances) || 0;
    }


    const erningsPerDay = ({ debts }: { debts: Debts[] | undefined }) => {
        const debtsCurrentMonth = debtsMetric(debts).debtsCurrentMonth; // Valor total das dividas do atual mês
        const lastDebtOfTheMonth = debtsMetric(debts).lastDebtOfTheMonth; // Busca a data do ultima dívida
        if (!lastDebtOfTheMonth) return 0;

        const monthInDays = Array.from({ length: currentDate(lastDebtOfTheMonth.payment_in).month() }).reduce((total: number, _, index) => total + currentDate().subtract(index, "month").daysInMonth(),  currentDate(lastDebtOfTheMonth.payment_in).date());
        const currentMonthInDays = Array.from({ length: currentDate().month() }).reduce((total: number, _, index) => total + currentDate().subtract(index, "month").daysInMonth(), currentDate().date());
        const daysToPay = monthInDays - currentMonthInDays // Dias restantes para pagar (Será acrescido um dia para que ele conte o dia atual)
        
        const balance = balanceMetric() // Busca o saldo da conta
        const debtsMinusCurrentBalance = debtsCurrentMonth - balance // Subtrai o valor total da divida com o saldo da conta
        const result = ((debtsMinusCurrentBalance / daysToPay)).toFixed(2).replace(".", ",");
        return result;
    }


    return {
        debtsMetric,
        balanceMetric,
        erningsPerDay,
        getCurrentDebitPayment
    }
}