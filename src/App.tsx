import "./index.css"
import { useContext } from "react";
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

export default function App() {
  const { setModalContent } = useContext(ModalContext);
  const { formatDate, formatRealValue } = useFormat();
  const { state } = useFetch<Debts[]>({ route: "/debts" });
  const { state: balanceData } = useFetch<Balance[]>({ route: "/balances/current-month" });
  const { debtsMetric, balanceMetric, getCurrentDebitPayment, erningsPerDay } = useMetric();


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
    <div className="p-4 w-screen min-h-screen max-w-[480px] bg-slate-800 mx-auto flex flex-col gap-4 items-center text-white">
      <h1 className="text-3xl font-bold uppercase p-3">finance app</h1>
      <div className="w-full flex flex-wrap justify-evenly">
        <Box
          title="Saldo"
          value={`R$ ${balanceMetric(balanceData.data).balances.toFixed(2).replace(".", ",")}`}
        />
        <Box
          title="Contas"
          value={`R$ ${debtsMetric(state.data).debtsTotal.toFixed(2).replace(".", ",")}`}
          isNegative
        />
        <Box
          title="Contas hà pagar"
          value={`R$ ${debtsMetric(state.data).debtsCurrentMonth.toFixed(2).replace(".", ",")}`}
          isNegative
        />

        <Box
          title="Você precisa fazer sem folga"
          value={`R$ ${erningsPerDay({ balances: balanceData.data, debts: state.data, timeOff: false })}/dia`}
          width="w-4/5"
          isNegative
        />

        <Box
          title="Você precisa fazer com folga"
          value={`R$ ${erningsPerDay({ balances: balanceData.data, debts: state.data, timeOff: true })}/dia`}
          width="w-4/5"
          isNegative
        />
      </div>

      <div className="flex flex-col gap-3 max-h-[300px] w-full overflow-auto border border-slate-500 p-4 rounded-md">
        {state.data?.map(debt =>
          <div
            key={debt.id}
            className="w-full flex gap-2 justify-start items-center"
          >
            <div
              data-paid={getCurrentDebitPayment(debt)?.is_paid}
              className="w-4 h-4 rounded-full data-[paid=true]:bg-green-900 bg-red-900"
            ></div>
            <span className="w-1/3">{debt.title}</span>
            <span className="w-1/3">{formatRealValue(debt.value)}</span>
            <span className="w-1/3">{formatDate(getCurrentDebitPayment(debt)?.payment_in)}</span>
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
            <span className="w-1/3">{formatDate(balance.created_at)}</span>
            <MdDelete
              className="fill-red-800 bg-red-200 rounded-full size-6 cursor-pointer"
              onClick={()=> handleDeleteBalance(balance.id)}
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
