import { useEffect, useState } from "react";
import InvoiceTable from "../components/Invoice/InvoiceTable";
import ShowInvoiceForm from "../components/Invoice/ShowInvoiceForm";
import type {
  InvoiceResponseFilterDto,
  InvoiceFilterDto,
} from "../types/invoice";
import type { InvoiceDetail } from "../components/Invoice/ShowInvoiceForm";
import { invoiceApi } from "../api/invoiceApi";

const InvoiceScreen = () => {
  const [invoices, setInvoices] = useState<InvoiceResponseFilterDto[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDetail | null>(
    null
  );
  const [isCallback, setIsCallback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        setError(null);

        const filter: InvoiceFilterDto = {}; // Có thể thêm filter nếu cần
        const response = await invoiceApi.getAll(filter);

        if (response.succeeded && response.data) {
          setInvoices(response.data);
        } else {
          setError(response.message || "Không thể tải dữ liệu hóa đơn");
        }
      } catch (err) {
        console.error(err);
        setError("Đã xảy ra lỗi khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [isCallback]);

  const handleView = async (id: string) => {
    try {
      // Gọi API getById để lấy chi tiết invoice
      const response = await invoiceApi.getById(id);

      if (response.succeeded && response.data) {
        const invoice = response.data.invoice;
        const customer = invoice.customer;
        const pkg = invoice.package;

        // Map sang InvoiceDetail
        setSelectedInvoice({
          id: invoice.id,
          amount: invoice.amount,
          fullName: customer.fullName,
          phone: customer.phone,
          packageName: pkg.packageName,
          durationMonths: pkg.durationMonths,
          dueDate: invoice.dueDate,
          status:
            invoice.status === 1
              ? "Đã thanh toán"
              : invoice.status === 0
              ? "Chờ thanh toán"
              : "Đã hủy",
          lastModified: invoice.lastModified,
          note: invoice.note || "Không có ghi chú",
        });
      } else {
        console.error("Không thể tải chi tiết hóa đơn");
      }
    } catch (err) {
      console.error("Lỗi khi tải chi tiết hóa đơn:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-600 font-medium">Đang tải hóa đơn...</div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600 font-semibold">
        {error}{" "}
        <button
          onClick={() => setIsCallback((prev) => !prev)}
          className="ml-2 px-3 py-1 bg-red-100 rounded hover:bg-red-200"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Quản lý hóa đơn</h2>

      <InvoiceTable
        invoices={invoices}
        onView={handleView}
        onBackupSuccess={() => setIsCallback((prev) => !prev)}
      />

      <ShowInvoiceForm
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  );
};

export default InvoiceScreen;
