export function useFormat() {

    const formatRealValue = (value: number) => {
        return `R$ ${value.toFixed(2).replace(".", ",")}`
    }

    return {
        formatRealValue
    }
};