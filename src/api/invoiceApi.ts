import { toast } from "react-toastify";
import { API_URL } from "../config/config";
import type { InvoicePaymentCallback } from "../types/invoice";
import type { InvoiceCheckHistoryRequest, InvoiceCheckHistoryResponse, InvoiceHistoryResponse, InvoiceResponse } from "../types/payment";
import axiosClient from "../utils/axiosClient";

export const invoiceApi = {
    confirm: async (token: string): Promise<InvoicePaymentCallback> => {
        const response = await axiosClient.post<InvoicePaymentCallback>(
            `${API_URL}/invoice/payment-callback`,
            { desc: token }
        );
        return response.data;
    },

    getById: async (Id: string): Promise<InvoiceResponse> => {
        return axiosClient.get<InvoiceResponse>(`${API_URL}/invoice/${Id}`).then(res => res.data);
    },

    requestHistory: async (req: InvoiceCheckHistoryRequest): Promise<InvoiceResponse> => {
        return (await axiosClient.post<InvoiceResponse>(`${API_URL}/invoice/request-history-token`, req)).data;
    },

    response: async (token: string): Promise<InvoiceHistoryResponse> => {
        return axiosClient.get<InvoiceHistoryResponse>(`${API_URL}/invoice/get-by-customer/${token}`).then(res => res.data);
    },

    isValidUUID: (Id: string): boolean => {
        const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidV4Regex.test(Id);
    },

};
