import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import { RefObject, useContext, useRef } from "react";
import { ModalContext } from "../../context/ModalContext";
import { PopOver } from "../modal/templates/PopOver";
import { variablesLocalStorage } from "../../variables";

interface FormAddBalance { }

export function FormAddBalance({ }: FormAddBalance) {
    const { setModalContent, clearModal } = useContext(ModalContext);
    const containerInputValueRef: RefObject<HTMLDivElement> = useRef(null);

    const handleBalance = async (operator: "add" | "subtract") => {
        const currentBalance = Number(localStorage.getItem(variablesLocalStorage.balance)) || 0;
        const inputValue = containerInputValueRef.current?.querySelector("input");
        const value = Number(inputValue?.value) || 0;

        console.log(currentBalance, value)

        localStorage.setItem(variablesLocalStorage.balance, (operator === "add" ? (currentBalance + value) : (currentBalance - value)).toString());

        setModalContent({
            id: "success_add_balance",
            components: <PopOver
                id="success_create_debt"
                message={operator === "add" ? "Saldo adicionado com sucesso!" : "Saldo removido com sucesso!"}
                functionAfterComplete={() => window.location.reload()}
            />
        })
    }

    return (
        <div
            ref={containerInputValueRef}
            className="p-4"
        >
            <Input
                type="number"
                placeholder="Digite um valor"
            />

            <div className="w-full flex justify-evenly my-8">
                <Button
                    variant="red"
                    onClick={() => handleBalance("subtract")}
                >Remover</Button>
                <Button
                    onClick={() => handleBalance("add")}
                >Adicionar</Button>
            </div>
            <span
                className="w-full text-center underline opacity-60 cursor-pointer"
                onClick={() => clearModal("form_add_balance")}
            >Fechar formulário</span>
        </div>
    )
};