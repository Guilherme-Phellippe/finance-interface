import { useForm } from "react-hook-form"
import { debtSchema, DebtSchema } from "../../schemas/debt.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";
import { useContext } from "react";
import { ModalContext } from "../../context/ModalContext";
import { createDebt } from "../../api/debt.api";
import { PopOver } from "../modal/templates/PopOver";

interface FormCreateDebts { }

export function FormCreateDebts({ }: FormCreateDebts) {
    const { setModalContent, clearModal } = useContext(ModalContext);
    const form = useForm<DebtSchema>({
        resolver: zodResolver(debtSchema)
    });

    const handleCreateDebt = async (data: DebtSchema) => {
        const cleaned = data.value.replace(/[^\d,.-]/g, '');
        const formatValue = parseFloat(cleaned.replace(",", "."));
        const payment_in = new Date(data.payment_in).toISOString();

        const response = await createDebt({ ...data, payment_in, value: formatValue });

        if (!response) {
            setModalContent({
                id: "error_create_debt",
                components: <PopOver
                    id="error_create_debt"
                    message="Erro ao tentar criar a despesa"
                    type="ERROR"
                />
            });
            return;
        };

        setModalContent({
            id: "success_create_debt",
            components: <PopOver
                id="success_create_debt"
                message="Despesa criada com sucesso!"
                functionAfterComplete={() => window.location.reload()}
            />
        })

    }

    return (
        <div className="p-4">
            <form
                onSubmit={form.handleSubmit(handleCreateDebt)}
                className="flex flex-col gap-4 p-4"
            >
                <Input
                    type="text"
                    placeholder="Digite o titulo da despesa"
                    register={form.register("title")}
                />
                {form.formState.errors.title?.message && <span className="bg-red-200 text-red-800 p-1">{form.formState.errors.title.message}</span>}


                <Input
                    type="text"
                    placeholder="Deseja deixar uma descrição?"
                    register={form.register("description")}
                />
                {form.formState.errors.description?.message && <span className="bg-red-200 text-red-800 p-1">{form.formState.errors.description.message}</span>}


                <Input
                    type="string"
                    placeholder="Digite o valor do debito"
                    register={form.register("value")}
                />
                {form.formState.errors.value?.message && <span className="bg-red-200 text-red-800 p-1">{form.formState.errors.value.message}</span>}

                <Input
                    type="number"
                    placeholder="Digite a recorrencia"
                    register={form.register("recurrence")}
                />
                {form.formState.errors.recurrence?.message && <span className="bg-red-200 text-red-800 p-1">{form.formState.errors.recurrence.message}</span>}

                <Input
                    type="date"
                    placeholder="Quando será pago"
                    register={form.register("payment_in")}
                />
                {form.formState.errors.payment_in?.message && <span className="bg-red-200 text-red-800 p-1">{form.formState.errors.payment_in.message}</span>}


                <Button
                    type="submit"
                >Enviar</Button>
                <span
                    className="w-full text-center underline opacity-60 cursor-pointer"
                    onClick={() => clearModal("form_create_debts")}
                >Fechar formulário</span>
            </form>
        </div>
    )
};