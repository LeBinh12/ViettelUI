import type { Invoice } from "../../types/invoice";

export interface InvoiceDetail extends Invoice {
  package: {
    name: string;
    durationMonths: number;
    description: string;
  };
  user: {
    name: string;
    email: string;
    phone: string;
  };
}

export const mockInvoiceDetail: InvoiceDetail = {
  id: "INV001",
  customerName: "Nguyễn Văn A",
  amount: 500000,
  date: "2025-01-20",
  status: "Paid",
  package: {
    name: "Gói Pro 6 tháng",
    durationMonths: 6,
    description: "Gói dịch vụ cao cấp dành cho doanh nghiệp nhỏ",
  },
  user: {
    name: "Nguyễn Văn A",
    email: "vana@example.com",
    phone: "0912345678",
  },
};
