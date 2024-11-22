import axios from "axios";
const server_url = import.meta.env.VITE_SERVER_HOST;

export const api = axios.create({
    baseURL: server_url
})