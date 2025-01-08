const monthsToText = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export function useFormat() {

    const formatSimpleDate = (date: string | undefined) => {
        if(!date) return `Sem data`;
        const currentDate = new Date(date);
        currentDate.setDate(currentDate.getDate() + 1)
        const monthToText = monthsToText[currentDate.getMonth()];
        const newDate = `${currentDate.getDate().toString().padStart(2, "0")} de ${monthToText}`
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