import { Balance } from "../@types/balance.types";
import { api } from "../libs/axios";

export async function createBalance(data: Pick<Balance, "description" | "value">) {

    const response = await api.post(`/balance/create`, { data }).catch(err => console.error(err));

    if (!response) return;

    return response.data;
}


export async function deleteBalance(id: string) {
    try {
        const response = await api.delete(`/balance/delete/${id}`)

        if (!response) return;

        return response.data;
    } catch (error) {
        console.log(error)
    }
}
