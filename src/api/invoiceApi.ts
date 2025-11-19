import { API_URL } from "../config/config";
import type { InvoicePaymentCallback } from "../types/invoice";
import axiosClient from "../utils/axiosClient";

export const invoiceApi = {

    confirm: async (token: string): Promise<InvoicePaymentCallback> => {
        const response = await axiosClient.post<InvoicePaymentCallback>(
            `${API_URL}/invoice/payment-callback`,
            {
                desc: token
            }
        );
        return response.data;
    },
}