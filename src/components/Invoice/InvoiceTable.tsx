import React from "react";
import { Eye, AlertCircle, RefreshCcw } from "lucide-react";
import type {
  InvoiceResponseFilterDto,
  InvoiceStatus,
} from "../../types/invoice";
import { invoiceApi } from "../../api/invoiceApi";
import { toast } from "react-toastify";

interface InvoiceTableProps {
  invoices: InvoiceResponseFilterDto[];
  onView: (id: string) => void;
  onBackupSuccess: () => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  onView,
  onBackupSuccess,
}) => {
  const getStatusLabel = (status: InvoiceStatus): string => {
    switch (status) {
      case 0:
        return "Chờ thanh toán";
      case 1:
        return "Đã thanh toán";
      case 2:
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const getStatusColor = (status: InvoiceStatus): string => {
    switch (status) {
      case 0:
        return "bg-yellow-100 text-yellow-800";
      case 1:
        return "bg-green-100 text-green-800";
      case 2:
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const handlerBackUp = async (id: string) => {
    try {
      const res = await invoiceApi.backup(id);
      if (!res.data) {
        toast.error(`Lỗi: ${res.succeeded}`);
      }
      toast.success(res.message);
      onBackupSuccess();
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th>Mã hóa đơn</th>
            <th>Khách hàng</th>
            <th>Email</th>
            <th>SĐT</th>
            <th>Gói dịch vụ</th>
            <th>Số tiền</th>
            <th>Trạng thái</th>
            <th>Ngày tạo</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {invoices.map((invoice) => (
            <tr key={invoice.invoiceId} className="hover:bg-gray-50">
              <td>{invoice.invoiceId.substring(0, 8)}...</td>
              <td>{invoice.customerName}</td>
              <td>{invoice.email}</td>
              <td>{invoice.phone}</td>
              <td>{invoice.packageName}</td>
              <td>{invoice.amount.toLocaleString("vi-VN")} đ</td>
              <td>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    invoice.status
                  )}`}
                >
                  {invoice.isTampered && (
                    <AlertCircle size={14} className="text-red-600" />
                  )}
                  {getStatusLabel(invoice.status)}
                </span>
              </td>
              <td>{formatDate(invoice.createdAt)}</td>
              <td className="flex gap-2 items-center">
                {/* Xem chi tiết */}
                <button
                  onClick={() => onView(invoice.invoiceId)}
                  className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-900 transition"
                >
                  <Eye size={16} />
                </button>

                {/* Nút Backup/Callback */}
                <button
                  onClick={() => handlerBackUp(invoice.invoiceId)}
                  disabled={!invoice.isTampered}
                  className={`p-2 rounded-full transition ${
                    invoice.isTampered
                      ? "bg-rose-100 text-rose-600 hover:bg-rose-200"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <RefreshCcw size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {invoices.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Không có hóa đơn nào
        </div>
      )}
    </div>
  );
};

export default InvoiceTable;
