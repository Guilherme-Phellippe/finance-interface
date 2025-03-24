import { MdArrowLeft, MdArrowRight } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import { variableSearchParams } from "../../variables";
import { useDate } from "../../hooks/useDate";

interface ChooseMonth { }

export function ChooseMonth({ }: ChooseMonth) {
    const [params, setParams] = useSearchParams();
    const { currentDate } = useDate();
    const currentMonth = params.get(variableSearchParams.month) || currentDate().toISOString();

    const handleNextMonth = () => {
        const newMonth = currentDate(currentMonth).add(1, "month");
        params.set(variableSearchParams.month, newMonth.toISOString());
        setParams(params)
    }

    const handlePreviousMonth = () => {
        const newMonth = currentDate(currentMonth).subtract(1, "month");
        params.set(variableSearchParams.month, newMonth.toISOString());
        setParams(params)
    }

    return (
        <div className="w-full flex justify-center items-center gap-4">
            <MdArrowLeft
                onClick={handlePreviousMonth}
                className="text-5xl"
            />
            <h2
                className="text-2xl font-bold"
            >{currentDate(currentMonth).format("MMMM")} de {currentDate(currentMonth).format("YYYY")}</h2>
            <MdArrowRight
                onClick={handleNextMonth}
                className="text-5xl"
            />
        </div>
    )
};