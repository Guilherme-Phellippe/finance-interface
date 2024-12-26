import { InputHTMLAttributes } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface Input extends InputHTMLAttributes<HTMLInputElement> { 
    register?: UseFormRegisterReturn<any>
}

export function Input({ register, ...props }: Input) {

    return (
        <input
            {...props}
            {...register}
            className="p-2 bg-slate-600 text-white"
        />
    )
};