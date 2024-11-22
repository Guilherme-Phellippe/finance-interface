import { useContext } from "react"
import { ModalContext } from "../../../context/ModalContext"

interface PopUp {
    children: any
    noBackground?: boolean
    positionModal?: "START" | "CENTER" | "END"
    blockCloseModalWithClickBackground?: boolean
}

export function PopUp({ children, noBackground, blockCloseModalWithClickBackground, positionModal = "CENTER" }: PopUp) {
    const { clearModal } = useContext(ModalContext)

    const handleCloseModal = ({ target }: any) => {
        // Bloqueia o clique no background para fechar o modal
        if (blockCloseModalWithClickBackground) return;
        // Fecha modal caso o clique tenha sido feito no background
        if (target.dataset.close) clearModal(null, { clearLast: true })
    }

    return (
        <div
            data-position={(window.innerWidth < 768) ? positionModal : "CENTER"}
            className="w-full h-full flex justify-center overflow-hidden data-[position='CENTER']:items-center data-[position='START']:items-start data-[position='END']:items-end"
            onClick={handleCloseModal}
            data-close
        >
            <div
                data-nobackground={!!noBackground}
                className="bg-slate-700 overflow-hidden text-slate-100 border border-primary-100 md:rounded-md data-[nobackground=true]:bg-transparent dark:data-[nobackground=true]:bg-transparent data-[nobackground=true]:border-none relative "
            >
                {children}
            </div>
        </div>
    )
};