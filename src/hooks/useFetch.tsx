import axios from "axios"
import { useEffect, useState } from "react"
const server_url = import.meta.env.VITE_SERVER_HOST;

interface UseFetch {
    route: string,
    method: "get" | "post" | "put" | "delete" | "patch"
    options?: any
}

interface State<T> {
    data?: T,
    loading: boolean,
    error?: any
}

export function useFetch<T>({ options, route, method = "get" }: Partial<UseFetch>) {
    const [state, setState] = useState<State<T>>({
        loading: true,
    });

    useEffect(() => {
        (async ()=>{
            if (!route) return;
            const response = await fetch({ method, route, options });
            if(!response) return;
            setState({
                data: response, 
                loading: false, 
            })
        })();
    }, [])

    const fetch = async ({ method, options, route }: UseFetch): Promise<T | void> => {
        const response = await axios[method](`${server_url}${route}`, options).catch(err => console.error(err));
        if(!response) return;
        return response.data;
    }

    return {
        state,
        fetch
    }
};