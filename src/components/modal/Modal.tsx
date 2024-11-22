import { useContext } from "react";
import { ModalContext } from "../../context/ModalContext";

export function Modal() {
    const { modalContent } = useContext(ModalContext);

    return (
        modalContent?.map((modal, index: number) => {
            return (
                modal.components &&
                <div
                    key={index}
                    className="w-screen h-screen overflow-hidden backdrop-blur-sm fixed top-0 right-0 flex justify-end z-50"
                >
                    {modal.components}
                </div>
            )
        })
    )
};