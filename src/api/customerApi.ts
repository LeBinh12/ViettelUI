import axiosClient from "../utils/axiosClient";
import { API_URL } from "../config/config";
import type { CustomerAddRequest, CustomerAddResponse, CustomerDeleteResponse, CustomerResponse, GetAllCustomerResponse } from "../types/customer";
import type { LoginCustomer, LoginRequest, LoginResponse } from "../types/auth";


export const customerApi = {
    loginMagic: async (email: string): Promise<LoginResponse> => {
        const response = await axiosClient.post<LoginResponse>(
            `${API_URL}/Customer/login-magic`,
            {
                email: email
            }
        );
        return response.data;
    },

    login: async (payload: LoginCustomer): Promise<LoginResponse> => {
        const response = await axiosClient.post<LoginResponse>(
            `${API_URL}/Customer/login`,
            payload
        );
        return response.data;
    },

    getMe: async (): Promise<CustomerResponse> => {
        const response = await axiosClient.get<CustomerResponse>(
            `${API_URL}/Profile/me`,
        );
        return response.data;
    },



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