import { Button } from "@mui/material";

interface Confirm {
    title: string,
    subTitle?: string;
    confirmFunction: () => void,
    cancelFuntion: () => void,
}

export function Confirm({ title, subTitle, confirmFunction, cancelFuntion }: Confirm) {
    return (
        <div className="flex flex-col items-center gap-8 p-4">
            <div className="flex flex-col items-center">
                <h2 className="text-xl font-medium text-center">{title}</h2>
                <h3
                    data-display={!!subTitle}
                    className="opacity-80 data-[display=false]:hidden"
                >{subTitle}</h3>
            </div>
            <div className="w-full flex gap-4 justify-evenly ">

                <Button
                    onClick={confirmFunction}
                >Sim</Button>

                <button
                    onClick={cancelFuntion}
                    className="underline opacity-60"
                >Cancelar</button>
            </div>
        </div>
    )
};