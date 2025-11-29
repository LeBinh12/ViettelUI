import { API_URL } from "../config/config";
import type { ListTopCustomersResponse, StatisticalResponse, TotalPackageByCategory } from "../types/statistical";
import axiosClient from "../utils/axiosClient";

export const statisticalApi = {
    totalCustomer: async (): Promise<StatisticalResponse> => {
        const response = await axiosClient.get<StatisticalResponse>(`${API_URL}/Statistical/total-customers`);
        return response.data
    },
    totalPackage: async (): Promise<StatisticalResponse> => {
        const response = await axiosClient.get<StatisticalResponse>(`${API_URL}/Statistical/total-packages`);
        return response.data
    },
    totalPackageByCategory: async (): Promise<TotalPackageByCategory> => {
        const response = await axiosClient.get<TotalPackageByCategory>(`${API_URL}/Statistical/total-packages-by-category`);
        return response.data
    },
    tamperedInvoicesCount: async (): Promise<StatisticalResponse> => {
        const response = await axiosClient.get<StatisticalResponse>(`${API_URL}/Statistical/tampered-invoices-count`);
        return response.data
    },
    monthlyRevenue: async (year: number): Promise<TotalPackageByCategory> => {
        const response = await axiosClient.get<TotalPackageByCategory>(`${API_URL}/Statistical/monthly-revenue/${year}`);
        return response.data
    },
    topCustomer: async (): Promise<ListTopCustomersResponse> => {
        const response = await axiosClient.get<ListTopCustomersResponse>(`${API_URL}/Statistical/top-customers?top=5`);
        return response.data
    },
    dailySummary: async (): Promise<ListTopCustomersResponse> => {
        const response = await axiosClient.get<ListTopCustomersResponse>(`${API_URL}/Statistical/daily-summary`);
        return response.data
    },
}