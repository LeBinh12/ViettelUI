import axios from "axios";
import type { InternalAxiosRequestConfig, AxiosRequestHeaders } from "axios";
import { API_URL } from "../config/config";
console.log("URL", API_URL)
const axiosClient = axios.create({
    baseURL: API_URL,
    //   headers: {
    //     "X-API-Key": "becfce45-9237-4c6d-a7c5-f3be786249a5",
    //   },
});

// interceptor thêm JWT từ localStorage
axiosClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        const token = localStorage.getItem("access_token");

        if (!config.headers) {
            config.headers = {} as AxiosRequestHeaders;
        }

        if (token) {
            (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${token}`;
        }

        return config;
    }
);

export default axiosClient;