import { Debts } from "../@types/debts.types";
import { api } from "../libs/axios";

export async function createDebt(data: Pick<Debts, "title" | "description" | "value"> & { payment_in: String }) {

    const response = await api.post(`/debts/create`, { data }).catch(err => console.error(err));

    if (!response) return;

    return response.data;
}


export async function deleteDebt(id: string) {

    try {
        const response = await api.delete(`/debt/delete/${id}`)

        if (!response) return;

        return response.data;
    } catch (error) {
        console.log(error)
    }
}


export async function paymentDebt(id: string) {

    try {
        const response = await api.post(`/debts/pay/${id}`);

        if (!response) return;

        return response.data;
    } catch (error) {
        console.log(error)
    }

}