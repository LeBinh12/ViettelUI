import { API_URL } from "../config/config";
import type { UserResponse } from "../types/user";
import axiosClient from "../utils/axiosClient";

export const userApi = {
    getProfile: async (token: string): Promise<UserResponse> => {
        console.log("data", `${API_URL}/UserAccount/validate?${token}`)
        const response = await axiosClient.get<UserResponse>(`${API_URL}/UserAccount/validate?token=${token}`);
        return response.data
    },
}