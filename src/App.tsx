import "./index.css"
import { useContext, useState } from "react";
import { Debts } from "./@types/debts.types";
import { Box } from "./components/Box/Box"
import { Button } from "./components/Button/Button";
import { useFetch } from "./hooks/useFetch";
import { ModalContext } from "./context/ModalContext";
import { PopUp } from "./components/modal/templates/PopUp";
import { FormCreateDebts } from "./components/FormCreateDebts/FormCreateDebts";
import { useFormat } from "./hooks/useFormatDate";
import { MdDelete, MdMoney } from "react-icons/md";
import { deleteDebt, paymentDebt } from "./api/debt.api";
import { PopOver } from "./components/modal/templates/PopOver";
import { FormAddBalance } from "./components/FormAddBalance/FormAddBalance";
import { Balance } from "./@types/balance.types";
import { useMetric } from "./hooks/useMetric";
import { deleteBalance } from "./api/balance.api";
import { Input } from "./components/Input/Input";

export default function App() {
  const { setModalContent } = useContext(ModalContext);
  const { formatSimpleDate, formatRealValue } = useFormat();
  const { state: { data: debts, loading } } = useFetch<Debts[]>({ route: "/debts" });
  const { state: balanceData } = useFetch<Balance[]>({ route: "/balances/current-month" });
  const { debtsMetric, balanceMetric, getCurrentDebitPayment, erningsPerDay } = useMetric();
  const [dateToCalc, setDateToCalc] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString()) // Define o mês todo para o calculo
  const [timeOffInDays, setTimeOffInDays] = useState(0);


  const handleCreateDebt = () => {
    setModalContent({
      id: "form_create_debts",
      components: <PopUp blockCloseModalWithClickBackground>
        <FormCreateDebts />
      </PopUp>
    })
  }

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

  const handleDeleteBalance = async (id: string) => {

    const deleted = await deleteBalance(id);

    if (!deleted) {
      setModalContent({
        id: "fail_delete_balance",
        components: <PopOver
          id="fail_delete_balance"
          message="Falha ao tentar remover o saldo"
          type="ERROR"
        />
      });
      return;
    }

    setModalContent({
      id: "success_delete_balance",
      components: <PopOver
        id="success_delete_balance"
        message="Saldo removido com sucesso!"
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



  return (
    loading && balanceData.loading ? 
    <span>carregando...</span>
    :
    <div className="p-4 w-screen min-h-screen max-w-[480px] bg-slate-800 mx-auto flex flex-col gap-4 items-center text-white">
      <h1 className="text-3xl font-bold uppercase p-3">finance app</h1>
      <div className="w-full flex flex-wrap gap-4 justify-evenly">

        <Input
          type="date"
          placeholder="Calculo"
          style={{ width: "75%" }}
          onChange={(e) => setDateToCalc(new Date(e.target.value).toISOString())}
        />

        <Input
          type="number"
          min={0}
          max={31}
          placeholder="Folgas"
          onChange={(e)=> setTimeOffInDays(Number(e.target.value || "0"))}
          style={{ width: "20%" }}
        />


        <Box
          title="Saldo"
          value={`R$ ${balanceMetric(balanceData.data).balances.toFixed(2).replace(".", ",")}`}
        />
        <Box
          title="Contas total"
          value={`R$ ${debtsMetric(debts).debtsTotal.toFixed(2).replace(".", ",")}`}
          isNegative
        />

        <Box
          title="Contas hà pagar"
          value={`R$ ${debtsMetric(debts).debtsCurrentMonth.toFixed(2).replace(".", ",")}`}
          isNegative
        />

        <Box
          title="Objetivo diário"
          value={`R$ ${erningsPerDay({ balances: balanceData.data, debts, dateToCalc, timeOffInDays })}/dia`}
          width="w-4/5"
          isNegative
        />
      </div>

      <div className="flex flex-col gap-3 max-h-[300px] w-full overflow-auto border border-slate-500 p-4 rounded-md">
        {debts?.map(debt =>
          <div
            key={debt.id}
            data-isactive={new Date(debt.debts_payment[0].payment_in).getDate() <= new Date(dateToCalc).getDate()}
            className="w-full flex gap-2 justify-start items-center data-[isactive=false]:opacity-30"
          >
            <div
              data-paid={getCurrentDebitPayment(debt)?.is_paid}
              className="w-4 h-4 rounded-full data-[paid=true]:bg-green-900 bg-red-900"
            ></div>
            <span className="w-1/3">{debt.title}</span>
            <span className="w-1/3">{formatRealValue(debt.value)}</span>
            <span className="w-1/3">{formatSimpleDate(getCurrentDebitPayment(debt)?.payment_in)}</span>
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

      <div className="flex flex-col gap-3 max-h-[300px] w-full overflow-auto border border-slate-500 p-4 rounded-md">
        {balanceData.data?.map(balance =>
          <div
            key={balance.id}
            className="w-full flex gap-2 justify-start items-center"
          >
            <span className="w-1/3">{balance.description}</span>
            <span className="w-1/3">{formatRealValue(balance.value)}</span>
            <span className="w-1/3">{formatSimpleDate(balance.created_at)}</span>
            <MdDelete
              className="fill-red-800 bg-red-200 rounded-full size-6 cursor-pointer"
              onClick={() => handleDeleteBalance(balance.id)}
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
}
