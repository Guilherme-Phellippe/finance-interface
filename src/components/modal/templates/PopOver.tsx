import { MouseEvent, RefObject, useContext, useEffect, useRef } from "react"
import { ModalContext } from "../../../context/ModalContext";

interface PopOver {
    message: string,
    type?: "INFORMATION" | "WARNING" | "ERROR",
    functionAfterComplete?: () => void,
    id: string;
}

export function PopOver({ message, type = "INFORMATION", functionAfterComplete, id }: PopOver) {
    const { clearModal } = useContext(ModalContext)
    const contentRef: RefObject<HTMLDivElement> = useRef(null);
    const background = type === "INFORMATION" ? "bg-green-500/70" : type === "WARNING" ? "bg-orange-500/70" : "bg-red-800/70";
    const TIME_PROGRESSING = ((message?.length) / 2) + 10

    useEffect(() => {
        window.scrollTo({ behavior: "smooth", top: 0 })
        const progress: HTMLDivElement | null | undefined = contentRef.current?.querySelector("div#progress")
        let counter = 0

        if (!progress) return

        const interval = setInterval(() => {
            progress.style.width = counter + "%"

            if (counter === 100) {
                clearInterval(interval)
                clearModal(id)
                // Função que será executada após o termino do progress da modal
                functionAfterComplete && functionAfterComplete();
            }

            counter += 1;
        }, TIME_PROGRESSING)

        return () => clearInterval(interval)
    }, [])

    const handleCloseModal = (e: MouseEvent<HTMLDivElement>) => {
        const isModal = e.currentTarget.dataset.testid;
        functionAfterComplete && functionAfterComplete();
        if (!!isModal) clearModal(id);
    }

    return (
        <div
            className="w-screen h-screen text-light flex justify-end items-start md:mt-12 animate-jump-screen z-[999]"
            ref={contentRef}
            data-testid="modal-pop-over"
            onClick={handleCloseModal}
        >
            <div
                className={`w-full md:w-auto max-w-[400px] ${background} md:rounded-lg shadow-sm shadow-white/20`}
            >
                <div className="flex justify-center items-center px-4">
                    <div className="p-4 w-full text-white">
                        <h2>{message}</h2>
                    </div>
                </div>
                <div
                    className={`w-[0%] h-[5px] bg-white`}
                    id="progress"
                ></div>
            </div>
        </div>
    )
};