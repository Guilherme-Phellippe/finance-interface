export function useFormat() {

    const formatSimpleDate = (date: string | undefined) => {
        const currentDate = date ? new Date(date) : new Date();
        const newDate = `${currentDate.getDate().toString().padStart(2, "0")}-${currentDate.getMonth().toString().padStart(2, "0")}-${currentDate.getFullYear()}`
        return newDate
    }

    const getDay = (date: string | undefined) => {
        if(!date) return;
        const day = (new Date(date).getDate() + 1).toString().padStart(2, "0")
        return day
    }


    const formatRealValue = (value: number) => {
        return `R$ ${value.toFixed(2).replace(".", ",")}`
    }

    return {
        formatSimpleDate,
        getDay,
        formatRealValue
    }
};