import { twMerge } from "tailwind-merge"

interface Box {
    title: string,
    value: string
    isNegative?: boolean
    width?: `w-${string}` 
}

export function Box({ title, value, isNegative, width }: Box) {
    return (
        <div
            data-negative={isNegative}
            className={twMerge("group border p-4 relative rounded-md my-2 shadow-[0_2px_10px_#000] data-[negative=true]:border-red-800 border-green-900 data-[negative=true]:bg-red-800/30 bg-green-950/30", width)}
        >
            <span
                className="absolute whitespace-nowrap -top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border rounded-md px-2 bg-black/70 group-data-[negative=true]:border-red-800 border-green-900"
            >{title}</span>
            <p className="font-semibold w-full text-center">{value}</p>
        </div>
    )
};