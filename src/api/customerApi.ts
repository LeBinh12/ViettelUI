import axiosClient from "../utils/axiosClient";
import { API_URL } from "../config/config";
import type { GetAllCustomerResponse } from "../types/customer";


export const customerApi = {
    getAll: async (): Promise<GetAllCustomerResponse> => {
        const response = await axiosClient.get<GetAllCustomerResponse>(`${API_URL}/Customer/get-all`);
        return response.data
    },

}