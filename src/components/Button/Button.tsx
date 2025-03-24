import { ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

interface Button extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "green" | "red"
}

export function Button({ variant, ...props }: Button) {
    return (
        <button
            data-variant={variant}
            className={twMerge("w-full py-2 px-4 text-lg bg-gray-700 font-bold border rounded-md  border-slate-600 data-[variant='red']:border-red-800 data-[variant='red']:text-red-500 data-[variant='green']:border-green-800 data-[variant='green']:text-green-500", props.className)}
            {...props}
        >{props.children}</button>
    )
};