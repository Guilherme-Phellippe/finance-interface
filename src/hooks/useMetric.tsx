import { Balance } from "../@types/balance.types";
import { Debts } from "../@types/debts.types"

export function useMetric() {

    const getCurrentDebitPayment = (debt: Debts | undefined) => {
        if (!debt) return;
        return debt?.debts_payment.find(debt => new Date(debt.payment_in).getMonth() === new Date().getMonth());
    }

    const debtsMetric = (debts: Debts[] | undefined, filterDate?: string) => {
        const debtsTotal = debts?.reduce((total, debt) => total + (getCurrentDebitPayment(debt) ? debt.value : 0), 0) || 0;

        const debtsCurrentMonth = debts?.filter(debt => {
            if (getCurrentDebitPayment(debt)) {
                if (!filterDate) return debt
                if ((new Date(debt.debts_payment[0].payment_in).getDate() + 1) <= new Date(filterDate).getDate() + 1) return debt
            }
        }).reduce((total, debt) => total + ((getCurrentDebitPayment(debt) && !getCurrentDebitPayment(debt)?.is_paid) ? debt.value : 0), 0) || 0;

        // busca o ultimo debit do mês....
        const lastDebtOfTheMonth = getCurrentDebitPayment(debts?.filter(debt => {
            if (getCurrentDebitPayment(debt)) {
                if (!filterDate) return debt
                // console.log((new Date(debt.debts_payment[0].payment_in).getDate() + 1), (new Date(filterDate).getDate() + 1), "=", (new Date(debt.debts_payment[0].payment_in).getDate() + 1) <= new Date(filterDate).getDate() + 1)
                if ((new Date(debt.debts_payment[0].payment_in).getDate() + 1) <= new Date(filterDate).getDate() + 1) return debt
            }
        }).sort((a, b) => {
            const paymentA = getCurrentDebitPayment(a)?.payment_in || new Date().toISOString();
            const paymentB = getCurrentDebitPayment(b)?.payment_in || new Date().toISOString();
            return new Date(paymentB).getDate() - new Date(paymentA).getDate();
        })[0])


        return {
            debtsTotal,
            debtsCurrentMonth,
            lastDebtOfTheMonth
        }
    }

    const balanceMetric = (balance: Balance[] | undefined) => {
        const balances = balance?.reduce((total, balance) => total + balance.value, 0) || 0;

        return {
            balances,
        }
    }


    const erningsPerDay = ({ balances, debts, dateToCalc, timeOffInDays = 0 }: { balances: Balance[] | undefined, debts: Debts[] | undefined, dateToCalc: string, timeOffInDays?: number }) => {
        const date = new Date(); // Data atual
        const debtsCurrentMonth = debtsMetric(debts, dateToCalc).debtsCurrentMonth; // Valor das dividas do atual mês
        console.log("Debito do atual mes", debtsCurrentMonth)
        const lastDebtOfTheMonth = debtsMetric(debts, dateToCalc).lastDebtOfTheMonth // Busca a data do ultima dívida
        if (!lastDebtOfTheMonth) return 0;

        const daysToPay = ((new Date(lastDebtOfTheMonth.payment_in).getDate() + 1) - date.getDate()); // Dias restantes para pagar (Será acrescido um dia para que ele conte o dia atual)
        console.log("dias para pagar:", (daysToPay - timeOffInDays));
        const balance = balanceMetric(balances).balances // Busca o saldo da conta
        // console.log("saldo:", balance)
        const debtsMinusCurrentBalance = debtsCurrentMonth - balance // Subtrai o valor total da divida com o saldo da conta
        // console.log("divida sem saldo conta", debtsMinusCurrentBalance)
        const result = ((debtsMinusCurrentBalance / (daysToPay - timeOffInDays))).toFixed(2).replace(".", ",");
        // console.log("result", result)
        return result;
    }


    return {
        debtsMetric,
        balanceMetric,
        erningsPerDay,
        getCurrentDebitPayment
    }
}