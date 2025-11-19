import axiosClient from "../utils/axiosClient";
import { API_URL } from "../config/config";
import type { CustomerAddRequest, CustomerAddResponse, CustomerDeleteResponse, GetAllCustomerResponse } from "../types/customer";


export const customerApi = {
    getAll: async (): Promise<GetAllCustomerResponse> => {
        const response = await axiosClient.get<GetAllCustomerResponse>(`${API_URL}/Customer/get-all`);
        return response.data
    },
    add: async (req: CustomerAddRequest): Promise<CustomerAddResponse> => {
        console.log("CustomerAddRequest:", req)
        const response = await axiosClient.post<CustomerAddResponse>(`${API_URL}/Customer/add`, req);
        return response.data
    },
    update: async (req: CustomerAddRequest, id: string): Promise<CustomerAddResponse> => {
        const response = await axiosClient.post<CustomerAddResponse>(`${API_URL}/Customer/update/${id}`, req);
        return response.data
    },
    delete: async (id: string): Promise<CustomerDeleteResponse> => {
        const response = await axiosClient.post<CustomerDeleteResponse>(`${API_URL}/Customer/delete/${id}`);
        return response.data
    },
}