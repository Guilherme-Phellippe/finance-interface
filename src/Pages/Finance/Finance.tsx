import { useContext, useState } from "react";
import { Box } from "../../components/Box/Box";
import { ChooseMonth } from "../../components/ChooseMonth/ChooseMonth";
import { useFormat } from "../../hooks/useFormatDate";
import { useSearchParams } from "react-router-dom";
import { ModalContext } from "../../context/ModalContext";
import { useFetch } from "../../hooks/useFetch";
import { Debts } from "../../@types/debts.types";
import { useMetric } from "../../hooks/useMetric";
import { useDate } from "../../hooks/useDate";
import { variableSearchParams } from "../../variables";
import { deleteDebt, paymentDebt } from "../../api/debt.api";
import { PopOver } from "../../components/modal/templates/PopOver";
import { PopUp } from "../../components/modal/templates/PopUp";
import { FormAddBalance } from "../../components/FormAddBalance/FormAddBalance";
import { MdDelete, MdMoney } from "react-icons/md";
import { Button } from "../../components/Button/Button";
import { FormCreateDebts } from "../../components/FormCreateDebts/FormCreateDebts";

interface Finance { }

export function Finance({ }: Finance) {
    const { setModalContent } = useContext(ModalContext);
    const { formatRealValue } = useFormat();
    const [params] = useSearchParams();
    const { state: { data: debts, loading } } = useFetch<Debts[]>({ route: "/debts" });
    const { debtsMetric, balanceMetric, getCurrentDebitPayment, erningsPerDay } = useMetric();
    const { currentDate } = useDate();
    const currentMonth = params.get(variableSearchParams.month);
    const date = currentMonth ? currentDate(currentMonth) : currentDate();
    const filterDebtsCurrentMonth = debts?.filter(debt => getCurrentDebitPayment(debt) ? currentDate(getCurrentDebitPayment(debt)?.payment_in).isSame(date.toISOString(), "month") : false)
        .sort((a, b) => currentDate(getCurrentDebitPayment(a)?.payment_in).valueOf() - currentDate(getCurrentDebitPayment(b)?.payment_in).valueOf());
    const [selectDebt, setSelectDebit] = useState<Debts[]>();

    const handleDeleteDebt = async (id: string) => {

        const deleted = await deleteDebt(id);

        if (!deleted) {
            setModalContent({
                id: "fail_delete_debts",
                components: <PopOver
                    id="fail_delete_debts"
                    message="Falha ao tentar deletar a despesa"
                    type="ERROR"
                />
            });
            return;
        }

        setModalContent({
            id: "success_delete_debts",
            components: <PopOver
                id="success_delete_debts"
                message="Despesa deletada com sucesso!"
                functionAfterComplete={() => window.location.reload()}
            />
        })
    }

    const handlePayDebt = async (id: string | undefined) => {
        if (!id) return;
        const response = await paymentDebt(id);
        if (!response) {
            setModalContent({
                id: "fail_pay_debts",
                components: <PopOver
                    id="fail_pay_debts"
                    message="Falha ao tentar pagar a despesa"
                    type="ERROR"
                />
            });
            return;
        }

        setModalContent({
            id: "success_paga_debts",
            components: <PopOver
                id="success_paga_debts"
                message="Despesa paga com sucesso!"
                functionAfterComplete={() => window.location.reload()}
            />
        })
    }

    const handleAddBalance = () => {
        setModalContent({
            id: "form_add_balance",
            components: <PopUp blockCloseModalWithClickBackground>
                <FormAddBalance />
            </PopUp>
        })
    }


    const handleCreateDebt = () => {
        setModalContent({
            id: "form_create_debts",
            components: <PopUp blockCloseModalWithClickBackground>
                <FormCreateDebts />
            </PopUp>
        })
    }

    const handleSelectDebts = (debt: Debts) => {
        if(getCurrentDebitPayment(debt)?.is_paid) return;
        if (selectDebt?.find(select => select.id === debt.id)) {
            const removeDebt = selectDebt?.filter(select => select.id !== debt.id);
            setSelectDebit(removeDebt.length <= 0 ? undefined : removeDebt);
        } else {
            setSelectDebit(values => values ? [...values, debt] : [debt])
        }
    }


    return (
        loading ?
            <span>carregando...</span>
            :
            <div className="p-4 w-screen min-h-screen max-w-[480px] bg-slate-800 mx-auto flex flex-col gap-4 items-center text-white">
                <h1 className="text-3xl font-bold uppercase p-3">finance app</h1>
                <div className="w-full flex flex-wrap gap-4 justify-evenly">
                    <ChooseMonth />

                    <Box
                        title="Saldo"
                        value={`R$ ${balanceMetric()}`}
                    />

                    <Box
                        title="Contas hà pagar"
                        value={`R$ ${debtsMetric(selectDebt || filterDebtsCurrentMonth).debtsCurrentMonth.toFixed(2).replace(".", ",")}`}
                        isNegative
                    />

                    <Box
                        title="Contas total"
                        value={`R$ ${debtsMetric(selectDebt || filterDebtsCurrentMonth).debtsTotal.toFixed(2).replace(".", ",")}`}
                        isNegative
                    />
                    <Box
                        title="Objetivo diário"
                        value={`R$ ${erningsPerDay({ debts: selectDebt || filterDebtsCurrentMonth })}/dia`}
                        width="w-4/5"
                        isNegative
                    />
                </div>

                {/* LISTA DE DESPESAS  */}
                <div className="flex flex-col gap-1 max-h-[50vh] w-full overflow-auto border border-slate-500 p-4 rounded-md">
                    {filterDebtsCurrentMonth?.map(debt =>
                        <div
                            key={debt.id}
                            data-isselected={!!selectDebt?.find(select => select.id === debt.id)}
                            className="w-full flex gap-2 justify-start items-center data-[isselected=true]:bg-blue-800 py-2 px-1"
                        >
                            <div
                                data-paid={getCurrentDebitPayment(debt)?.is_paid}
                                className="w-6 h-4  data-[paid=true]:bg-green-900 bg-red-900"
                                onClick={() => handleSelectDebts(debt)}
                            ></div>
                            <span className="w-1/3 whitespace-nowrap text-ellipsis overflow-hidden">{debt.title}</span>
                            <span className="w-1/3">{formatRealValue(debt.value)}</span>
                            <span className="w-1/3">Dia {currentDate(getCurrentDebitPayment(debt)?.payment_in).format("DD/MM")}</span>
                            <MdMoney
                                className="fill-green-800 bg-green-200 rounded-full size-6 cursor-pointer"
                                onClick={() => handlePayDebt(getCurrentDebitPayment(debt)?.id)}
                            />
                            <MdDelete
                                className="fill-red-800 bg-red-200 rounded-full size-6 cursor-pointer"
                                onClick={() => handleDeleteDebt(debt.id)}
                            />
                        </div>
                    )}
                </div>

                <div className="w-full flex gap-4">
                    <Button
                        variant="red"
                        onClick={handleCreateDebt}
                    >Criar despesas</Button>

                    <Button
                        variant="green"
                        onClick={handleAddBalance}
                    >Adicionar saldo</Button>
                </div>
            </div>
    )
};