export function useFormat() {

    const formatDate = (date: string | undefined) => {

        const currentDate = date ? new Date(date) : new Date();
        const newDate = `${currentDate.getDate().toString().padStart(2, "0")}-${currentDate.getMonth().toString().padStart(2, "0")}-${currentDate.getFullYear()}`
        return newDate
    }


    const formatRealValue = (value: number) => {
        return `R$ ${value.toFixed(2).replace(".", ",")}`
    }

    return {
        formatDate,
        formatRealValue
    }
};