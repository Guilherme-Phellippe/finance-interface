import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import { useContext } from "react";
import { ModalContext } from "../../context/ModalContext";
import { PopOver } from "../modal/templates/PopOver";
import { balanceSchema, BalanceSchema } from "../../schemas/balance.schema";
import { createBalance } from "../../api/balance.api";

interface FormAddBalance { }

export function FormAddBalance({ }: FormAddBalance) {
    const { setModalContent, clearModal } = useContext(ModalContext);
    const form = useForm<BalanceSchema>({
        resolver: zodResolver(balanceSchema)
    });

    const handleAddBalance = async (data: BalanceSchema) => {

        const cleaned = data.value.replace(/[^\d,.-]/g, '');
        const formatValue = parseFloat(cleaned.replace(",", "."));

        const response = await createBalance({...data, value: formatValue });

        if(!response) {
            setModalContent({
                id: "error_create_debt",
                components: <PopOver 
                    id="error_create_debt"
                    message="Erro ao tentar adicionar o saldo"
                    type="ERROR"
                />
            });
            return;
        };

        setModalContent({
            id: "success_add_balance",
            components: <PopOver 
                id="success_create_debt"
                message="Saldo adicionado com sucesso!"
                functionAfterComplete={()=> window.location.reload()}
            />
        })

    }

    return (
        <div className="p-4">
            <form
                onSubmit={form.handleSubmit(handleAddBalance)}
                className="flex flex-col gap-4 p-4"
            >

                <Input
                    type="text"
                    placeholder="Deseja deixar uma descrição?"
                    register={form.register("description")}
                />
                {form.formState.errors.description?.message && <span className="bg-red-200 text-red-800 p-1">{form.formState.errors.description.message}</span>}


                <Input
                    type="string"
                    placeholder="Digite o valor da entrada"
                    register={form.register("value")}
                />
                {form.formState.errors.value?.message && <span className="bg-red-200 text-red-800 p-1">{form.formState.errors.value.message}</span>}


                <Button
                    type="submit"
                >Enviar</Button>
                <span
                    className="w-full text-center underline opacity-60 cursor-pointer"
                    onClick={()=> clearModal("form_add_balance")}
                >Fechar formulário</span>
            </form>
        </div>
    )
};