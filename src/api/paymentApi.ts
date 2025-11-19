import { API_URL } from "../config/config";
import type { InvoiceRequest, InvoiceResponseCheckResult, InvoiceResponseConfirmResult } from "../types/payment";
import axiosClient from "../utils/axiosClient";

export const paymentApi = {
    // API Đăng nhập
    // login: async (payload: LoginRequest): Promise<LoginResponse> => {
    //     const response = await axiosClient.post<LoginResponse>(
    //         `${API_URL}/UserAccount/login`,
    //         payload
    //     );
    //     return response.data;
    // },
    request: async (req: InvoiceRequest): Promise<InvoiceResponseCheckResult> => {
        const response = await axiosClient.post<InvoiceResponseCheckResult>(
            `${API_URL}/invoice/request`,
            req
        );
        return response.data;
    },
    confirm: async (token: string): Promise<InvoiceResponseConfirmResult> => {
        const response = await axiosClient.post<InvoiceResponseConfirmResult>(
            `${API_URL}/invoice/confirm`,
            {
                token: token
            }
        );
        return response.data;
    },
}