import { type InvoiceDetail, mockInvoiceDetail } from "../data/mock/invoiceDetail";

export interface InvoiceDetailResponse {
  message: string;
  succeeded: boolean;
  data: InvoiceDetail;
  code: number;
}

export const invoiceDetailApi = {
  getInvoiceDetail: async (id: string): Promise<InvoiceDetailResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          message: "Lấy chi tiết hóa đơn thành công",
          succeeded: true,
          data: mockInvoiceDetail,
          code: 200,
        });
      }, 300);
    });
  },
};
