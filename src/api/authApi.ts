import { API_URL } from "../config/config";
import type { LoginRequest, LoginResponse } from "../types/auth";
import axiosClient from "../utils/axiosClient";

export const authApi = {
    login: async (payload: LoginRequest): Promise<LoginResponse> => {
        const response = await axiosClient.post<LoginResponse>(`${API_URL}/UserAccount/login`, payload);
        return response.data;
    },
}   