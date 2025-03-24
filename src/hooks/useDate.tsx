import moment from "moment-timezone"

export function useDate() {
    const currentDate = (date?: string) => date ? moment.tz(date, "America/Sao_Paulo") : moment.tz(moment().toISOString(), "America/Sao_Paulo")

    return {
        currentDate,
    }
};