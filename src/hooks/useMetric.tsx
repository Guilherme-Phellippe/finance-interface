import { Balance } from "../@types/balance.types";
import { Debts } from "../@types/debts.types"

export function useMetric() {

    const getCurrentDebitPayment = (debt: Debts | undefined) => {
        return debt?.debts_payment.find(debt => new Date(debt.payment_in).getMonth() === new Date().getMonth());
    }

    const debtsMetric = (debts: Debts[] | undefined) => {
        const debtsTotal = debts?.reduce((total, debt) => total + debt.value, 0) || 0;

        const debtsCurrentMonth = debts?.reduce((total, debt) => total + (getCurrentDebitPayment(debt)?.is_paid ? 0 : debt.value), 0) || 0;

        const lastDebtOfTheMonth = getCurrentDebitPayment(debts?.sort((a, b) => {
            const paymentA = getCurrentDebitPayment(a)?.payment_in;
            const paymentB = getCurrentDebitPayment(b)?.payment_in;
            if(!paymentA || !paymentB) return 1
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


    const erningsPerDay = ({ balances, debts, timeOff = true }: { balances: Balance[] | undefined, debts: Debts[] | undefined, timeOff: boolean }) => {
        const date = new Date();
        const debtsCurrentMonth = debtsMetric(debts).debtsCurrentMonth;
        const lastDebtOfTheMonth = debtsMetric(debts).lastDebtOfTheMonth
        const daysToPay = (new Date(lastDebtOfTheMonth?.payment_in || new Date()).getDate()) - date.getDate();
        const timeOffInDays = timeOff ? (date.getDate() > 21 ? 1 : date.getDate() > 14 ? 2 : date.getDate() > 7 ? 3 : 4) : 0;
        const balance = balanceMetric(balances).balances
        const debtsMinusCurrentBalance = debtsCurrentMonth - balance

        return ((debtsMinusCurrentBalance / (daysToPay - timeOffInDays))).toFixed(2).replace(".", ",")
    }


    return {
        debtsMetric,
        balanceMetric,
        erningsPerDay,
        getCurrentDebitPayment
    }
}